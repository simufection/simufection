import { Dispatch } from "react";

export const getPointerPosition = (): Promise<Position> => {
  return new Promise((resolve) => {
    const pointerUpHandler = (event: PointerEvent) => {
      window.removeEventListener("pointerup", pointerUpHandler);

      resolve({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointerup", pointerUpHandler);
  });
};
export const getPointerStopPosition = (setDraggingPos: Dispatch<Position | null>) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastX: number | null = null;
  let lastY: number | null = null;
  let firstX: number | null = null;
  let firstY: number | null = null;
  let isStopped = false;
  const threshold = 10;
  const releaseDistance = 20;
  const timeoutNum = 0.2

  const pointerMoveHandler = (event: PointerEvent) => {
    const currentX = event.clientX;
    const currentY = event.clientY;
    if (lastX !== null && lastY !== null) {
      const diffDistance = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
      if (diffDistance < threshold) {
        clearTimeout(timeoutId as NodeJS.Timeout);
        timeoutId = setTimeout(() => {
          if (!isStopped) {
            setDraggingPos({ x: currentX, y: currentY });
            isStopped = true;
            firstX = currentX;
            firstY = currentY;
          }
        }, timeoutNum * 1000);
      }
      if (firstX !== null && firstY !== null) {
        const moveDistance = Math.sqrt(Math.pow(currentX - firstX, 2) + Math.pow(currentY - firstY, 2));
        if (isStopped && moveDistance > releaseDistance) {
          isStopped = false;
          setDraggingPos(null);
          clearTimeout(timeoutId as NodeJS.Timeout);
          firstX = null;
          firstY = null;
        }
      }
    }
    lastX = currentX;
    lastY = currentY;
  };

  return {
    addListener: () => window.addEventListener('pointermove', pointerMoveHandler),
    removeListener: () => {
      window.removeEventListener('pointermove', pointerMoveHandler);
      clearTimeout(timeoutId as NodeJS.Timeout);
      setDraggingPos(null);
      isStopped = false;
    }
  };
};
