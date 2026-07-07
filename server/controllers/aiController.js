import prisma from '../prisma/db.js';

// Helper to fetch formulas from DB with safe defaults
async function getFormulaParams() {
  const configs = await prisma.formulaConfig.findMany();
  const params = {};
  configs.forEach(c => {
    params[c.key] = c.value;
  });

  return {
    rate_residential: params.rate_residential ?? 36,
    rate_commercial: params.rate_commercial ?? 28,
    rate_industrial: params.rate_industrial ?? 20,
    rate_construction: params.rate_construction ?? 48,
    rate_battery: params.rate_battery ?? 32,
    solar_yield_multiplier: params.solar_yield_multiplier ?? 145,
    co2_multiplier: params.co2_multiplier ?? 0.55,
  };
}

// 1. AI Calculator Endpoint
export async function calculateSavings(req, res) {
  const { bill, propertyType, roofSize, energyUsage, location, battery } = req.body;

  if (!bill || !propertyType || !roofSize) {
    return res.status(400).json({ error: 'Bill, property type, and roof size are required.' });
  }

  try {
    const params = await getFormulaParams();
    
    // Grid pricing assumptions in AED per kWh
    const gridRate = propertyType === 'Residential' ? 0.32 : propertyType === 'Commercial' ? 0.38 : 0.35;
    
    // Calculate monthly kWh from bill
    const monthlyKwh = energyUsage ? Number(energyUsage) : Number(bill) / gridRate;
    
    // Sizing: Target covering 75% of energy bills
    const targetKwh = monthlyKwh * 0.75;
    let targetKwp = targetKwh / params.solar_yield_multiplier;
    
    // Space limit: 1 kWp requires ~6 sq. meters
    const maxKwpBySpace = Number(roofSize) / 6;
    
    // Optimized final size
    const systemSize = Math.min(targetKwp, maxKwpBySpace);
    
    // Generation
    const annualGeneration = systemSize * params.solar_yield_multiplier * 12;
    const annualSavings = annualGeneration * gridRate;
    
    // 10-Year projection incorporating 4% utility inflation
    let tenYearSavings = 0;
    for (let i = 0; i < 10; i++) {
      tenYearSavings += annualSavings * Math.pow(1.04, i);
    }

    // Rental cost
    let leaseRate = params.rate_commercial;
    if (propertyType === 'Residential') leaseRate = params.rate_residential;
    if (propertyType === 'Industrial') leaseRate = params.rate_industrial;
    if (propertyType === 'Construction') leaseRate = params.rate_construction;

    let rentalCost = systemSize * leaseRate;
    if (battery) {
      // Add standard battery configuration: kWp sized * 2 hours of storage * battery lease rate
      const batteryKwh = systemSize * 2;
      rentalCost += batteryKwh * params.rate_battery;
    }

    const monthlySavingsVal = annualSavings / 12;
    const netMonthlySavings = Math.max(0, monthlySavingsVal - rentalCost);
    const carbonOffset = (annualGeneration * params.co2_multiplier) / 1000; // tons/year

    return res.json({
      systemSize: parseFloat(systemSize.toFixed(1)),
      monthlyRental: Math.round(rentalCost),
      annualSavings: Math.round(annualSavings),
      tenYearSavings: Math.round(tenYearSavings),
      netMonthlySavings: Math.round(netMonthlySavings),
      carbonOffset: parseFloat(carbonOffset.toFixed(1)),
      treesPlanted: Math.round(carbonOffset * 45),
      paybackPeriod: 'Immediate (OPEX Rental Model)',
      batteryRecommendation: battery ? `${Math.round(systemSize * 2)} kWh Modular LiFePO4 Enclosure` : 'Grid connected PPA'
    });
  } catch (error) {
    console.error('Calculator API Error:', error);
    return res.status(500).json({ error: 'Calculator simulation failed.' });
  }
}

