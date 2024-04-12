import { MouseEventHandler } from "react";

interface Props {
  className?: string;
  onClick?: MouseEventHandler;
}

export const CloseButton = (props: Props) => {
  return (
    <button
      className={`c-close-button ${props.className || ""}`}
      onClick={props.onClick}
    >
      ×
    </button>
  );
};
