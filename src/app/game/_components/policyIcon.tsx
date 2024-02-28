"use strict";
import Image, { StaticImageData } from "next/image";
import { Draggable } from "@/components/draggable";

interface Props {
  className?: string;
  func: Function;
  disabled?: boolean;
  image?: StaticImageData;
  cost: number;
  id: string;
}

const PolicyIcon = (props: Props) => {
  return (
    <Draggable
      id={props.id}
      data={{ func: props.func }}
      children={
        <div className={`c-policy-icon ${props.className || ""}`}>
          <div className="c-policy-icon__cost">{props.cost}</div>
          {props.image ? (
            <Image className="c-policy-icon__img" src={props.image} alt="img" />
          ) : null}
        </div>
      }
    />
  );
};

export default PolicyIcon;
