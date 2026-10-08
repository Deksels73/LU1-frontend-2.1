export default function SkeletonProfielBekijken() {
  return (
    <div className="leesprofiel-skeleton-wrapper">
      
      {/* Titel skeleton */}
      <div className="skeleton skeleton-title"></div>

      {/* Intro tekst */}
      <div className="skeleton skeleton-line"></div>
      <div className="skeleton skeleton-line short"></div>

      {/* Lijst skeleton */}
      <ul className="leesprofiel-skeleton-list">
        {[1, 2, 3].map(i => (
          <li key={i} className="leesprofiel-skeleton-item">
            <div className="skeleton skeleton-line"></div>
          </li>
        ))}
      </ul>

      {/* Buttons skeleton */}
      <div className="skeleton skeleton-button"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );
}