// 2. AI Project Estimator Endpoint
export async function estimateProject(req, res) {
  const { sector, buildingSize, usage, shifts, backup } = req.body;

  if (!sector || !buildingSize || !usage) {
    return res.status(400).json({ error: 'Sector, building size, and annual energy usage are required.' });
  }

  try {
    const params = await getFormulaParams();
    
    // Annual yield per kWp (approx. 1.74 MWh in UAE)
    const annualMwhYield = (params.solar_yield_multiplier * 12) / 1000;
    
    let targetCoverage = 0.65;
    if (shifts === 'Day Shift Only') targetCoverage = 0.85;
    if (shifts === 'Night Shift Only') targetCoverage = 0.15;

    // Solar needed
    let solarKwp = (Number(usage) * targetCoverage) / annualMwhYield;
    
    // Battery sizing (kWh)
    let batteryKwh = 0;
    const peakDemandKw = (Number(usage) * 1000) / (365 * 12); // rough average peak demand approximation

    if (backup) {
      if (shifts === '24/7 Continuous') batteryKwh = peakDemandKw * 4.5;
      else if (shifts === 'Night Shift Only') batteryKwh = peakDemandKw * 8;
      else batteryKwh = peakDemandKw * 2;
      
      // Add extra solar array capacity to charge the battery
      solarKwp += (batteryKwh * 300 * 1.2) / 1000 / annualMwhYield;
    }

    const generationMwh = solarKwp * annualMwhYield;
    
    // Timeline
    let timelineWeeks = 6;
    if (solarKwp < 100) timelineWeeks = 3;
    else if (solarKwp > 500) timelineWeeks = 10;
    else if (solarKwp > 1000) timelineWeeks = 16;

    // Pricing
    let leaseRate = params.rate_commercial;
    if (sector === 'Residential') leaseRate = params.rate_residential;
    if (sector === 'Industrial') leaseRate = params.rate_industrial;
    if (sector === 'Construction') leaseRate = params.rate_construction;

    const panelRental = solarKwp * leaseRate;
    const batteryRental = batteryKwh * params.rate_battery;
    const monthlyRental = panelRental + batteryRental;

    // Panel count (assuming 550W panels)
    const panelCount = Math.round((solarKwp * 1000) / 550);

    // Inverter suggestion
    let inverter = 'Smart String Inverter 50kW';
    if (solarKwp < 20) inverter = 'Smart Hybrid Inverter 15kW';
    else if (solarKwp > 500) inverter = 'Multi-Cluster String Inverter System 500kW';
    else if (solarKwp > 100) inverter = 'Enterprise Parallel Inverters 150kW';

    return res.json({
      solarKwp: Math.round(solarKwp),
      batteryKwh: Math.round(batteryKwh),
      panelCount,
      inverterRecommendation: inverter,
      timelineWeeks,
      estimatedRental: Math.round(monthlyRental),
      estimatedGeneration: Math.round(generationMwh),
      maintenanceRecommendation: 'Scheduled bi-weekly waterless cleaning sweeps & annual thermal camera inspections.'
    });
  } catch (error) {
    console.error('Estimator API Error:', error);
    return res.status(500).json({ error: 'Estimator calculations failed.' });
  }
}

// 3. AI Chat Assistant Proxy (OpenAI + Smart fallback)
export async function chatAssistant(req, res) {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Message thread history is required.' });
  }

  const userQuery = messages[messages.length - 1]?.content || '';
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    // OpenAI Integration
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are GOL LOW Solar AI, a helpful, technical assistant representing 'GOL LOW Solar Energy Systems Rental' based in Dubai, UAE.
Our company provides zero-upfront solar rentals (OPEX lease or PPA models) for:
- Residential villas (flat monthly lease ~36 AED/kWp/mo)
- Commercial setups (PPA model, pay per kWh generated, at rates cheaper than DEWA grid)
- Industrial facilities (lease-to-own plans, ending in asset transfer, ~20 AED/kWp/mo)
- Construction off-grid sites (hybrid solar+battery containers replacing diesel generators, ~48 AED/kWp/mo)

We manage site drone surveys, DEWA Shams approvals, grid syncing, equipment (Tier-1 bifacial panels, modular LiFePO4 batteries), installations, and operations/scheduled washings.
Office Location: Al Muraqqabat, Port Saeed, Dubai, United Arab Emirates.
Phone: +971 4 337 7881. 24/7 Technical Support line: +971 50 987 6543.
Keep responses concise, premium, professional, and guide users to booking consultations.`
            },
            ...messages.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content || m.text
            }))
          ]
        })
      });

      const json = await response.json();
      const botResponse = json.choices?.[0]?.message?.content || 'I apologize, I experienced a network connection timeout. How else can I help?';
      return res.json({ content: botResponse });
    } catch (error) {
      console.error('OpenAI fetch error:', error);
      // Fall through to simulated fallback on API failure
    }
  }

  // Simulated Local NLP Fallback Router (Runs if no key or API fails)
  const normalizedQuery = userQuery.toLowerCase().trim().replace(/[?.]/g, '');
  let responseText = "I can assist you with sizing arrays, calculating monthly savings, and scheduling energy audits. How can GOL LOW serve your facility?";

  if (normalizedQuery.includes('how does solar rental work') || normalizedQuery.includes('solar rental')) {
    responseText = "GOL LOW installs complete solar systems (panels, inverters, and battery storage) at your facility with zero upfront costs. We handle survey audits, DEWA connections, and cleanings. You pay a flat monthly lease fee that is lower than your utility savings.";
  } else if (normalizedQuery.includes('upfront') || normalizedQuery.includes('invest') || normalizedQuery.includes('cost')) {
    responseText = "There is zero upfront capital investment (0 AED CAPEX). We finance and build the entire PV asset. Your monthly billing begins only after grid parallel connection is certified and power generation starts.";
  } else if (normalizedQuery.includes('construction') || normalizedQuery.includes('diesel')) {
    responseText = "We rent mobile solar container units integrated with modular batteries. They replace traditional noisy desert diesel generators, lowering site diesel refilling needs by up to 60%.";
  } else if (normalizedQuery.includes('call') || normalizedQuery.includes('contact') || normalizedQuery.includes('callback')) {
    responseText = "Sure, please use the contact form to submit your phone number and location, or contact our central Dubai hotline at +971 4 337 7881.";
  } else if (normalizedQuery.includes('plan') || normalizedQuery.includes('price') || normalizedQuery.includes('rate')) {
    responseText = "Our rental plans: Residential flat leases average 36 AED/kWp/mo; Commercial PPAs pay per kWh generated at low rates; Industrial lease-to-own starts at 20 AED/kWp/mo; and Construction containers start at 48 AED/kWp/mo.";
  }

  return res.json({ content: responseText });
}
