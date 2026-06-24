import { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import SlidePanel from '../components/ui/SlidePanel';
import { storage } from '../utils/storage';
import { initializeData, type BlogPost } from '../data/seed';

type TabType = 'all' | 'published' | 'drafts';

const CATEGORY_COLORS: Record<string, string> = {
  'Hiring Strategy': 'bg-[#0E5C3F] text-white',
  'Retention': 'bg-[#0E5C3F] text-white',
  'Industry News': 'bg-[#3B82F6] text-white',
  'Company Updates': 'bg-[#8B5CF6] text-white',
};

export default function BlogCMS() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
    setPosts(storage.get<BlogPost[]>('fnj_blog_posts') || []);
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  const filteredPosts = posts.filter(p => {
    if (activeTab === 'published') return p.status === 'published';
    if (activeTab === 'drafts') return p.status === 'draft';
    return true;
  });

  const savePosts = (updated: BlogPost[]) => {
    setPosts(updated);
    storage.set('fnj_blog_posts', updated);
  };

  const openNewPost = () => {
    setEditingPost(null);
    setPanelOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setPanelOpen(true);
  };

  const handleSave = (formData: Partial<BlogPost>) => {
    const now = new Date().toISOString();
    let updated: BlogPost[];

    if (editingPost) {
      updated = posts.map(p => {
        if (p.id !== editingPost.id) return p;
        return {
          ...p,
          ...formData,
          updatedAt: now,
          publishedAt: formData.status === 'published' ? (p.publishedAt || now) : null,
        } as BlogPost;
      });
      showToast('Changes saved');
    } else {
      const id = `POST-${String(posts.length + 1).padStart(3, '0')}`;
      const newPost: BlogPost = {
        id,
        title: formData.title || '',
        slug: formData.slug || '',
        category: formData.category || 'Hiring Strategy',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        status: formData.status || 'draft',
        publishedAt: formData.status === 'published' ? now : null,
        createdAt: now,
        updatedAt: now,
        readTime: formData.readTime || '5 min read',
        image: formData.image || '',
      };
      updated = [...posts, newPost];
      showToast('Post created');
    }

    savePosts(updated);

    if (formData.status === 'published') {
      const activity = storage.get<{ id: string; type: string; description: string; timestamp: string; entityId: string; entityType: string }[]>('fnj_activity') || [];
      activity.unshift({
        id: `ACT-${Date.now()}`,
        type: 'blog_published',
        description: `Blog post published: ${formData.title}`,
        timestamp: now,
        entityId: editingPost?.id || `POST-${posts.length + 1}`,
        entityType: 'blog',
      });
      storage.set('fnj_activity', activity);
    }

    setPanelOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    savePosts(updated);
    setDeleteConfirm(null);
    showToast('Post deleted');
  };

  const handleTogglePublish = (post: BlogPost) => {
    const newStatus: 'published' | 'draft' = post.status === 'published' ? 'draft' : 'published';
    const now = new Date().toISOString();
    const updated = posts.map(p => {
      if (p.id !== post.id) return p;
      return {
        ...p,
        status: newStatus,
        updatedAt: now,
        publishedAt: newStatus === 'published' ? (p.publishedAt || now) : null,
      } as BlogPost;
    });
    savePosts(updated);
    showToast(newStatus === 'published' ? 'Post published' : 'Post unpublished');
  };

  return (
    <AdminLayout>
      <Topbar title="Blog CMS" subtitle="Manage website blog posts" />
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 bg-[#F9F8F5] p-1 rounded-lg">
            {(['all', 'published', 'drafts'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-[#16201C] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#16201C]'
                }`}
              >
                {tab === 'all' ? 'All Posts' : tab === 'published' ? 'Published' : 'Drafts'}
              </button>
            ))}
          </div>
          <button
            onClick={openNewPost}
            className="px-5 py-2.5 bg-[#0E5C3F] text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-[#073D29] transition-colors"
          >
            New Post
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border border-[#E4E0D8] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-200 text-gray-700'}`}>
                    {post.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                    post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <h3 className="font-bold text-[#16201C] text-lg leading-snug mb-2">{post.title}</h3>
                <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mb-3">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-[#E4E0D8]">
                  <button
                    onClick={() => openEditPost(post)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-[#16201C] bg-[#F9F8F5] rounded-lg hover:bg-[#E4E0D8] transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
                    className="flex items-center justify-center px-3 py-2 text-[11px] font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold rounded-lg transition-colors ${
                      post.status === 'published'
                        ? 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                        : 'text-white bg-[#0E5C3F] hover:bg-[#073D29]'
                    }`}
                  >
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editingPost ? 'Edit Post' : 'New Post'}>
        <BlogForm post={editingPost} onSave={handleSave} onClose={() => setPanelOpen(false)} />
      </SlidePanel>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-slide-in">
            <h3 className="font-black uppercase text-[#16201C] text-sm tracking-tight mb-2">Delete Post?</h3>
            <p className="text-sm text-[#6B7280] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-[#6B7280] bg-[#F9F8F5] rounded-lg hover:bg-[#E4E0D8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16201C] text-white px-4 py-3 rounded-lg shadow-lg text-sm font-bold animate-slide-in">
          {toast}
        </div>
      )}
    </AdminLayout>
  );
}

function BlogForm({ post, onSave, onClose }: { post: BlogPost | null; onSave: (data: Partial<BlogPost>) => void; onClose: () => void }) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [category, setCategory] = useState(post?.category || 'Hiring Strategy');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [readTime, setReadTime] = useState(post?.readTime || '5 min read');
  const [image, setImage] = useState(post?.image || '');
  const [status, setStatus] = useState<'published' | 'draft'>(post?.status || 'draft');

  const generateSlug = (t: string) => {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (t: string) => {
    setTitle(t);
    if (!post) setSlug(generateSlug(t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, slug, category, excerpt, content, readTime, image, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
        >
          <option>Hiring Strategy</option>
          <option>Retention</option>
          <option>Industry News</option>
          <option>Company Updates</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={10}
          className="w-full px-4 py-2.5 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Read Time</label>
        <input
          type="text"
          value={readTime}
          onChange={e => setReadTime(e.target.value)}
          placeholder="5 min read"
          className="w-full px-4 py-2.5 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Image URL</label>
        <input
          type="url"
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2.5 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
        />
        {image && (
          <div className="mt-2 rounded-lg overflow-hidden h-32">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as 'published' | 'draft')}
          className="w-full px-4 py-2.5 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] bg-[#F9F8F5] rounded-lg hover:bg-[#E4E0D8] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#0E5C3F] rounded-lg hover:bg-[#073D29] transition-colors"
        >
          Save Post
        </button>
      </div>
    </form>
  );
}