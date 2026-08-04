function SettingsPage({
  onBack,
  onOpenMyDrinks,
  onOpenAbout,
}) {
  return (
    <section className="settings-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Retour
      </button>

      <div className="page-heading">
        <h2>Paramètres</h2>
      </div>

      <div className="category-grid">
        <button
          className="category-card"
          type="button"
          onClick={onOpenMyDrinks}
        >
          <span className="category-emoji">👤</span>
          <span className="category-name">Mes boissons</span>
          <span className="category-arrow">›</span>
        </button>

        <button
          className="category-card"
          type="button"
          onClick={onOpenAbout}
        >
          <span className="category-emoji">ℹ️</span>
          <span className="category-name">À propos</span>
          <span className="category-arrow">›</span>
        </button>
      </div>
    </section>
  );
}

export default SettingsPage;
