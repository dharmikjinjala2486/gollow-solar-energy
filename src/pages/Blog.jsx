import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, BookOpen, ChevronRight } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Regulations', 'Engineering', 'Maintenance', 'Finance', 'Sustainability'];

  useEffect(() => {
    setLoading(true);
    const categoryQuery = selectedCategory !== 'All' ? `&category=${selectedCategory}` : '';
    const searchQueryParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
    
    fetch(`/api/blogs?limit=50${categoryQuery}${searchQueryParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setBlogs(data.items);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pt-24 pb-16 overflow-hidden">
      {/* Header Banner */}
      <section className="relative py-20 bg-grid-pattern bg-[#04111f] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 to-brand-navy pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-10">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
            Knowledge Center
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
            Solar Education & Insights
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Stay up to date on solar leasing structures, engineering designs, grid regulations, and environmental offsets across the UAE.
          </p>
        </div>
      </section>

      {/* Directory Controls */}
      <section className="py-12 bg-[#04111f]/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-brand-yellow border-brand-yellow text-brand-navy'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, guidebooks..."
              className="w-full bg-white/5 border border-white/10 focus:border-brand-yellow/50 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
            />
          </div>
        </div>
      </section>

      {/* Grid of Articles */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="py-20 flex justify-center w-full">
            <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {blogs.map((art) => (
                  <motion.div
                    key={art.id || art.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={`/blog/${art.slug}`}
                      className="glass-card p-6 flex flex-col justify-between gap-6 text-left group hover:border-brand-yellow/30 h-full block"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] text-white/40">
                          <span className="bg-white/5 border border-white/10 text-white/60 font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {art.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(art.publishedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-base text-white group-hover:text-brand-yellow transition-colors leading-snug">
                          {art.title}
                        </h3>

                        <p className="text-xs text-white/50 leading-relaxed min-h-[60px] line-clamp-3">
                          {art.subtitle || 'Learn more about this solar energy project.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-white/5 rounded-md text-brand-yellow">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-white/60">{art.author}</span>
                        </div>
                        <span className="text-white/40 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {art.readTime}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {blogs.length === 0 && (
              <div className="text-center py-20 text-white/40 text-sm">
                No articles match your search or filter settings. Try searching for "Shams" or "Diesel".
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
