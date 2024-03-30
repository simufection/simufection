import { MouseEventHandler } from "react";

interface Props {
  addClass?: string;
  onClick?: MouseEventHandler;
}

export const CloseButton = (props: Props) => {
  return (
    <button
      className={`c-close-button ${props.addClass || ""}`}
      onClick={props.onClick}
    >
      ×
    </button>
  );
};
