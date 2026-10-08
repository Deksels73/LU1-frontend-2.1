export default function SkeletonAdvice() {
  return (
    <div className="advice-skeleton-cards">
      {[1, 2, 3].map(i => (
        <div key={i} className="advice-skeleton-card">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line short"></div>
          <div className="skeleton skeleton-line shorter"></div>
        </div>
      ))}
    </div>
  );
}
