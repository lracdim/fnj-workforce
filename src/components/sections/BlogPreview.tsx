import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../../data/blogPosts';

export default function BlogPreview() {
  return (
    <section className="w-full bg-white py-28 px-6 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">From Our Blog</span>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-ink">Resources & Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
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
                <p className="text-sm text-ink/55 leading-relaxed mb-3">{post.excerpt}</p>
                <span className="text-forest text-sm font-semibold inline-flex items-center gap-1.5">
                  Read More
                  <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

