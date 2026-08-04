import { useMemo, useState } from "react";

function BeerPage({
  beers,
  cart,
  favorites,
  onAdd,
  onRemove,
  onToggleFavorite,
  onBack,
}) {
  const [openBeerId, setOpenBeerId] = useState(null);
  const [search, setSearch] = useState("");

  const getQuantity = (variantId) => cart[variantId] || 0;

  const visibleBeers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return beers
      .filter((beer) =>
        beer.name.toLowerCase().includes(normalizedSearch),
      )
      .map((beer, index) => ({
        beer,
        index,
        isFavorite: beer.variants.some((variant) =>
          favorites.includes(variant.id),
        ),
      }))
      .sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }

        return a.index - b.index;
      })
      .map(({ beer }) => beer);
  }, [beers, favorites, search]);

  return (
    <section className="beer-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Retour
      </button>

      <div className="page-heading">
        <p className="eyebrow">Catégorie</p>
        <h2>Bières</h2>
        <p>Choisis une bière, puis sa variante.</p>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Rechercher une bière..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="brand-list">
        {visibleBeers.map((beer) => {
          const directAdd = beer.custom || beer.variants.length === 1;
          const isOpen = openBeerId === beer.id;

          const addDirectly = () => {
            const variant = beer.variants[0];

            onAdd({
              id: variant.id,
              name:
                variant.name === "Classique"
                  ? beer.name
                  : `${beer.name} ${variant.name}`,
              image: beer.image,
              category: beer.category || "Bières",
            });
          };

          return (
            <article className="brand-card" key={beer.id}>
              <button
                className="brand-header"
                type="button"
                onClick={() => {
                  if (directAdd) {
                    addDirectly();
                    return;
                  }

                  setOpenBeerId(isOpen ? null : beer.id);
                }}
              >
                <span className="brand-image">{beer.image}</span>

                <span className="brand-info">
                  <span className="beer-title">
                    <span className="beer-name">
                      {beer.custom && (
                        <span
                          className="custom-badge"
                          title="Boisson personnalisée"
                        >
                          👤
                        </span>
                      )}

                      <strong>{beer.name}</strong>
                    </span>
                  </span>

                  <small>
                    {directAdd
                      ? "Ajouter directement"
                      : beer.variants
                          .map((variant) => variant.name)
                          .join(" • ")}
                  </small>
                </span>

                <span className="brand-arrow">
                  {directAdd ? "+" : isOpen ? "⌃" : "⌄"}
                </span>
              </button>

              {isOpen && !directAdd && (
                <div className="variant-list">
                  {beer.variants.map((variant) => {
                    const quantity = getQuantity(variant.id);
                    const isFavorite = favorites.includes(variant.id);

                    const drink = {
                      id: variant.id,
                      name: `${beer.name} ${variant.name}`,
                      image: beer.image,
                      category: beer.category || "Bières",
                    };

                    return (
                      <div className="variant-row" key={variant.id}>
                        <button
                          className={`favorite-button ${
                            isFavorite ? "is-favorite" : ""
                          }`}
                          type="button"
                          aria-label={
                            isFavorite
                              ? `Retirer ${drink.name} des favoris`
                              : `Ajouter ${drink.name} aux favoris`
                          }
                          onClick={() => onToggleFavorite(variant.id)}
                        >
                          {isFavorite ? "★" : "☆"}
                        </button>

                        <button
                          className="variant-add"
                          type="button"
                          onClick={() => onAdd(drink)}
                        >
                          <span>{variant.name}</span>
                          <span className="add-label">+ Ajouter</span>
                        </button>

                        {quantity > 0 && (
                          <div className="variant-quantity">
                            <button
                              type="button"
                              onClick={() => onRemove(drink)}
                            >
                              −
                            </button>

                            <span>{quantity}</span>

                            <button
                              type="button"
                              onClick={() => onAdd(drink)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default BeerPage;
