import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export default function ResourcePost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/resources" replace />;

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-cream min-h-screen">

      <section className="w-full pt-40 pb-12 px-6 md:px-14">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-forest mb-8 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Resources
          </Link>
          <span className="inline-block px-3 py-1 bg-gold/10 text-gold-dark text-[11px] font-bold uppercase tracking-wide rounded-full mb-5">
            {post.category}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display font-extrabold text-ink text-[32px] sm:text-[44px] leading-[1.1] tracking-[-0.02em] mb-5"
          >
            {post.title}
          </motion.h1>
          <p className="text-ink/45 text-sm">
            {post.date} · {post.readTime}
          </p>
        </div>
      </section>

      <section className="w-full px-6 md:px-14 mb-14">
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden aspect-[16/9] shadow-xl">
          <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="w-full px-6 md:px-14 pb-20">
        <div className="max-w-2xl mx-auto">
          {post.content.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-ink/75 text-lg leading-relaxed mb-6"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </section>

      <section className="w-full bg-white py-20 px-6 md:px-14">
        <div className="max-w-5xl mx-auto">
          <h3 className="font-display font-bold text-2xl text-ink mb-10">
            More Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {related.map((p) => (
              <Link key={p.slug} to={`/resources/${p.slug}`} className="group block">
                <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/9]">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-display font-bold text-lg text-ink mb-2 group-hover:text-forest transition-colors">
                  {p.title}
                </h4>
                <span className="text-forest text-sm font-semibold inline-flex items-center gap-1.5">
                  Read More <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}