"use strict";
import Image, { StaticImageData } from "next/image";
import { MouseEventHandler } from "react";

interface Props {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  label?: string;
  disabled?: boolean;
  image?: StaticImageData;
}

export const Button = (props: Props) => {
  return (
    <button
      className={`c-button ${props.className || ""}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.image ? (
        <Image className="c-button__img" src={props.image} alt="pause" />
      ) : (
        props.label
      )}
    </button>
  );
};
