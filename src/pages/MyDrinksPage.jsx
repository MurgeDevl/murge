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
  };

  return (
    <section className="settings-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Paramètres
      </button>

      <div className="page-heading">
        <h2>Mes boissons</h2>
      </div>

      <form className="custom-drink-form" onSubmit={handleSubmit}>
        <label>
          Nom
          <input
            type="text"
            value={name}
            placeholder="Ex. Mazout"
            maxLength={40}
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

        <button className="back-button" type="submit">
          ＋ Ajouter
        </button>
      </form>

      <div className="custom-drinks-list">
        {customDrinks.length === 0 ? (
          <p className="empty-message">
            Aucune boisson personnalisée.
          </p>
        ) : (
          customDrinks.map((drink) => (
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
          ))
        )}
      </div>
    </section>
  );
}

export default MyDrinksPage;
