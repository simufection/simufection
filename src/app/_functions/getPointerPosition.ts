export const getPointerPosition = () => {
  return new Promise((resolve) => {
    const pointerUpHandler = (event: PointerEvent) => {
      window.removeEventListener("pointerup", pointerUpHandler);

      resolve({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointerup", pointerUpHandler);
  });
};
