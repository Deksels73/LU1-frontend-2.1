export default function CatalogCardSkeleton() {
  return (
    <div className="catalog-cards-skeleton">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card-skeleton">
          <div className="skeleton-title" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line shorter" />
        </div>
      ))}
    </div>
  );
}
