import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

function CartDrawer({
  isOpen,
  cart,
  onClose,
  onAdd,
  onRemove,
  onClear,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const items = Object.values(cart);

  const confirmClear = () => {
    onClear();
    setIsConfirmOpen(false);
  };

  return (
    <>
      {isOpen && (
        <button
          className="cart-overlay"
          type="button"
          aria-label="Fermer le panier"
          onClick={onClose}
        />
      )}

      <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`}>
        <div className="cart-handle" />

        <div className="cart-drawer-header">
          <div>
            <p className="eyebrow">Commande actuelle</p>
            <h2>Ma commande</h2>
          </div>

          <button
            className="cart-close-button"
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span>🛒</span>
            <h3>Commande vide</h3>
            <p>Ajoute une boisson pour commencer.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <span className="cart-item-image">{item.image}</span>

                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <small>{item.category}</small>
                  </div>

                  <div className="cart-item-controls">
                    <button
                      type="button"
                      onClick={() => onRemove(item)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => onAdd(item)}
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <button
                className="clear-cart-button"
                type="button"
                onClick={() => setIsConfirmOpen(true)}
              >
                🗑️ Vider
              </button>

              <button
                className="close-cart-button"
                type="button"
                onClick={onClose}
              >
                Terminé
              </button>
            </div>
          </>
        )}
      </aside>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Vider la commande ?"
        message="Toute la commande en cours sera supprimée."
        confirmLabel="Vider"
        onConfirm={confirmClear}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}

export default CartDrawer;
