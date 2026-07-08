import './VideoCard.css';

/**
 * Pulls an 11-char YouTube video ID out of the common URL shapes:
 * watch?v=, youtu.be/, /embed/, /shorts/.
 * Returns null if the URL doesn't match (so callers can show a fallback
 * instead of a broken image).
 */
export function extractYouTubeId(url = '') {
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Builds a YouTube thumbnail URL for a given video URL, or null if the
 * URL isn't recognizably a YouTube link.
 */
export function getThumbnailUrl(url) {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * VideoCard — a single study video, styled like a library catalog card.
 *
 * Expects the normalized video shape produced by services/api.js:
 * { id, title, url, category, channel, description }. Extra/missing
 * fields degrade gracefully (no channel/description just hides them).
 *
 * @param {object} video - normalized video object
 * @param {(video: object) => void} [onPlay] - called on click/Enter;
 *   if omitted, the card opens the video's URL in a new tab instead.
 */
export default function VideoCard({ video, onPlay }) {
  const { title, url, category, channel, description } = video ?? {};
  const thumbnail = getThumbnailUrl(url);

  const handleActivate = () => {
    if (onPlay) {
      onPlay(video);
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActivate();
    }
  };

  return (
    <article
      className="vc-card"
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      aria-label={`Play ${title}`}
    >
      <div className="vc-thumb-wrap">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="vc-thumb" loading="lazy" />
        ) : (
          <div className="vc-thumb--empty">No preview available</div>
        )}

        {category && (
          <span className="vc-tab" data-category={category}>
            {category}
          </span>
        )}

        <span className="vc-play-overlay" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
      </div>

      <div className="vc-body">
        <h3 className="vc-title">{title}</h3>
        {channel && <p className="vc-channel">{channel}</p>}
        {description && <p className="vc-desc">{description}</p>}
      </div>
    </article>
  );
}
