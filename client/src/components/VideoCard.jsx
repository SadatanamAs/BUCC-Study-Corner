import React from 'react';
import { ArrowUpRight, Clock3, Heart, PlayCircle } from 'lucide-react';
import { getYouTubeThumbnailUrl } from '../lib/videos.js';

export default function VideoCard({ video, onWatch, isFavorite = false, onToggleFavorite }) {
  const thumbnail = getYouTubeThumbnailUrl(video.url);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_20px_70px_rgba(2,6,23,0.35)] transition hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="relative h-44 overflow-hidden bg-slate-800">
        {thumbnail ? (
          <img src={thumbnail} alt={video.title || 'Video thumbnail'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-500/25 via-indigo-600/30 to-violet-600/25">
            <PlayCircle className="h-12 w-12 text-cyan-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
        {video.category ? (
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-200">
            {video.category}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div>
          {video.duration ? (
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              {video.duration}
            </div>
          ) : null}
          <h3 className="text-lg font-semibold text-slate-100">{video.title}</h3>
          {video.description ? (
            <p className="mt-2 text-sm leading-6 text-slate-400">{video.description}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {video.instructor ? (
              <p className="text-sm text-slate-500">By {video.instructor}</p>
            ) : null}
            {onToggleFavorite ? (
              <button
                onClick={onToggleFavorite}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 text-sm font-medium text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-pink-400/30 hover:text-pink-300"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'text-pink-300' : 'text-slate-400'}`} />
                {isFavorite ? 'Starred' : 'Star'}
              </button>
            ) : null}
          </div>
          <button
            onClick={() => onWatch(video)}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400/20 hover:text-cyan-200"
          >
            Play
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
