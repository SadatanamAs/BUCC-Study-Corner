import React, { useState } from 'react';
import { Trash2, Wrench, PlusCircle, ArrowUpRight, FolderOpen, Radio, Database } from 'lucide-react';

const Admin = () => {
  // 1. Initial Interactive Video State
  const [videos, setVideos] = useState([
    { id: '1', title: 'Cse110 lecture 1', youtubeId: 'hBg3njn56Z0', publishedDate: '7 Jul 2026' }
  ]);

  // Form Field Local States
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const extractYouTubeId = (urlStr) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim() || !url.trim()) {
      setError('⚡ SYSTEM CRITICAL: RESOURCE PARAMETERS ARE EMPTY.');
      return;
    }

    const ytId = extractYouTubeId(url);
    if (!ytId) {
      setError('⚡ INVALID ROUTING SIGNATURE: CORRUPT LINK STRUCTURE.');
      return;
    }

    setIsPublishing(true);

    // Simulated Submission Time-Flow sequence
    setTimeout(() => {
      const newVideo = {
        id: Date.now().toString(),
        title: title.trim(),
        youtubeId: ytId,
        publishedDate: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };

      setVideos([newVideo, ...videos]);
      setTitle('');
      setUrl('');
      setIsPublishing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }, 1100);
  };

  const handleDelete = (idToDelete) => {
    setVideos(videos.filter(video => video.id !== idToDelete));
  };

  return (
    <div className="min-h-screen bg-[#090814] bg-[radial-gradient(#1a182e_1.5px,transparent_1.5px)] [background-size:24px_24px] px-6 py-12 text-white font-sans selection:bg-[#f3d371] selection:text-[#090814]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT SIDEBAR: HYPER-STYLISH CONTROLS ================= */}
        <div className="lg:col-span-4 relative group/panel">
          <div className="absolute inset-0 bg-gradient-to-b from-[#7c83fd] to-[#b19ffa] rounded-2xl translate-x-1.5 translate-y-1.5 opacity-80 group-hover/panel:translate-x-2 group-hover/panel:translate-y-2 transition-transform duration-300 -z-10 shadow-[0_0_20px_rgba(124,131,253,0.15)]"></div>
          <div className="bg-[#121122] border-2 border-[#2b2a42] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            
            {/* Upper Radar Matrix Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#1b1935] border border-[#3b3a5c] rounded-xl text-[#7c83fd] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] animate-pulse">
                  <Wrench size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-white uppercase drop-shadow-md">ADMIN CONTROLS</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[11px] text-emerald-400 font-black font-mono uppercase tracking-widest">OPERATOR // SAMIN</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#1b1935] border border-[#2b2a42] px-2 py-1 rounded-md text-[9px] font-mono font-bold text-gray-500 tracking-widest">V4.2.6</div>
            </div>

            <hr className="border-[#2b2a42] opacity-60 mb-6" />

            {/* Total Indicator Frame - High Impact Weight */}
            <div className="bg-[#090814] border-2 border-[#1c1b30] rounded-xl p-5 mb-8 relative group/counter overflow-hidden">
              <div className="absolute right-3 top-3 text-[#7c83fd]/10"><Database size={24} /></div>
              <span className="block text-[11px] font-black tracking-[0.2em] text-[#b19ffa] uppercase">
                TOTAL CATALOGED STREAMS
              </span>
              <span className="block text-6xl font-black mt-2 text-[#7c83fd] tracking-tighter drop-shadow-[0_4px_10px_rgba(124,131,253,0.2)] group-hover/counter:scale-105 duration-300 origin-left transition-transform">
                {String(videos.length).padStart(2, '0')}
              </span>
            </div>

            {/* Input Form Header Section */}
            <div className="flex items-center gap-2 mb-4">
              <Radio size={14} className="text-[#fbc5b3] animate-pulse" />
              <h3 className="text-xs font-black tracking-[0.25em] uppercase text-gray-300">
                POST NEW RESOURCE
              </h3>
            </div>

            {success && (
              <div className="mb-4 p-3.5 bg-emerald-950/40 border-2 border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-black tracking-wide shadow-md">
                ⚡ DISPATCH COMPLETE: ASSET INDEXED SUCCESSFULLY!
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 bg-red-950/40 border-2 border-red-500/30 text-red-400 rounded-xl text-xs font-black tracking-wide shadow-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* VIDEO TITLE INPUT FIELD */}
              <div className="space-y-2">
                <label className="block text-xs font-black tracking-[0.15em] text-[#5ce1e6] uppercase pl-1">
                  VIDEO TITLE
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Intro to Data Structures"
                  className="w-full bg-[#090814] border-2 border-[#222138] rounded-xl px-4 py-3.5 text-sm text-white font-extrabold placeholder-gray-700 focus:outline-none focus:border-[#7c83fd] focus:ring-4 focus:ring-[#7c83fd]/10 transition-all duration-300 shadow-inner"
                />
              </div>

              {/* YOUTUBE RESOURCE URL INPUT FIELD */}
              <div className="space-y-2">
                <label className="block text-xs font-black tracking-[0.15em] text-[#fbc5b3] uppercase pl-1">
                  YOUTUBE RESOURCE URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#090814] border-2 border-[#222138] rounded-xl px-4 py-3.5 text-sm text-white font-extrabold placeholder-gray-700 focus:outline-none focus:border-[#7c83fd] focus:ring-4 focus:ring-[#7c83fd]/10 transition-all duration-300 shadow-inner"
                />
              </div>

              {/* MASSIVE UPGRADED PUBLISH ACTION BUTTON */}
              <button
                type="submit"
                disabled={isPublishing}
                className="w-full relative overflow-hidden bg-[#f3d371] hover:bg-[#fcdfa3] text-[#090814] font-black text-sm tracking-[0.3em] uppercase py-6 rounded-2xl border-2 border-black shadow-[0_8px_24px_rgba(243,211,113,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(243,211,113,0.4)] active:translate-y-0 active:scale-[0.97] disabled:opacity-50 cursor-pointer group/pbtn"
              >
                <span className="relative z-10 flex items-center justify-center gap-2.5 text-base font-black">
                  {isPublishing ? (
                    <div className="w-5 h-5 border-3 border-[#090814] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <PlusCircle size={18} className="stroke-[3]" />
                      PUBLISH VIDEO CARD
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/pbtn:translate-y-0 transition-transform duration-300"></div>
              </button>
            </form>

          </div>
        </div>

        {/* ================= RIGHT MAIN PANEL: CONTENT MANAGEMENT MATRIX ================= */}
        <div className="lg:col-span-8">
          <div className="relative group/repo">
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbc5b3] to-[#ecb09d] rounded-2xl translate-x-1.5 translate-y-1.5 opacity-80 group-hover/repo:translate-x-2 group-hover/repo:translate-y-2 transition-transform duration-300 -z-10 shadow-[0_0_20px_rgba(251,197,179,0.1)]"></div>
            <div className="bg-[#121122] border-2 border-[#2b2a42] rounded-2xl p-8 shadow-2xl min-h-[580px]">
              
              <div className="mb-6">
                <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
                  CONTENT MANAGEMENT SYSTEM
                </h1>
                <p className="text-xs text-[#b19ffa] font-bold tracking-widest uppercase mt-1">Review, test, or terminate active structural asset indexes.</p>
              </div>

              <hr className="border-[#2b2a42] opacity-60 mb-6" />

              {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                  <div className="p-4 bg-[#1b1935] border border-[#2b2a42] rounded-2xl text-gray-600 mb-4 shadow-inner ring-1 ring-white/5">
                    <FolderOpen size={48} className="stroke-[1.2] opacity-50" />
                  </div>
                  <p className="text-xs font-black tracking-widest font-mono text-gray-500 uppercase">
                    [ SYSTEM CACHE EMPTY : DISPATCH CONSOLE STABLE ]
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-black tracking-[0.2em] uppercase text-gray-400 border-b-2 border-[#2b2a42] opacity-80 pb-4">
                        <th className="pb-4 w-28 pl-1 text-[#7c83fd]">PREVIEW</th>
                        <th className="pb-4 px-4 text-[#5ce1e6]">VIDEO DETAILS</th>
                        <th className="pb-4 px-4 text-[#fbc5b3]">PUBLISHED DATE</th>
                        <th className="pb-4 text-center text-red-400">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2b2a42]/40">
                      {videos.map((video) => (
                        <tr key={video.id} className="group/row hover:bg-[#090814]/60 transition-all duration-200">
                          <td className="py-4 pr-4 pl-1">
                            <div className="w-24 aspect-video rounded-xl overflow-hidden border-2 border-[#2b2a42] relative bg-[#090814] shadow-md ring-1 ring-white/5 transition-transform duration-300 group-hover/row:scale-105 group-hover/row:border-[#7c83fd]">
                              <img 
                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                                alt="Thumbnail"
                                className="w-full h-full object-cover select-none pointer-events-none"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <h4 className="font-black text-base tracking-wide text-gray-200 group-hover/row:text-white transition-colors">
                              {video.title}
                            </h4>
                            <span className="inline-flex items-center gap-1.5 mt-2 bg-[#090814] border border-[#2d2c45] text-[10px] font-mono font-black text-gray-400 px-2.5 py-1 rounded-md shadow-inner tracking-wider">
                              KEY SIGNATURE: <span className="text-[#5ce1e6] font-extrabold">{video.youtubeId}</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-black text-gray-400 font-mono tracking-widest uppercase">
                            {video.publishedDate}
                          </td>
                          <td className="py-4 pl-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <a 
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#090814] border border-[#2d2c45] hover:bg-[#1b1935] hover:border-[#7c83fd] p-2 rounded-xl text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-1.5 text-xs font-black px-3.5 py-2.5 shadow-sm"
                              >
                                <ArrowUpRight size={14} className="stroke-[2.5]" />
                                VIEW
                              </a>
                              <button 
                                onClick={() => handleDelete(video.id)}
                                className="bg-[#24131d] border border-red-950 hover:bg-red-950/60 text-red-400 hover:text-red-300 p-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-black px-3.5 py-2.5 cursor-pointer shadow-sm"
                              >
                                <Trash2 size={13} className="stroke-[2.5]" />
                                DELETE
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;