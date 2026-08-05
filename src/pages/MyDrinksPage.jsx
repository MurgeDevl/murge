import { useState } from "react";

const categoryEmojis = {
  Bières: "🍺",
  Softs: "🥤",
  Cocktails: "🍹",
  Spiritueux: "🥃",
  Vins: "🍷",
  Bulles: "🥂",
  Chauds: "☕",
};

const categoryOptions = Object.keys(categoryEmojis);

function MyDrinksPage({
  customDrinks,
  onBack,
  onAddDrink,
  onDeleteDrink,
}) {
  const [isCreating, setIsCreating] = useState(
    customDrinks.length === 0,
  );
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Bières");

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      return;
    }

    onAddDrink({
      name: cleanName,
      category,
      image: categoryEmojis[category],
      variants: [
        {
          id: crypto.randomUUID(),
          name: "Classique",
        },
      ],
    });

    setName("");
    setCategory("Bières");
    setIsCreating(false);
  };

  return (
    <section className="settings-page my-drinks-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Retour
      </button>

      <div className="my-drinks-heading">
        <div>
          <h2>Mes boissons</h2>
          <p>
            Créez vos propres boissons pour les retrouver partout
            dans Murge.
          </p>
        </div>

        {customDrinks.length > 0 && !isCreating && (
          <button
            className="my-drinks-create-icon"
            type="button"
            aria-label="Créer une boisson"
            onClick={() => setIsCreating(true)}
          >
            +
          </button>
        )}
      </div>

      {isCreating ? (
        <form className="custom-drink-form" onSubmit={handleSubmit}>
          <label>
            Nom
            <input
              type="text"
              value={name}
              placeholder="Ex. Mazout"
              maxLength={40}
              autoFocus
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label>
            Catégorie
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {categoryEmojis[option]} {option}
                </option>
              ))}
            </select>
          </label>

          <div className="my-drinks-form-actions">
            {customDrinks.length > 0 && (
              <button
                className="my-drinks-cancel"
                type="button"
                onClick={() => {
                  setName("");
                  setCategory("Bières");
                  setIsCreating(false);
                }}
              >
                Annuler
              </button>
            )}

            <button className="back-button" type="submit">
              Créer une boisson
            </button>
          </div>
        </form>
      ) : (
        <div className="custom-drinks-list">
          {customDrinks.map((drink) => (
            <article className="custom-drink-card" key={drink.id}>
              <span>
                {categoryEmojis[drink.category] || drink.image || "🥤"}
              </span>

              <div>
                <strong>{drink.name}</strong>
                <small>{drink.category}</small>
              </div>

              <button
                className="delete-custom-drink"
                type="button"
                onClick={() => onDeleteDrink(drink.id)}
                aria-label={`Supprimer ${drink.name}`}
              >
                🗑️
              </button>
            </article>
          ))}
        </div>
      )}

      {customDrinks.length === 0 && !isCreating && (
        <div className="my-drinks-empty">
          <span>🍺</span>
          <h3>Aucune boisson personnalisée</h3>

          <button
            className="back-button"
            type="button"
            onClick={() => setIsCreating(true)}
          >
            Créer une boisson
          </button>
        </div>
      )}
    </section>
  );
}

export default MyDrinksPage;
