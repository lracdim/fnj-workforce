import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const categories = ['All', 'Hiring Strategy', 'Retention'];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = blogPosts.filter((post) => {
    const matchCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-cream min-h-screen">

      <section className="w-full pt-40 pb-16 px-6 md:px-14">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[12px] uppercase tracking-[0.16em] text-forest font-bold">
              Resources
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display font-extrabold text-ink text-[40px] sm:text-[52px] leading-[1.02] tracking-[-0.03em] mb-6"
          >
            Insights for{' '}
            <span className="accent-italic text-gold">smarter</span> hiring.
          </motion.h1>
          <p className="text-ink/65 text-lg max-w-xl mx-auto leading-relaxed">
            Practical guidance on hiring, retention, and building a workforce that lasts.
          </p>
        </div>
      </section>

      <section className="w-full px-6 md:px-14 mb-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors
                  ${activeCategory === cat
                    ? 'bg-forest text-cream'
                    : 'bg-white text-ink/60 hover:text-forest border border-ink/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-ink/10 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="w-full px-6 md:px-14 pb-28">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-ink/50 py-20">No articles found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={`/resources/${post.slug}`} className="group block">
                    <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="inline-block px-3 py-1 bg-gold/10 text-gold-dark text-[11px] font-bold uppercase tracking-wide rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-display font-bold text-ink mb-2 group-hover:text-forest transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-ink/55 leading-relaxed mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink/40">
                        {post.date} · {post.readTime}
                      </span>
                      <ArrowRight size={14} className="text-forest group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}