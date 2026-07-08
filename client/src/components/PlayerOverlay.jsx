import React from 'react';
import { X } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../lib/videos.js';

export default function PlayerOverlay({ video, onClose }) {
  const embedUrl = getYouTubeEmbedUrl(video.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-6">
      <div className="relative w-full max-w-3xl rounded-[28px] border border-white/10 bg-slate-900/95 shadow-[0_30px_80px_rgba(0,0,0,0.55)] max-h-[calc(100vh-3rem)] overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close player"
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/80 text-slate-100 transition duration-300 hover:bg-slate-800/90 hover:-translate-y-0.5"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="aspect-video bg-slate-900">
          {embedUrl ? (
            <iframe
              className="h-full w-full rounded-[32px]"
              src={`${embedUrl}&autoplay=1`}
              title={video.title || 'Video player'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white">Unable to load video</div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{video.title}</h2>
              {video.description ? (
                <p className="mt-2 text-sm leading-6 text-slate-300">{video.description}</p>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-slate-800/90"
            >
              Close
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
            {video.category ? (
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2">{video.category}</span>
            ) : null}
            {video.duration ? (
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2">{video.duration}</span>
            ) : null}
            {video.instructor ? (
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2">By {video.instructor}</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}