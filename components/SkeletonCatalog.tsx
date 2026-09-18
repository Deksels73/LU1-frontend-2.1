export default function SkeletonCatalog() {
  const rows = Array.from({ length: 10 });

  return (
    <table className="catalog-table">
      <thead>
        <tr>
          <th>Titel</th>
          <th>Auteur</th>
          <th>Jaar</th>
          <th>Niveau</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {rows.map((_, index) => (
          <tr key={index} className="skeleton-row">
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-button"></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
