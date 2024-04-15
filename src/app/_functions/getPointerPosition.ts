export const getPointerPosition = () => {
  return new Promise((resolve) => {
    const mouseUpHandler = (event: PointerEvent) => {
      window.removeEventListener("pointerup", mouseUpHandler);

      resolve({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointerup", mouseUpHandler);
  });
};
