import React from 'react';
import { Star } from 'lucide-react';

export default function Category({ name, count, icon: Icon, isFavorite = false, onToggleFavorite, onSelect }) {
  return (
    <div
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyPress={(event) => {
        if (onSelect && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onSelect();
        }
      }}
      className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 shadow-[0_15px_50px_rgba(2,6,23,0.25)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:shadow-[0_25px_70px_rgba(56,189,248,0.12)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">{name}</p>
          <p className="text-xs text-slate-400">{count} resources</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">Focus</span>
        {onToggleFavorite ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(event);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition duration-300 hover:bg-pink-400/20 hover:text-pink-300"
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'text-pink-300' : 'text-slate-400'}`} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
