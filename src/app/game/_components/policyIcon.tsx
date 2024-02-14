"use strict";
import { useInteract } from "@/hooks/useInteract";
import Image, { StaticImageData } from "next/image";
import { MouseEventHandler, useEffect } from "react";

interface Props {
  className?: string;
  onClick: Function;
  disabled?: boolean;
  image?: StaticImageData;
  cost: number;
}

export const PolicyIcon = (props: Props) => {
  const interact = useInteract();

  useEffect(() => {
    props.onClick(interact.lastPosition);
  }, [interact.lastPosition]);

  return (
    <button
      className={`c-policy-icon ${props.className || ""}`}
      ref={interact.ref}
      style={
        props.disabled
          ? {}
          : {
              ...{ cursor: "pointer" },
              ...interact.style,
            }
      }
    >
      <div className="c-policy-icon__cost">{props.cost}</div>
      {props.image ? (
        <Image className="c-policy-icon__img" src={props.image} alt="img" />
      ) : null}
    </button>
  );
};
