import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const EffectsContext = createContext(null);

export function EffectsProvider({ children }) {
  const [effects, setEffects] = useState([]);

  const triggerBubbleAt = useCallback((x, y) => {
    const id = crypto.randomUUID();

    setEffects((current) => [
      ...current,
      { id, x, y },
    ]);

    window.setTimeout(() => {
      setEffects((current) =>
        current.filter((effect) => effect.id !== id),
      );
    }, 900);
  }, []);

  const value = useMemo(
    () => ({ triggerBubbleAt }),
    [triggerBubbleAt],
  );

  return (
    <EffectsContext.Provider value={value}>
      {children}

      <div className="murge-effects-layer" aria-hidden="true">
        {effects.map((effect) => (
          <span
            className="murge-global-bubble"
            key={effect.id}
            style={{
              left: `${effect.x}px`,
              top: `${effect.y}px`,
            }}
          />
        ))}
      </div>
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectsContext);

  if (!context) {
    throw new Error(
      "useEffects doit être utilisé dans EffectsProvider",
    );
  }

  return context;
}
