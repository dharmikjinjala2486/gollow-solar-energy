import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2, Copy } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    // Fetch article details
    fetch(`/api/blogs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Blog not found');
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        
        // Fetch related posts (same category, different slug)
        return fetch(`/api/blogs?category=${data.category}&limit=3`);
      })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.items) {
          setRelated(resData.items.filter((item) => item.slug !== slug));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-white/50 font-heading uppercase tracking-widest">Loading Article...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4 text-center px-6">
        <h2 className="font-heading font-extrabold text-2xl">Article Not Found</h2>
        <p className="text-xs text-white/60">The blog post you are looking for does not exist or has been archived.</p>
        <Link to="/blog" className="btn-primary text-xs mt-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>
      </div>
    );
  }

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.imageUrl,
    "genre": blog.category,
    "keywords": blog.tags,
    "publisher": "GOL LOW Solar Energy Systems Rental",
    "url": window.location.href,
    "datePublished": blog.publishedAt,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "description": blog.subtitle || blog.title
  };

  // Auto-generate Table of Contents from h3 tags in content
  const extractTOC = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const h3Elements = tempDiv.getElementsByTagName('h3');
    const items = [];
    for (let i = 0; i < h3Elements.length; i++) {
      items.push(h3Elements[i].innerText);
    }
    return items;
  };
  const tocItems = extractTOC(blog.content);

  return (
    <div className="pt-24 pb-16">
      {/* Schema Injection */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Breadcrumb & Navigation */}
      <div className="max-w-4xl mx-auto px-6 mb-8 text-left">
        <div className="flex items-center gap-2 text-xs text-white/40 mb-6 font-medium">
          <Link to="/" className="hover:text-brand-yellow transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-brand-yellow transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-[200px] sm:max-w-none">{blog.title}</span>
        </div>

        <Link 
          to="/blog" 
          className="inline-flex items-center gap-1.5 text-xs text-brand-yellow hover:text-brand-yellow/85 font-heading font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Article Hero Header */}
      <header className="max-w-4xl mx-auto px-6 text-left flex flex-col gap-4">
        <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest bg-brand-yellow/10 border border-brand-yellow/20 px-3.5 py-1 rounded-full w-fit">
          {blog.category}
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
          {blog.title}
        </h1>
        {blog.subtitle && (
          <p className="text-base sm:text-lg text-white/70 font-medium">
            {blog.subtitle}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-white/50 border-y border-white/10 py-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-yellow/15 flex items-center justify-center text-brand-yellow font-heading font-bold text-[10px]">
              {blog.author.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="font-semibold text-white/80">{blog.author}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-yellow" />
            <span>Published: {new Date(blog.publishedAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-yellow" />
            <span>{blog.readTime}</span>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
        
        {/* Left Side: Table of Contents & Social sharing */}
        <aside className="lg:col-span-3 lg:sticky lg:top-28 flex flex-col gap-6 text-left hidden lg:block">
          {tocItems.length > 0 && (
            <div className="glass-card p-5 border border-white/5 bg-[#04111f]/60">
              <h4 className="text-[10px] font-heading font-extrabold tracking-widest uppercase text-brand-yellow mb-3">
                Table of Contents
              </h4>
              <ul className="space-y-2 text-xs">
                {tocItems.map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={`#toc-${idx}`} 
                      className="text-white/60 hover:text-white transition-colors duration-300 block py-0.5 leading-snug"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Share panel */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-heading font-extrabold tracking-widest uppercase text-white/40">
              Share Article
            </h4>
            <div className="flex gap-2">
              <button 
                onClick={handleCopyLink}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-brand-yellow flex items-center justify-center text-white/60 hover:text-brand-yellow transition-all duration-300"
                title="Copy Link"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-brand-yellow flex items-center justify-center text-white/60 hover:text-brand-yellow transition-all duration-300"
                title="Share on LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
            {copied && (
              <span className="text-[10px] text-brand-green font-medium animate-pulse">Copied link to clipboard!</span>
            )}
          </div>
        </aside>

        {/* Center: Blog Content */}
        <article className="lg:col-span-9 glass-card p-6 md:p-10 border border-white/10 text-left">
          {/* Main image */}
          {blog.imageUrl && (
            <div className="w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden mb-8 border border-white/10">
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {/* Content Body (inject HTML) */}
          {/* Add custom styling for headings, lists, blockquotes to match tailwind style */}
          <div 
            className="prose prose-invert prose-sm sm:prose max-w-none text-white/80 leading-relaxed
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-white
              prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-brand-yellow
              prose-p:mb-5 prose-p:text-xs prose-p:sm:text-sm
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-5 prose-ul:space-y-1.5 prose-ul:text-xs prose-ul:sm:text-sm
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-5 prose-ol:space-y-1.5 prose-ol:text-xs prose-ol:sm:text-sm
              prose-blockquote:border-l-4 prose-blockquote:border-brand-yellow prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:my-6 prose-blockquote:rounded-r-xl prose-blockquote:text-white prose-blockquote:italic prose-blockquote:text-xs prose-blockquote:sm:text-sm
              prose-strong:text-white"
            dangerouslySetInnerHTML={{
              // Automatically inject ID markers for TOC anchors
              __html: blog.content.replace(/<h3>/g, (match, offset, string) => {
                // Determine header index
                const subStr = string.slice(0, offset);
                const index = (subStr.match(/<h3>/g) || []).length;
                return `<h3 id="toc-${index}">`;
              })
            }}
          />

          {/* Tags row */}
          {blog.tags && (
            <div className="flex flex-wrap gap-2 mt-10 border-t border-white/5 pt-6">
              {blog.tags.split(',').map((tag) => (
                <span 
                  key={tag} 
                  className="bg-white/5 border border-white/10 text-white/40 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </article>

      </div>

      {/* Related Blogs Block */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 mt-20 text-left border-t border-white/10 pt-16">
          <h3 className="font-heading font-extrabold text-xl text-white mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((post) => (
              <Link 
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="glass-card p-5 flex flex-col gap-3 group hover:border-brand-yellow/30"
              >
                <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider">
                  {post.category}
                </span>
                <h4 className="font-heading font-bold text-sm text-white group-hover:text-brand-yellow transition-colors leading-snug">
                  {post.title}
                </h4>
                <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
                  {post.subtitle || post.desc}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-brand-yellow/80 hover:text-brand-yellow mt-1 font-semibold">
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Helper chevron icon
function ChevronRight(props) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
