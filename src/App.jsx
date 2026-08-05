import { useEffect, useMemo, useState } from "react";
import "./App.css";

import beers from "./data/beers";
import softs from "./data/softs";
import wines from "./data/wines";
import spirits from "./data/spirits";
import cocktails from "./data/cocktails";
import bubbles from "./data/bubbles";
import hotDrinks from "./data/hotDrinks";

import CartDrawer from "./components/CartDrawer";
import DrinkCategoryPage from "./pages/DrinkCategoryPage";
import EventsPage from "./pages/EventsPage";
import MyDrinksPage from "./pages/MyDrinksPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import SplashScreen from "./components/SplashScreen";
import WelcomeScreen from "./components/WelcomeScreen";

const categories = [
  { name: "Favoris", emoji: "⭐" },
  { name: "Mes boissons", emoji: "🍺" },
  { name: "Événements", emoji: "🎉" },
  { name: "Bières", emoji: "🍺" },
  { name: "Vins", emoji: "🍷" },
  { name: "Bulles", emoji: "🥂" },
  { name: "Cocktails", emoji: "🍹" },
  { name: "Spiritueux", emoji: "🥃" },
  { name: "Softs", emoji: "🥤" },
  { name: "Chauds", emoji: "☕" },
  { name: "Paramètres", emoji: "⚙️" },
];

const nativeGroupsByCategory = {
  Bières: beers,
  Vins: wines,
  Bulles: bubbles,
  Cocktails: cocktails,
  Spiritueux: spirits,
  Softs: softs,
  Chauds: hotDrinks,
};

