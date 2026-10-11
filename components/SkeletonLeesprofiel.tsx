export default function SkeletonLeesprofiel() {
  return (
    <div className="form-card skeleton-card">

      {/* Titel */}
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>

      {/* Genre blokken */}
      <div className="skeleton-block-group">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton-block"></div>
        ))}
      </div>

      {/* Onderwerp blokken */}
      <div className="skeleton-block-group">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton-block"></div>
        ))}
      </div>

      {/* Selects */}
      <div className="skeleton-select"></div>
      <div className="skeleton-select"></div>

      {/* Textarea */}
      <div className="skeleton-textarea"></div>

      {/* Button */}
      <div className="skeleton-button"></div>

    </div>
  );
}
