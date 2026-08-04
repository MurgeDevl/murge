import { useMemo, useState } from "react";
import BubbleButton from "../components/BubbleButton";

function DrinkCategoryPage({
  title,
  groups,
  cart,
  favorites,
  onAdd,
  onRemove,
  onToggleFavorite,
  onBack,
}) {
  const [openGroupId, setOpenGroupId] = useState(null);
  const [search, setSearch] = useState("");

  const getQuantity = (variantId) => cart[variantId] || 0;

  const visibleGroups = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return groups
      .filter((group) =>
        group.name.toLowerCase().includes(normalizedSearch),
      )
      .map((group, index) => ({
        group,
        index,
        hasFavorite: (group.variants || []).some((variant) =>
          favorites.includes(variant.id),
        ),
      }))
      .sort((a, b) => {
        if (a.hasFavorite !== b.hasFavorite) {
          return a.hasFavorite ? -1 : 1;
        }

        if (a.group.custom !== b.group.custom) {
          return a.group.custom ? -1 : 1;
        }

        return a.index - b.index;
      })
      .map(({ group }) => group);
  }, [groups, favorites, search]);

  return (
    <section className="beer-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Retour
      </button>

      <div className="page-heading">
        <h2>{title}</h2>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder={`Rechercher dans ${title.toLowerCase()}...`}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="brand-list">
        {visibleGroups.map((group) => {
          const variants = group.variants || [];
          const directAdd = group.custom || variants.length === 1;
          const isOpen = openGroupId === group.id;
          const hasFavorite = variants.some((variant) =>
            favorites.includes(variant.id),
          );

          const makeDrink = (variant) => ({
            id: variant.id,
            name:
              variant.name === "Classique"
                ? group.name
                : `${group.name} ${variant.name}`,
            image: group.image,
            category: group.category || title,
            custom: Boolean(group.custom),
          });

          return (
            <article className="brand-card" key={group.id}>
              <BubbleButton
                className="brand-header"
                type="button"
                animate={directAdd}
                onClick={(event) => {
                  if (directAdd && variants[0]) {
                    onAdd(
                      makeDrink(variants[0]),
                      event.currentTarget,
                    );
                    return;
                  }

                  setOpenGroupId(isOpen ? null : group.id);
                }}
              >
                <span className="brand-image">{group.image}</span>

                <span className="brand-info">
                  <span className="beer-title">
                    <span className="beer-name">
                      {group.custom && (
                        <span
                          className="custom-badge"
                          title="Boisson personnalisée"
                        >
                          👤
                        </span>
                      )}

                      <strong>{group.name}</strong>

                      {hasFavorite && (
                        <span
                          className="favorite-brand-badge"
                          title="Contient un favori"
                        >
                          ⭐
                        </span>
                      )}
                    </span>
                  </span>

                  <small>
                    {variants.length} variante
                    {variants.length > 1 ? "s" : ""}
                  </small>
                </span>

                <span className="brand-arrow">
                  {directAdd ? "+" : isOpen ? "⌃" : "⌄"}
                </span>
              </BubbleButton>

              {isOpen && !directAdd && (
                <div className="variant-list">
                  {variants.map((variant) => {
                    const drink = makeDrink(variant);
                    const quantity = getQuantity(variant.id);
                    const isFavorite = favorites.includes(variant.id);

                    return (
                      <div className="variant-row" key={variant.id}>
                        <button
                          className={`favorite-button ${
                            isFavorite ? "is-favorite" : ""
                          }`}
                          type="button"
                          onClick={() =>
                            onToggleFavorite(variant.id)
                          }
                        >
                          {isFavorite ? "★" : "☆"}
                        </button>

                        <BubbleButton
                          className="variant-add"
                          type="button"
                          onClick={(event) =>
                            onAdd(drink, event.currentTarget)
                          }
                        >
                          <span>{variant.name}</span>
                          <span className="add-label">
                            + Ajouter
                          </span>
                        </BubbleButton>

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
                              onClick={(event) =>
                            onAdd(drink, event.currentTarget)
                          }
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

export default DrinkCategoryPage;
