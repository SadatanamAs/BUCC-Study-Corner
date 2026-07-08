import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, BrainCircuit, Code2, Heart, Search, Sparkles, Zap } from 'lucide-react';
import Category from '../components/Category.jsx';
import VideoCard from '../components/VideoCard.jsx';
import PlayerOverlay from '../components/PlayerOverlay.jsx';
import { loadVideos } from '../lib/videos.js';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [topicSearch, setTopicSearch] = useState('');
  const [topicQuery, setTopicQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [topicFavorites, setTopicFavorites] = useState([]);

  useEffect(() => {
    let cancelled = false;
    loadVideos().then((list) => {
      if (!cancelled) setVideos(list);
    });
    const storedFavorites = JSON.parse(localStorage.getItem('bucc-favorites') || '[]');
    setFavorites(storedFavorites);
    const storedTopicFavorites = JSON.parse(localStorage.getItem('bucc-topic-favorites') || '[]');
    setTopicFavorites(storedTopicFavorites);
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = (id) => {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem('bucc-favorites', JSON.stringify(next));
  };

  const toggleTopicFavorite = (topic) => {
    const next = topicFavorites.includes(topic) ? topicFavorites.filter((item) => item !== topic) : [...topicFavorites, topic];
    setTopicFavorites(next);
    localStorage.setItem('bucc-topic-favorites', JSON.stringify(next));
  };

  const categories = useMemo(() => {
    const unique = ['All', ...new Set(videos.map((video) => video.category))];
    return unique.map((name) => ({
      name,
      count: name === 'All' ? videos.length : videos.filter((video) => video.category === name).length,
      icon: name === 'All' ? Sparkles : [
        { name: 'Algorithms', icon: BrainCircuit },
        { name: 'Frontend', icon: Code2 },
        { name: 'Database', icon: BookOpen },
        { name: 'Systems', icon: Zap }
      ].find((item) => item.name === name)?.icon || BookOpen
    }));
  }, [videos]);

  const favoriteVideos = useMemo(() => videos.filter((video) => favorites.includes(video.id)), [favorites, videos]);
  const favoriteTopics = useMemo(
    () => categories.filter((topic) => topicFavorites.includes(topic.name) && topic.name !== 'All'),
    [categories, topicFavorites]
  );

  const filteredCategories = useMemo(() => {
    const query = topicQuery.toLowerCase().trim();
    if (!query) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(query));
  }, [categories, topicQuery]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
      const query = search.toLowerCase();
      const matchesSearch =
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.instructor.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, videos]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Learner dashboard
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Study resources with inline playback.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Access the library, filter by topic, and stream curated lessons directly inside BUCC Study Corner.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="/admin" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:opacity-90 glow-hover">
              Publish new resource
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#library" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-200">
              Browse library
            </a>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">Quick stats</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Ready to learn</h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
              Focused mode
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-2xl font-semibold text-white">{videos.length}</p>
              <p className="mt-1 text-sm text-slate-400">Resources</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-2xl font-semibold text-white">4</p>
              <p className="mt-1 text-sm text-slate-400">Topics</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-2xl font-semibold text-white">100%</p>
              <p className="mt-1 text-sm text-slate-400">Inline playback</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Explore by topic</h3>
                <p className="text-sm text-slate-400">Search topics and favorite the ones you use most.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-400">
                  <Search className="h-4 w-4" />
                  <input
                    value={topicSearch}
                    onChange={(event) => setTopicSearch(event.target.value)}
                    placeholder="Search topics"
                    className="w-40 bg-transparent outline-none placeholder:text-slate-500"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setTopicQuery(topicSearch)}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400/20 hover:text-white"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {filteredCategories.map((item) => (
                <div key={item.name} className="w-full text-left">
                  <Category
                    name={item.name}
                    count={item.count}
                    icon={item.icon}
                    isFavorite={topicFavorites.includes(item.name)}
                    onToggleFavorite={item.name !== 'All' ? (event) => {
                      event.stopPropagation();
                      toggleTopicFavorite(item.name);
                    } : undefined}
                    onSelect={() => setActiveCategory(item.name)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[30px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-300">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-pink-300">Favorites</p>
                <h3 className="text-xl font-semibold text-white">Top picks</h3>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">Topic favorites</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {favoriteTopics.length ? (
                    favoriteTopics.map((topic) => (
                      <button
                        key={topic.name}
                        type="button"
                        onClick={() => setActiveCategory(topic.name)}
                        className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:text-cyan-200"
                      >
                        {topic.name}
                      </button>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">Star topic cards to keep your favorite subjects accessible.</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">Video favorites</p>
                <div className="mt-3 space-y-3">
                  {favoriteVideos.length ? (
                    favoriteVideos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="w-full rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-pink-400/30"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{video.title}</p>
                            <p className="mt-1 text-sm text-slate-400">{video.category}</p>
                          </div>
                          <span className="text-sm text-pink-300">Starred</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-5 text-sm text-slate-400">
                      Star resources to keep them here for quick access.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="library" className="glass-panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">Resource library</p>
              <h3 className="text-xl font-semibold text-white">Discover your next lesson</h3>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-400">
              <Search className="h-4 w-4" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search resources"
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
              />
            </label>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {filteredVideos.length ? (
              filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onWatch={setSelectedVideo}
                  isFavorite={favorites.includes(video.id)}
                  onToggleFavorite={() => toggleFavorite(video.id)}
                />
              ))
            ) : (
              <div className="md:col-span-2 rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-8 text-center text-slate-400">
                No resources matched your search. Try a different keyword or category.
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedVideo ? (
        <PlayerOverlay video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      ) : null}
    </section>
  );
}