import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getYouTubeEmbedUrl, loadVideos } from "../lib/videos";

export default function Course() {
  const { id } = useParams(); // Grabs the ID from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchCourse() {
      const videos = await loadVideos();
      if (cancelled) return;
      // Find the specific course by matching the ID
      const found = videos.find((v) => v.id.toString() === id.toString());
      setCourse(found || null);
      setLoading(false);
    }
    fetchCourse();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="p-10">Loading course...</div>;
  if (!course) return <div className="p-10">Course not found.</div>;

  const embedUrl = getYouTubeEmbedUrl(course.url);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-500 hover:underline mb-6 block">
        ← Back to Home
      </Link>

      <h1 className="text-4xl font-black">{course.title}</h1>

      <div className="mt-4 text-gray-600 space-y-2">
        <p><strong>Category:</strong> {course.category}</p>
        {course.instructor ? <p><strong>Instructor:</strong> {course.instructor}</p> : null}
      </div>

      {course.description ? (
        <p className="mt-6 text-lg leading-relaxed">{course.description}</p>
      ) : null}

      {/* Video Embed Section */}
      <div className="mt-10 aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {embedUrl ? (
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            Unable to load video
          </div>
        )}
      </div>
    </div>
  );
}