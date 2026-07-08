import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Video, Sparkles } from 'lucide-react';
import { addVideo, loadVideos, removeVideo } from '../lib/videos.js';

const emptyForm = {
  title: '',
  category: 'Frontend',
  description: '',
  duration: '',
  instructor: '',
  url: ''
};

export default function Admin() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadVideos().then((list) => {
      if (!cancelled) setVideos(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const topicOptions = useMemo(() => {
    return Array.from(new Set(videos.map((video) => video.category).filter(Boolean))).sort();
  }, [videos]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!form.title || !form.url || !form.description) {
      setError('Please fill in the title, description, and YouTube link.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await addVideo({
        title: form.title,
        category: form.category,
        description: form.description,
        duration: form.duration,
        instructor: form.instructor,
        url: form.url,
      });
      setVideos((current) => [created, ...current]);
      setForm(emptyForm);
      setNotice('Resource published to the public dashboard.');
    } catch (err) {
      setError(err.message || 'Failed to publish resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    setError('');
    setNotice('');
    try {
      await removeVideo(id);
      setVideos((current) => current.filter((video) => video.id !== id));
      setNotice('Resource removed.');
    } catch (err) {
      setError(err.message || 'Failed to remove resource.');
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">// ADMIN PANEL</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Publish resources like a pro</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Add new study materials in seconds and push them directly into the public video library without leaving the dashboard.
          </p>
        </div>

        <Link to="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-200">
          Back to dashboard
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add a new resource</h2>
              <p className="text-sm text-slate-400">Paste a YouTube link and share your curated lesson.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="title" value={form.title} onChange={handleChange} placeholder="Lesson title" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500" />
              <div className="relative">
                <input
                  list="topic-list"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Topic (e.g. Linked List)"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
                />
                <datalist id="topic-list">
                  {topicOptions.map((topic) => (
                    <option key={topic} value={topic} />
                  ))}
                </datalist>
              </div>
            </div>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description for the public card" rows="3" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (e.g. 20 min)" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500" />
              <input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor name" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500" />
            </div>
            <input name="url" value={form.url} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500" />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                {submitting ? 'Publishing…' : 'Publish resource'}
              </button>
              {notice ? <p className="text-sm text-cyan-300">{notice}</p> : null}
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            </div>
          </form>
        </div>

        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Current library</h2>
              <p className="text-sm text-slate-400">Manage and remove published resources.</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {videos.length ? (
              videos.map((video) => (
                <div key={video.id} className="flex items-start justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div>
                    <p className="font-semibold text-slate-100">{video.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{video.category} • {video.duration}</p>
                  </div>
                  <button onClick={() => handleRemove(video.id)} className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-rose-400/40 hover:text-rose-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
                No resources yet — add the first one to bring your dashboard to life.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}