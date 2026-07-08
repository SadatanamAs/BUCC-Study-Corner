import './Category.css';

/**
 * Category — filter pill row.
 *
 * Purely presentational and controlled: it renders whatever category
 * list it's given and reports selection upward. It doesn't fetch data
 * or own filter state itself, so it drops into App.jsx (or any parent)
 * without assumptions about where the video list lives.
 *
 * @param {string[]} categories - e.g. ["All", "Frontend", "Backend", "Design"]
 * @param {string} activeCategory - the currently selected category
 * @param {(category: string) => void} onSelect - called with the clicked category
 */
export default function Category({ categories = [], activeCategory = 'All', onSelect }) {
  if (!categories.length) return null;

  return (
    <nav className="cat-row" aria-label="Filter videos by category">
      {categories.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            type="button"
            className={`cat-pill${isActive ? ' cat-pill--active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onSelect?.(cat)}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}
