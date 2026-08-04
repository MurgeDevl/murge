import { useMemo, useRef, useState } from "react";
import BubbleButton from "../components/BubbleButton";

function SearchPage({
  drinks,
  favorites,
  cart,
  onAdd,
  onBack,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return drinks
      .filter((drink) => {
        if (!normalizedQuery) {
          return favorites.includes(drink.id) || drink.custom;
        }

        return drink.name.toLowerCase().includes(normalizedQuery);
      })
      .map((drink, index) => ({
        drink,
        index,
        isFavorite: favorites.includes(drink.id),
      }))
      .sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }

        if (Boolean(a.drink.custom) !== Boolean(b.drink.custom)) {
          return a.drink.custom ? -1 : 1;
        }

        return a.index - b.index;
      })
      .map(({ drink }) => drink);
  }, [drinks, favorites, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <section className="search-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Retour
      </button>

      <div className="search-page-heading">
        <h2>Recherche</h2>
      </div>

      <div
        className="universal-search-box"
        onClick={() => inputRef.current?.focus()}
      >
        <span aria-hidden="true">🔍</span>

        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Rechercher une boisson..."
          autoFocus
          onChange={(event) => setQuery(event.target.value)}
        />

        {query && (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={(event) => {
              event.stopPropagation();
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        )}
      </div>

      {!hasQuery && results.length > 0 && (
        <p className="search-section-label">
          Favoris et boissons personnelles
        </p>
      )}

      {results.length === 0 ? (
        <div className="search-empty">
          <span>🔍</span>
          <strong>Aucun résultat</strong>
        </div>
      ) : (
        <div className="search-results">
          {results.map((drink) => {
            const quantity = cart[drink.id]?.quantity || 0;
            const isFavorite = favorites.includes(drink.id);

            return (
              <BubbleButton
                className="search-result-card"
                type="button"
                key={drink.id}
                onClick={() => onAdd(drink)}
              >
                <span className="search-result-image">
                  {drink.image}
                </span>

                <span className="search-result-info">
                  <span className="search-result-name">
                    {drink.custom && (
                      <span
                        className="custom-badge"
                        title="Boisson personnalisée"
                      >
                        👤
                      </span>
                    )}

                    <strong>{drink.name}</strong>

                    {isFavorite && (
                      <span
                        className="favorite-brand-badge"
                        title="Favori"
                      >
                        ⭐
                      </span>
                    )}
                  </span>

                  <small>{drink.category}</small>
                </span>

                <span className="search-result-action">
                  {quantity > 0 ? quantity : "+"}
                </span>
              </BubbleButton>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default SearchPage;
