import { useState } from "react";

function EventDrinkSelector({
  categories,
  groupsByCategory,
  activeEvent,
  onToggleDrink,
  onBack,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const selectableCategories = categories.filter(
    (category) =>
      !["Favoris", "Événements", "Paramètres"].includes(
        category.name,
      ) &&
      (groupsByCategory[category.name] || []).length > 0,
  );

  if (selectedGroup) {
    return (
      <section className="beer-page">
        <button
          className="back-link"
          type="button"
          onClick={() => setSelectedGroup(null)}
        >
          ← {selectedCategory}
        </button>

        <div className="page-heading">
          <h2>{selectedGroup.name}</h2>
        </div>

        <div className="event-variant-list">
          {(selectedGroup.variants || []).map((variant) => {
            const isSelected = activeEvent.drinkIds.includes(
              variant.id,
            );

            return (
              <button
                className={`event-variant-card ${
                  isSelected ? "is-selected" : ""
                }`}
                type="button"
                key={variant.id}
                onClick={() => onToggleDrink(variant.id)}
              >
                <span className="event-variant-info">
                  <span className="event-variant-image">
                    {selectedGroup.image}
                  </span>

                  <strong>{variant.name}</strong>
                </span>

                <span className="event-variant-check">
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  if (selectedCategory) {
    const groups = groupsByCategory[selectedCategory] || [];

    return (
      <section className="beer-page">
        <button
          className="back-link"
          type="button"
          onClick={() => setSelectedCategory(null)}
        >
          ← Catégories
        </button>

        <div className="page-heading">
          <h2>{selectedCategory}</h2>
        </div>

        <div className="brand-list">
          {groups.map((group) => {
            const variants = group.variants || [];
            const directSelect =
              group.custom || variants.length === 1;

            const selectedCount = variants.filter((variant) =>
              activeEvent.drinkIds.includes(variant.id),
            ).length;

            const isDirectSelected =
              directSelect &&
              variants[0] &&
              activeEvent.drinkIds.includes(variants[0].id);

            return (
              <article className="brand-card" key={group.id}>
                <button
                  className="brand-header"
                  type="button"
                  onClick={() => {
                    if (directSelect && variants[0]) {
                      onToggleDrink(variants[0].id);
                      return;
                    }

                    setSelectedGroup(group);
                  }}
                >
                  <span className="brand-image">{group.image}</span>

                  <span className="brand-info">
                    <span className="beer-name">
                      {group.custom && (
                        <span className="custom-badge">👤</span>
                      )}

                      <strong>{group.name}</strong>
                    </span>

                    <small>
                      {variants.length} variante
                      {variants.length > 1 ? "s" : ""}
                      {selectedCount > 0 && !directSelect
                        ? ` · ${selectedCount} sélectionnée${
                            selectedCount > 1 ? "s" : ""
                          }`
                        : ""}
                    </small>
                  </span>

                  <span className="brand-arrow">
                    {directSelect
                      ? isDirectSelected
                        ? "✓"
                        : "+"
                      : "›"}
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="beer-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Événement
      </button>

      <div className="page-heading">
        <h2>Ajouter des boissons</h2>
      </div>

      <div className="category-grid">
        {selectableCategories.map((category) => (
          <button
            className="category-card"
            type="button"
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
          >
            <span className="category-emoji">
              {category.emoji}
            </span>

            <span className="category-name">
              {category.name}
            </span>

            <span className="category-arrow">›</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default EventDrinkSelector;
