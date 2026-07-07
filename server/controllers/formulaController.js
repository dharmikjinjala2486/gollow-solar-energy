import prisma from '../prisma/db.js';

export async function getAllFormulas(req, res) {
  try {
    const list = await prisma.formulaConfig.findMany();
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve configs.' });
  }
}

export async function updateFormula(req, res) {
  const { id } = req.params;
  const { value, description } = req.body;

  if (value === undefined) {
    return res.status(400).json({ error: 'Config value is required.' });
  }

  try {
    const updated = await prisma.formulaConfig.update({
      where: { id },
      data: { 
        value: Number(value),
        description,
      },
    });
    return res.json(updated);
  } catch (error) {
    console.error('Update config error:', error);
    return res.status(500).json({ error: 'Failed to update config.' });
  }
}