const getSavedData = (key, defaultValue) => {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const flattenGroups = (groups) =>
  groups.flatMap((group) =>
    (group.variants || []).map((variant) => ({
      id: variant.id,
      name:
        variant.name === "Classique"
          ? group.name
          : `${group.name} ${variant.name}`,
      image: group.image,
      category: group.category || "Autres",
      custom: Boolean(group.custom),
    })),
  );

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(
    () => localStorage.getItem("murge-onboarding-v1") !== "done",
  );

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [settingsPage, setSettingsPage] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [events, setEvents] = useState(() =>
    getSavedData("murge-events", []),
  );

  const [activeEventId, setActiveEventId] = useState(() =>
    getSavedData("murge-active-event", null),
  );

  const [cart, setCart] = useState(() =>
    getSavedData("murge-cart", {}),
  );

  const [favorites, setFavorites] = useState(() =>
    getSavedData("murge-favorites", []),
  );

  const [customDrinks, setCustomDrinks] = useState(() =>
    getSavedData("murge-custom-drinks", []),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 1050);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [selectedCategory, settingsPage, activeEventId]);

  const finishWelcome = () => {
    localStorage.setItem("murge-onboarding-v1", "done");
    setShowWelcome(false);
  };

  const groupsByCategory = useMemo(() => {
    const result = {};

    Object.entries(nativeGroupsByCategory).forEach(
      ([categoryName, groups]) => {
        result[categoryName] = [
          ...customDrinks.filter(
            (drink) => drink.category === categoryName,
          ),
          ...groups,
        ];
      },
    );

    return result;
  }, [customDrinks]);

  const allGroups = useMemo(
    () => Object.values(groupsByCategory).flat(),
    [groupsByCategory],
  );

  const allDrinks = useMemo(
    () => flattenGroups(allGroups),
    [allGroups],
  );

  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId),
    [events, activeEventId],
  );

  const cartCount = useMemo(
    () =>
      Object.values(cart).reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [cart],
  );

  const favoriteDrinks = useMemo(
    () =>
      allDrinks.filter((drink) => favorites.includes(drink.id)),
    [allDrinks, favorites],
  );

  const searchableDrinks = useMemo(() => {
    if (!activeEvent) {
      return allDrinks;
    }

    return allDrinks.filter((drink) =>
      activeEvent.drinkIds.includes(drink.id),
    );
  }, [activeEvent, allDrinks]);

  const visibleCategories = useMemo(() => {
    if (!activeEvent) {
      return categories;
    }

    return categories.filter((category) => {
      if (
        ["Favoris", "Mes boissons", "Événements", "Paramètres"].includes(
          category.name,
        )
      ) {
        return true;
      }

      return allDrinks.some(
        (drink) =>
          drink.category === category.name &&
          activeEvent.drinkIds.includes(drink.id),
      );
    });
  }, [activeEvent, allDrinks]);

  const displayedGroups = useMemo(() => {
    const groups = groupsByCategory[selectedCategory] || [];

    if (!activeEvent) {
      return groups;
    }

    return groups
      .map((group) => ({
        ...group,
        variants: (group.variants || []).filter((variant) =>
          activeEvent.drinkIds.includes(variant.id),
        ),
      }))
      .filter((group) => group.variants.length > 0);
  }, [activeEvent, groupsByCategory, selectedCategory]);

  const saveCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem("murge-cart", JSON.stringify(nextCart));
  };

  const showDrinkEffect = (drink, clickedElement) => {
    const container =
      clickedElement?.closest(
        ".brand-card, .search-result-card, .favorite-card, .cart-item",
      ) || clickedElement;

    const source =
      container?.querySelector(
        ".brand-image, .search-result-image, .favorite-image, .cart-item-image",
      ) || clickedElement;

    const rect = source?.getBoundingClientRect();

    const x = rect
      ? rect.left + rect.width / 2
      : window.innerWidth / 2;

    const y = rect
      ? rect.top + rect.height / 2
      : window.innerHeight / 2;

    const category = drink.category || "Bières";

    const createEffect = ({
      content = "",
      width = 14,
      height = 14,
      borderRadius = "50%",
      background = "#f2b134",
      border = "2px solid rgba(255, 255, 255, 0.8)",
      color = "#f2b134",
      fontSize = "20px",
      startTransform = "translate3d(0, 5px, 0) scale(0.55)",
      endTransform = "translate3d(3px, -38px, 0) scale(1.1)",
      duration = 700,
      delay = 0,
      boxShadow =
        "0 0 0 4px rgba(242, 177, 52, 0.16), 0 0 14px rgba(242, 177, 52, 0.65)",
    }) => {
      const effect = document.createElement("span");

      effect.textContent = content;

      Object.assign(effect.style, {
        position: "fixed",
        zIndex: "2147483647",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        marginLeft: `${-width / 2}px`,
        marginTop: `${-height / 2}px`,
        display: "grid",
        placeItems: "center",
        border,
        borderRadius,
        background,
        color,
        fontSize,
        fontWeight: "900",
        lineHeight: "1",
        boxShadow,
        opacity: "0",
        pointerEvents: "none",
        transform: startTransform,
        transition: `transform ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
      });

      document.body.appendChild(effect);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          effect.style.opacity = "1";
          effect.style.transform = endTransform;

          window.setTimeout(() => {
            effect.style.opacity = "0";
          }, Math.max(120, duration - 220 + delay));
        });
      });

      window.setTimeout(() => {
        effect.remove();
      }, duration + delay + 120);
    };

    if (category === "Bulles") {
      createEffect({
        width: 10,
        height: 10,
        endTransform: "translate3d(-5px, -42px, 0) scale(1.05)",
      });

      createEffect({
        width: 7,
        height: 7,
        duration: 760,
        delay: 70,
        endTransform: "translate3d(7px, -48px, 0) scale(1)",
      });

      return;
    }

    if (category === "Vins") {
      createEffect({
        width: 11,
        height: 16,
        borderRadius: "70% 70% 70% 0",
        background: "#8f2840",
        border: "1px solid rgba(255, 255, 255, 0.45)",
        boxShadow: "0 0 12px rgba(143, 40, 64, 0.65)",
        startTransform:
          "translate3d(0, 4px, 0) rotate(-45deg) scale(0.6)",
        endTransform:
          "translate3d(2px, -34px, 0) rotate(-45deg) scale(1)",
      });

      return;
    }

    if (category === "Chauds") {
      createEffect({
        content: "〰",
        width: 22,
        height: 22,
        background: "transparent",
        border: "0",
        color: "rgba(255, 255, 255, 0.9)",
        boxShadow: "none",
        fontSize: "24px",
        startTransform: "translate3d(0, 6px, 0) scale(0.7)",
        endTransform: "translate3d(3px, -40px, 0) scale(1.1)",
        duration: 850,
      });

      return;
    }

    if (category === "Cocktails") {
      createEffect({
        content: "✦",
        width: 22,
        height: 22,
        background: "transparent",
        border: "0",
        color: "#f2b134",
        boxShadow: "none",
        fontSize: "22px",
        startTransform:
          "translate3d(0, 4px, 0) rotate(0deg) scale(0.45)",
        endTransform:
          "translate3d(2px, -34px, 0) rotate(45deg) scale(1.15)",
      });

      return;
    }

    if (category === "Spiritueux") {
      createEffect({
        content: "◆",
        width: 18,
        height: 18,
        background: "transparent",
        border: "0",
        color: "#d88a2a",
        boxShadow: "none",
        fontSize: "15px",
        startTransform:
          "translate3d(0, 4px, 0) rotate(0deg) scale(0.55)",
        endTransform:
          "translate3d(3px, -32px, 0) rotate(45deg) scale(1.1)",
      });

      return;
    }

    if (category === "Softs") {
      createEffect({
        width: 12,
        height: 12,
        background: "rgba(255, 255, 255, 0.9)",
        border: "2px solid rgba(242, 177, 52, 0.75)",
        boxShadow: "0 0 12px rgba(255, 255, 255, 0.45)",
      });

      return;
    }

    createEffect({});
  };

  const addDrink = (drink, clickedElement = null) => {
    const currentItem = cart[drink.id];

    saveCart({
      ...cart,
      [drink.id]: {
        ...drink,
        quantity: currentItem ? currentItem.quantity + 1 : 1,
      },
    });

    showDrinkEffect(drink, clickedElement);
  };

  const removeDrink = (drink) => {
    const currentItem = cart[drink.id];

    if (!currentItem) {
      return;
    }

    const nextCart = { ...cart };

    if (currentItem.quantity <= 1) {
      delete nextCart[drink.id];
    } else {
      nextCart[drink.id] = {
        ...currentItem,
        quantity: currentItem.quantity - 1,
      };
    }

    saveCart(nextCart);
  };

  const toggleFavorite = (drinkId) => {
    const nextFavorites = favorites.includes(drinkId)
      ? favorites.filter((id) => id !== drinkId)
      : [...favorites, drinkId];

    setFavorites(nextFavorites);
    localStorage.setItem(
      "murge-favorites",
      JSON.stringify(nextFavorites),
    );
  };

  const saveEvents = (nextEvents) => {
    setEvents(nextEvents);
    localStorage.setItem("murge-events", JSON.stringify(nextEvents));
  };

  const openEvent = (eventId) => {
    setActiveEventId(eventId);

    if (eventId === null) {
      localStorage.removeItem("murge-active-event");
      return;
    }

    localStorage.setItem(
      "murge-active-event",
      JSON.stringify(eventId),
    );
  };

  const saveCustomDrinks = (nextDrinks) => {
    setCustomDrinks(nextDrinks);
    localStorage.setItem(
      "murge-custom-drinks",
      JSON.stringify(nextDrinks),
    );
  };

  const addCustomDrink = (drink) => {
    saveCustomDrinks([
      {
        id: crypto.randomUUID(),
        ...drink,
        custom: true,
      },
      ...customDrinks,
    ]);
  };

  const deleteCustomDrink = (drinkId) => {
    const drinkToDelete = customDrinks.find(
      (drink) => drink.id === drinkId,
    );

    const variantIds = drinkToDelete
      ? (drinkToDelete.variants || []).map((variant) => variant.id)
      : [];

    saveCustomDrinks(
      customDrinks.filter((drink) => drink.id !== drinkId),
    );

    const nextFavorites = favorites.filter(
      (id) => !variantIds.includes(id),
    );
    setFavorites(nextFavorites);
    localStorage.setItem(
      "murge-favorites",
      JSON.stringify(nextFavorites),
    );

    saveEvents(
      events.map((event) => ({
        ...event,
        drinkIds: event.drinkIds.filter(
          (id) => !variantIds.includes(id),
        ),
      })),
    );

    const nextCart = { ...cart };
    variantIds.forEach((id) => delete nextCart[id]);
    saveCart(nextCart);
  };

  const isDrinkCategory = Boolean(
    groupsByCategory[selectedCategory],
  );

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={finishWelcome} />;
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <button
            className="home-logo"
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setSettingsPage(null);
              setIsCartOpen(false);
            }}
          >
            Murge
          </button>
        </div>

        <div className="header-actions">
          <button
            className="search-header-button"
            type="button"
            aria-label="Rechercher une boisson"
            onClick={() => {
              setSettingsPage(null);
              setSelectedCategory("Recherche");
            }}
          >
            🔍
          </button>

          <button
            className={`cart-button ${
              cartCount > 0 ? "has-items" : ""
            }`}
            type="button"
            onClick={() => setIsCartOpen(true)}
          >
            🛒 <span>{cartCount}</span>
          </button>
        </div>
      </header>

      {selectedCategory === "Recherche" ? (
        <SearchPage
          drinks={searchableDrinks}
          favorites={favorites}
          cart={cart}
          onAdd={addDrink}
          onBack={() => setSelectedCategory(null)}
        />
      ) : isDrinkCategory ? (
        <DrinkCategoryPage
          title={selectedCategory}
          groups={displayedGroups}
          cart={Object.fromEntries(
            Object.entries(cart).map(([id, item]) => [
              id,
              item.quantity,
            ]),
          )}
          favorites={favorites}
          onAdd={addDrink}
          onRemove={removeDrink}
          onToggleFavorite={toggleFavorite}
          onBack={() => setSelectedCategory(null)}
        />
      ) : selectedCategory === "Événements" ? (
        <EventsPage
          events={events}
          activeEventId={activeEventId}
          categories={categories}
          groupsByCategory={groupsByCategory}
          allDrinks={allDrinks}
          onCreate={(name) =>
            saveEvents([
              ...events,
              {
                id: crypto.randomUUID(),
                name,
                drinkIds: [],
              },
            ])
          }
          onOpen={openEvent}
          onDelete={(eventId) => {
            saveEvents(
              events.filter((event) => event.id !== eventId),
            );

            if (activeEventId === eventId) {
              openEvent(null);
            }
          }}
          onToggleDrink={(eventId, drinkId) =>
            saveEvents(
              events.map((event) => {
                if (event.id !== eventId) {
                  return event;
                }

                const selected =
                  event.drinkIds.includes(drinkId);

                return {
                  ...event,
                  drinkIds: selected
                    ? event.drinkIds.filter(
                        (id) => id !== drinkId,
                      )
                    : [...event.drinkIds, drinkId],
                };
              }),
            )
          }
          onBack={() => setSelectedCategory(null)}
        />
      ) : selectedCategory === "Favoris" ? (
        <section className="beer-page">
          <button
            className="back-link"
            type="button"
            onClick={() => setSelectedCategory(null)}
          >
            ← Retour
          </button>

          <div className="page-heading">
            <h2>Favoris</h2>
          </div>

          {favoriteDrinks.length === 0 ? (
            <div className="placeholder">
              <div className="placeholder-icon">⭐</div>
              <h3>Aucun favori</h3>
            </div>
          ) : (
            <div className="favorite-grid">
              {favoriteDrinks.map((drink) => (
                <button
                  className="favorite-card"
                  type="button"
                  key={drink.id}
                  onClick={(event) =>
                    addDrink(drink, event.currentTarget)
                  }
                >
                  <span className="favorite-image">
                    {drink.image}
                  </span>

                  <span className="favorite-name">
                    {drink.name}
                  </span>

                  <span className="favorite-add">
                    {cart[drink.id]?.quantity
                      ? `Dans la commande : ${
                          cart[drink.id].quantity
                        }`
                      : "+ Ajouter"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : selectedCategory === "Mes boissons" ? (
        <MyDrinksPage
          customDrinks={customDrinks}
          onBack={() => setSelectedCategory(null)}
          onAddDrink={addCustomDrink}
          onDeleteDrink={deleteCustomDrink}
        />
      ) : selectedCategory === "Paramètres" &&
        settingsPage === "À propos" ? (
        <AboutPage
          onBack={() => setSettingsPage(null)}
        />
      ) : selectedCategory === "Paramètres" ? (
        <SettingsPage
          onBack={() => {
            setSettingsPage(null);
            setSelectedCategory(null);
          }}
          onOpenAbout={() =>
            setSettingsPage("À propos")
          }
        />
      ) : (
        <>
          <section className="intro">
            {activeEvent && (
              <div className="active-event-banner">
                <span>🎉 {activeEvent.name}</span>

                <button
                  type="button"
                  onClick={() => openEvent(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <h2>Qu’est-ce qu’on prend ?</h2>
          </section>

          <section className="category-grid">
            {visibleCategories.map((category) => (
              <button
                className="category-card"
                type="button"
                key={category.name}
                onClick={() =>
                  setSelectedCategory(category.name)
                }
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
          </section>
        </>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onAdd={addDrink}
        onRemove={removeDrink}
        onClear={() => saveCart({})}
      />
    </main>
  );
}

export default App;
