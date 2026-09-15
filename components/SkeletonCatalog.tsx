export default function SkeletonCatalog() {
  return (
    <section className="cards">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
        </div>
      ))}
    </section>
  );
}
