import { useRef } from "react";
import { useEffects } from "./EffectsProvider";

function BubbleButton({
  animate = true,
  className = "",
  children,
  onClick,
  ...buttonProps
}) {
  const buttonRef = useRef(null);
  const { triggerBubbleAt } = useEffects();

  const handleClick = (event) => {
    if (animate && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      const x = rect.right - 24;
      const y = rect.top + rect.height / 2;

      triggerBubbleAt(x, y);
    }

    onClick?.(event);
  };

  return (
    <button
      {...buttonProps}
      ref={buttonRef}
      className={`murge-bubble-button ${className}`.trim()}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default BubbleButton;
