"use strict";
import { MouseEventHandler } from "react";

interface Props {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  label?: string;
  disabled?: boolean;
}

export const Button = (props: Props) => {
  return (
    <button
      className={`c-button ${props.className || ""}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
};
