export default function SkeletonLeeslijst() {
  return (
    <div className="leeslijst-skeleton-wrapper">
      {/* Titel skeleton */}
      <div className="skeleton skeleton-title"></div>

      {/* 3 skeleton items */}
      {[1, 2, 3].map(i => (
        <div key={i} className="leeslijst-skeleton-card">
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line short"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line shorter"></div>

          <div className="skeleton skeleton-button"></div>
        </div>
      ))}
    </div>
  );
}
