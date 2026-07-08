import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, PlayCircle, Sparkles } from 'lucide-react';
import { loadVideos } from '../lib/videos.js';

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    }
  } catch {
    return null;
  }

  return null;
}

export default function Course() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadVideos().then((list) => {
      if (cancelled) return;
      const match = list.find((item) => item.id === id) || list[0];
      setVideo(match || null);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!video) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="glass-panel p-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">// COURSE DETAIL</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">The resource is loading.</h1>
          <p className="mt-3 text-slate-400">Head back to the library and pick a lesson to view.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>
        </div>
      </section>
    );
  }

  const videoId = getYouTubeId(video.url);
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-200">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel overflow-hidden">
          <div className="relative h-72 overflow-hidden bg-slate-800 sm:h-96">
            {thumbnail ? (
              <img src={thumbnail} alt={video.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-500/20 via-indigo-600/25 to-violet-600/25">
                <PlayCircle className="h-16 w-16 text-cyan-200" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-cyan-200">{video.category}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Clock3 className="h-4 w-4" />
                {video.duration}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-white">{video.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{video.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={video.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                <Sparkles className="h-4 w-4" />
                Watch now
              </a>
              <p className="text-sm text-slate-500">Delivered by {video.instructor}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">// LESSON NOTES</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">What to expect</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-400">
            <li className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">Fast-paced explanation with a strong focus on practical understanding.</li>
            <li className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">Perfect for revision sessions, interview prep, and quick concept refreshers.</li>
            <li className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">Build confidence by pairing the video with the polished resource library.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}