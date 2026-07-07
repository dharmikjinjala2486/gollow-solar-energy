import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, LayoutDashboard, FileText, Users, Calculator, Plus, Trash2, 
  Check, Edit, Download, RefreshCw, Eye, Power, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('gollow_admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Dashboard Tabs & Telemetry
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ inquiriesCount: 0, subscribersCount: 0, blogsCount: 0, totalSizedKw: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Blog CRUD editor state
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSubtitle, setBlogSubtitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Engineering');
  const [blogAuthor, setBlogAuthor] = useState('Sarah Jenkins');
  const [blogContent, setBlogContent] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [showBlogForm, setShowBlogForm] = useState(false);

  // Fetch stats and lists on login/tab changes
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    // Fetch stats
    fetch('/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 401) handleLogout();
        return res.json();
      })
      .then((data) => {
        if (data.inquiriesCount !== undefined) setStats(data);
      })
      .catch(console.error);

    // Fetch inquiries
    fetch('/api/inquiries', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setInquiries(data);
      })
      .catch(console.error);

    // Fetch subscribers
    fetch('/api/newsletter/subscribers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscribers(data);
      })
      .catch(console.error);

    // Fetch formulas
    fetch('/api/formulas', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFormulas(data);
      })
      .catch(console.error);

    // Fetch blogs
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setBlogs(data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token, activeTab]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid administrative login credentials.');
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('gollow_admin_token', data.token);
        setToken(data.token);
      })
      .catch((err) => {
        setLoginError(err.message);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('gollow_admin_token');
    setToken('');
  };

  // Inquiry actions
  const handleUpdateInquiryStatus = (id, status) => {
    fetch(`/api/inquiries/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then((updated) => {
        setInquiries(prev => prev.map(item => item.id === id ? updated : item));
      })
      .catch(console.error);
  };

  const handleDeleteInquiry = (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    fetch(`/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setInquiries(prev => prev.filter(item => item.id !== id));
      })
      .catch(console.error);
  };

  // CSV Export functions
  const handleExportCSV = (endpoint, filename) => {
    fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(console.error);
  };

  // Formula parameter update
  const handleUpdateFormula = (id, value, desc) => {
    fetch(`/api/formulas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ value: Number(value), description: desc })
    })
      .then((res) => res.json())
      .then((updated) => {
        setFormulas(prev => prev.map(f => f.id === id ? updated : f));
        alert('Pricing config updated successfully!');
      })
      .catch(console.error);
  };

  // Blog CRUD actions
  const handleBlogSave = (e) => {
    e.preventDefault();
    const blogData = {
      title: blogTitle,
      subtitle: blogSubtitle,
      category: blogCategory,
      author: blogAuthor,
      content: blogContent,
      imageUrl: blogImageUrl,
      tags: blogTags,
      readTime: blogReadTime
    };

    const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
    const method = editingBlog ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogData)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Blog save failed');
        return res.json();
      })
      .then(() => {
        alert('Blog article saved successfully!');
        setShowBlogForm(false);
        setEditingBlog(null);
        // Trigger blogs refresh
        setActiveTab('overview');
        setTimeout(() => setActiveTab('blogs'), 100);
      })
      .catch(console.error);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogSubtitle(blog.subtitle || '');
    setBlogCategory(blog.category);
    setBlogAuthor(blog.author);
    setBlogContent(blog.content);
    setBlogImageUrl(blog.imageUrl || '');
    setBlogTags(blog.tags || '');
    setBlogReadTime(blog.readTime || '5 min read');
    setShowBlogForm(true);
  };

  const handleDeleteBlog = (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setBlogs(prev => prev.filter(item => item.id !== id));
      })
      .catch(console.error);
  };

  const handleCreateBlogTrigger = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogSubtitle('');
    setBlogCategory('Engineering');
    setBlogAuthor('Sarah Jenkins');
    setBlogContent('');
    setBlogImageUrl('');
    setBlogTags('');
    setBlogReadTime('5 min read');
    setShowBlogForm(true);
  };

  // --- LOGIN GATED VIEW ---
  if (!token) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-grid-pattern">
        <div className="absolute inset-0 bg-[#061b2d]/50 pointer-events-none" />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-md glass-card p-8 border border-white/10 text-left"
        >
          <div className="flex flex-col gap-2 text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mx-auto mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-extrabold text-xl text-white">GOL LOW Admin Core</h2>
            <p className="text-xs text-white/50">Authorize credentials to access analytics & database controls</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Admin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Hr@gollowsolarenergy.com" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" 
              />
            </div>

            {loginError && (
              <span className="text-xs font-semibold text-red-400 mt-1 block">{loginError}</span>
            )}

            <button
              type="submit"
              className="btn-primary w-full mt-2"
            >
              <span>Unlock Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- LOGGED IN DASHBOARD VIEW ---
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#030d16] text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header toolbar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-white/15 mb-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-brand-yellow" />
              <span>GOL LOW Fleet Console</span>
            </h1>
            <p className="text-xs text-white/40 mt-0.5">Control panel database telemetry & parameters</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 font-semibold bg-white/5 border border-white/10 rounded-full px-3.5 py-1">
              Active Session: Hr@gollowsolarenergy.com
            </span>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
              title="Logout"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar Drawer */}
          <nav className="lg:col-span-3 flex flex-col gap-2">
            {[
              { id: 'overview', label: 'Overview Stats', icon: LayoutDashboard },
              { id: 'inquiries', label: 'Inquiry Leads', icon: Users },
              { id: 'subscribers', label: 'Subscribers List', icon: Users },
              { id: 'formulas', label: 'Pricing Multipliers', icon: Calculator },
              { id: 'blogs', label: 'Manage Blogs', icon: FileText }
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowBlogForm(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold font-heading transition-all duration-300 text-left ${
                    activeTab === tab.id
                      ? 'bg-brand-yellow border-brand-yellow text-brand-navy'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Core Content Window */}
          <div className="lg:col-span-9 w-full">
            {loading && (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && (
              <AnimatePresence mode="wait">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-8 text-left"
                  >
                    {/* KPI Widget Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-[#04111f] border border-white/5 rounded-2xl p-5">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block">Total Sized</span>
                        <span className="text-2xl font-heading font-black text-white mt-1 block">{stats.totalSizedKw} kWp</span>
                      </div>
                      <div className="bg-[#04111f] border border-white/5 rounded-2xl p-5">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block">Inquiries</span>
                        <span className="text-2xl font-heading font-black text-white mt-1 block">{stats.inquiriesCount} Leads</span>
                      </div>
                      <div className="bg-[#04111f] border border-white/5 rounded-2xl p-5">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block">Subscribers</span>
                        <span className="text-2xl font-heading font-black text-white mt-1 block">{stats.subscribersCount} Users</span>
                      </div>
                      <div className="bg-[#04111f] border border-white/5 rounded-2xl p-5">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block">Articles</span>
                        <span className="text-2xl font-heading font-black text-white mt-1 block">{stats.blogsCount} Posts</span>
                      </div>
                    </div>

                    {/* Quick leads summary */}
                    <div className="glass-card p-6 border border-white/10">
                      <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Recent Registrations</h3>
                        <button onClick={() => setActiveTab('inquiries')} className="text-brand-yellow text-xs font-semibold hover:text-brand-yellow/85">View All</button>
                      </div>
                      <div className="flex flex-col gap-3">
                        {inquiries.slice(0, 3).map((lead) => (
                          <div key={lead.id} className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl border border-white/5 text-xs">
                            <div>
                              <div className="font-bold text-white">{lead.name} • <span className="text-brand-yellow font-normal">{lead.company || 'Private'}</span></div>
                              <span className="text-white/40 text-[10px]">{lead.email} | {lead.emirate}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                              lead.status === 'Completed' ? 'bg-brand-green/20 text-brand-green' : lead.status === 'Contacted' ? 'bg-sky-500/20 text-sky-400' : 'bg-brand-yellow/20 text-brand-yellow'
                            }`}>
                              {lead.status}
                            </span>
                          </div>
                        ))}
                        {inquiries.length === 0 && <span className="text-white/40 text-xs">No entries recorded yet.</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. INQUIRIES LEADS TAB */}
                {activeTab === 'inquiries' && (
                  <motion.div
                    key="inquiries"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-heading font-bold text-base text-white uppercase tracking-wide">Client Inquiries & Bookings</h3>
                      <button 
                        onClick={() => handleExportCSV('/api/inquiries/export', 'gollow_solar_inquiries.csv')}
                        className="btn-primary !py-2 !px-4 text-xs font-heading"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    <div className="glass-card overflow-x-auto border border-white/10 text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5 text-white/50 border-b border-white/10 font-bold uppercase">
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Emirate</th>
                            <th className="px-4 py-3 text-center">Sizing specs</th>
                            <th className="px-4 py-3 text-center">Appointment</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white/80">
                          {inquiries.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-4">
                                <div className="font-bold text-white">{item.name}</div>
                                <div className="text-[10px] text-white/40">{item.company || 'Private'}</div>
                              </td>
                              <td className="px-4 py-4 text-white/60 font-semibold">{item.phone}</td>
                              <td className="px-4 py-4">{item.emirate}</td>
                              <td className="px-4 py-4 text-center">
                                <span className="block font-bold">{item.roofSize} m²</span>
                                <span className="text-[10px] text-white/40">{item.bill} AED / mo</span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                {item.preferredDate ? (
                                  <>
                                    <span className="block text-[10px] font-bold">{item.preferredDate}</span>
                                    <span className="text-[9px] text-brand-green uppercase font-semibold">{item.preferredTime}</span>
                                  </>
                                ) : (
                                  <span className="text-white/30 text-[10px]">None</span>
                                )}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <select
                                  value={item.status}
                                  onChange={(e) => handleUpdateInquiryStatus(item.id, e.target.value)}
                                  className="bg-brand-navy border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
                                >
                                  {['Pending', 'Contacted', 'Completed'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <button
                                  onClick={() => handleDeleteInquiry(item.id)}
                                  className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {inquiries.length === 0 && (
                        <div className="py-12 text-center text-white/40 text-xs">No inquiry registrations database entries.</div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 3. NEWSLETTER SUBSCRIBERS TAB */}
                {activeTab === 'subscribers' && (
                  <motion.div
                    key="subscribers"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-heading font-bold text-base text-white uppercase tracking-wide">Newsletter Subscribers</h3>
                      <button 
                        onClick={() => handleExportCSV('/api/newsletter/subscribers/export', 'gollow_subscribers.csv')}
                        className="btn-primary !py-2 !px-4 text-xs font-heading"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    <div className="glass-card overflow-hidden border border-white/10 text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5 text-white/50 border-b border-white/10 font-bold uppercase">
                            <th className="px-6 py-3">Subscriber Email</th>
                            <th className="px-6 py-3">Subscribed date</th>
                            <th className="px-6 py-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white/80">
                          {subscribers.map((sub) => (
                            <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-bold text-white">{sub.email}</td>
                              <td className="px-6 py-4">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                                  sub.active ? 'bg-brand-green/20 text-brand-green' : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {sub.active ? 'Active' : 'Unsubscribed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {subscribers.length === 0 && (
                        <div className="py-12 text-center text-white/40 text-xs">No email subscribers found in database.</div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 4. FORMULAS CONFIG TAB */}
                {activeTab === 'formulas' && (
                  <motion.div
                    key="formulas"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <h3 className="font-heading font-bold text-base text-white uppercase tracking-wide">
                      AI Sizer pricing multipliers config
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                      {formulas.map((item) => (
                        <FormulaConfigRow 
                          key={item.id} 
                          item={item} 
                          onSave={(val, desc) => handleUpdateFormula(item.id, val, desc)} 
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 5. BLOGS MANAGER TAB */}
                {activeTab === 'blogs' && (
                  <motion.div
                    key="blogs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-heading font-bold text-base text-white uppercase tracking-wide">Manage Blog Posts</h3>
                      {!showBlogForm && (
                        <button 
                          onClick={handleCreateBlogTrigger}
                          className="btn-primary !py-2 !px-4 text-xs font-heading"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create New Blog</span>
                        </button>
                      )}
                    </div>

                    {showBlogForm ? (
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleBlogSave} 
                        className="glass-card p-6 border border-white/10 flex flex-col gap-5 text-left"
                      >
                        <h4 className="font-heading font-bold text-sm text-brand-yellow uppercase tracking-wider border-b border-white/5 pb-2">
                          {editingBlog ? 'Edit Blog Article' : 'Draft New Blog Article'}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Title</label>
                            <input 
                              type="text" 
                              value={blogTitle}
                              onChange={(e) => setBlogTitle(e.target.value)}
                              placeholder="e.g. Shams Dubai Net-Metering Guide"
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" 
                            />
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Subtitle / Summary</label>
                            <input 
                              type="text" 
                              value={blogSubtitle}
                              onChange={(e) => setBlogSubtitle(e.target.value)}
                              placeholder="e.g. A roadmap for connection compliance"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Category</label>
                            <select
                              value={blogCategory}
                              onChange={(e) => setBlogCategory(e.target.value)}
                              className="w-full bg-[#061B2D] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50"
                            >
                              {['Regulations', 'Engineering', 'Maintenance', 'Finance', 'Sustainability'].map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Author Name</label>
                            <input 
                              type="text" 
                              value={blogAuthor}
                              onChange={(e) => setBlogAuthor(e.target.value)}
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" 
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Reading Time</label>
                            <input 
                              type="text" 
                              value={blogReadTime}
                              onChange={(e) => setBlogReadTime(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" 
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Comma separated Tags</label>
                            <input 
                              type="text" 
                              value={blogTags}
                              onChange={(e) => setBlogTags(e.target.value)}
                              placeholder="dewa,shams,roi"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" 
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Featured Image URL</label>
                          <input 
                            type="text" 
                            value={blogImageUrl}
                            onChange={(e) => setBlogImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" 
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Article Rich text content (supports raw html)</label>
                          <textarea 
                            value={blogContent}
                            onChange={(e) => setBlogContent(e.target.value)}
                            rows="10"
                            required
                            placeholder="<h3>Header title</h3><p>Main details...</p>"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50 font-mono resize-y" 
                          />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                          <button 
                            type="button" 
                            onClick={() => setShowBlogForm(false)}
                            className="btn-secondary !py-2.5 !px-5 text-xs"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn-primary !py-2.5 !px-6 text-xs"
                          >
                            Save & Publish
                          </button>
                        </div>
                      </motion.form>
                    ) : (
                      <div className="glass-card overflow-hidden border border-white/10 text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 text-white/50 border-b border-white/10 font-bold uppercase">
                              <th className="px-6 py-3">Blog Title</th>
                              <th className="px-6 py-3">Category</th>
                              <th className="px-6 py-3">Author</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-white/80">
                            {blogs.map((b) => (
                              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">{b.title}</td>
                                <td className="px-6 py-4">{b.category}</td>
                                <td className="px-6 py-4">{b.author}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                  <button
                                    onClick={() => handleEditBlog(b)}
                                    className="p-1.5 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow hover:text-brand-navy rounded transition-colors"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBlog(b.id)}
                                    className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {blogs.length === 0 && (
                          <div className="py-12 text-center text-white/40 text-xs">No blog articles database entries.</div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline Row Component for Formula Management
function FormulaConfigRow({ item, onSave }) {
  const [val, setVal] = useState(item.value);
  const [desc, setDesc] = useState(item.description || '');

  return (
    <div className="p-4 bg-[#04111f] border border-white/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
      <div className="flex flex-col text-left max-w-md">
        <span className="font-heading font-extrabold text-brand-yellow tracking-wider text-xs uppercase">{item.key.replace(/_/g, ' ')}</span>
        <input 
          type="text" 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="bg-transparent border-b border-transparent focus:border-white/20 text-white/50 text-[10px] mt-1 focus:outline-none" 
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <input
          type="number"
          step="0.01"
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-24 text-center font-heading font-bold text-white focus:outline-none focus:border-brand-yellow/50"
        />
        <button
          onClick={() => onSave(val, desc)}
          className="p-2 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-xl hover:bg-brand-green hover:text-white transition-colors"
          title="Save Config"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
