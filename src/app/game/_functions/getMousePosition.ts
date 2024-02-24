export const getMousePosition = () => {
  return new Promise((resolve) => {
    const mouseUpHandler = (event: MouseEvent) => {
      window.removeEventListener("mouseup", mouseUpHandler);

      resolve({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mouseup", mouseUpHandler);
  });
};
