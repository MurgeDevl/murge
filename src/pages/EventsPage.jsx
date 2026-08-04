import { useMemo, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import EventDrinkSelector from "./EventDrinkSelector";

function EventsPage({
  events,
  activeEventId,
  categories,
  groupsByCategory,
  allDrinks,
  onCreate,
  onOpen,
  onDelete,
  onToggleDrink,
  onBack,
}) {
  const [eventName, setEventName] = useState("");
  const [isSelectingDrinks, setIsSelectingDrinks] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const activeEvent = events.find(
    (event) => event.id === activeEventId,
  );

  const selectedDrinks = useMemo(() => {
    if (!activeEvent) {
      return [];
    }

    return activeEvent.drinkIds
      .map((drinkId) =>
        allDrinks.find((drink) => drink.id === drinkId),
      )
      .filter(Boolean);
  }, [activeEvent, allDrinks]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanName = eventName.trim();

    if (!cleanName) {
      return;
    }

    onCreate(cleanName);
    setEventName("");
  };

  if (activeEvent && isSelectingDrinks) {
    return (
      <EventDrinkSelector
        categories={categories}
        groupsByCategory={groupsByCategory}
        activeEvent={activeEvent}
        onToggleDrink={(drinkId) =>
          onToggleDrink(activeEvent.id, drinkId)
        }
        onBack={() => setIsSelectingDrinks(false)}
      />
    );
  }

  if (activeEvent) {
    return (
      <section className="events-page">
        <button
          className="back-link"
          type="button"
          onClick={() => onOpen(null)}
        >
          ← Mes événements
        </button>

        <div className="page-heading">
          <h2>🎉 {activeEvent.name}</h2>
        </div>

        {selectedDrinks.length === 0 ? (
          <div className="placeholder">
            <div className="placeholder-icon">🥤</div>
            <h3>Aucune boisson</h3>

            <button
              className="back-button"
              type="button"
              onClick={() => setIsSelectingDrinks(true)}
            >
              ＋ Ajouter des boissons
            </button>
          </div>
        ) : (
          <>
            <div className="event-selected-list">
              {selectedDrinks.map((drink) => (
                <article
                  className="event-selected-card"
                  key={drink.id}
                >
                  <span className="event-selected-image">
                    {drink.image}
                  </span>

                  <span className="event-selected-info">
                    <span className="event-selected-name">
                      {drink.custom && (
                        <span className="custom-badge">👤</span>
                      )}

                      <strong>{drink.name}</strong>
                    </span>

                    <small>{drink.category}</small>
                  </span>

                  <button
                    className="event-remove-drink"
                    type="button"
                    aria-label={`Retirer ${drink.name}`}
                    onClick={() =>
                      onToggleDrink(activeEvent.id, drink.id)
                    }
                  >
                    ✕
                  </button>
                </article>
              ))}
            </div>

            <button
              className="back-button event-edit-drinks-button"
              type="button"
              onClick={() => setIsSelectingDrinks(true)}
            >
              ✏️ Modifier les boissons
            </button>
          </>
        )}
      </section>
    );
  }

  return (
    <>
      <section className="events-page">
        <button className="back-link" type="button" onClick={onBack}>
          ← Retour
        </button>

        <div className="page-heading">
          <h2>Mes événements</h2>
        </div>

        <form className="event-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={eventName}
            placeholder="Ex. Kermesse du village"
            maxLength={40}
            onChange={(event) => setEventName(event.target.value)}
          />

          <button type="submit">＋ Créer</button>
        </form>

        {events.length === 0 ? (
          <div className="placeholder">
            <div className="placeholder-icon">🎉</div>
            <h3>Aucun événement</h3>
          </div>
        ) : (
          <div className="event-list">
            {events.map((event) => (
              <article className="event-card" key={event.id}>
                <button
                  className="event-open-button"
                  type="button"
                  onClick={() => onOpen(event.id)}
                >
                  <span className="event-icon">🎉</span>

                  <span className="event-info">
                    <strong>{event.name}</strong>

                    <small>
                      {event.drinkIds.length} boisson
                      {event.drinkIds.length > 1 ? "s" : ""}
                    </small>
                  </span>

                  <span className="event-status">Ouvrir</span>
                </button>

                <button
                  className="event-delete-button"
                  type="button"
                  aria-label={`Supprimer ${event.name}`}
                  onClick={() => setEventToDelete(event)}
                >
                  🗑️
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        title="Supprimer l’événement ?"
        message={
          eventToDelete
            ? `L’événement « ${eventToDelete.name} » sera supprimé.`
            : ""
        }
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (eventToDelete) {
            onDelete(eventToDelete.id);
            setEventToDelete(null);
          }
        }}
        onCancel={() => setEventToDelete(null)}
      />
    </>
  );
}

export default EventsPage;
