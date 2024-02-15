import { CSSProperties, useEffect, useRef, useState } from "react";
import interact from "interactjs";

const initPosition = {
  x: 0,
  y: 0,
};

export const useInteract = (
  position: Partial<typeof initPosition> = initPosition
) => {
  const [_position, setPosition] = useState({
    ...initPosition,
    ...position,
  });

  const [lastPosition, setLastPosition] = useState({
    ...initPosition,
    ...position,
  });

  const [onDrag, setOnDrag] = useState(false);

  const interactRef = useRef(null);
  let { x, y } = _position;

  const enable = () => {
    interact(interactRef.current as unknown as HTMLElement)
      .draggable({
        inertia: false,
      })
      .on("dragstart", () => {
        setOnDrag(true);
      })
      .on("dragmove", (event) => {
        setPosition((prevPosition) => ({
          x: prevPosition.x + event.dx,
          y: prevPosition.y + event.dy,
        }));
      })
      .on("dragend", (event) => {
        setPosition(initPosition);
        setLastPosition(event.page);
        setOnDrag(false);
      });
  };

  const disable = () => {
    if (interactRef.current) {
      interact(interactRef.current as unknown as HTMLElement).unset();
    }
  };

  useEffect(() => {
    enable();
    return disable;
  }, []);

  return {
    ref: interactRef,
    style: onDrag
      ? {
          transform: `translate3D(${_position.x}px, ${_position.y}px, 0)`,
        }
      : {},
    lastPosition: lastPosition,
  };
};
