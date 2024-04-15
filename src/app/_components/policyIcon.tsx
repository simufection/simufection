"use strict";
import Image, { StaticImageData } from "next/image";
import { Draggable } from "@/components/draggable";
import { Policy } from "../_functions/_policies/policies";

interface Props {
  className?: string;
  func: Function;
  disabled?: boolean;
  image?: StaticImageData;
  cost: number;
  id: string;
  ratio: number;
  data: Policy;
}

const PolicyIcon = (props: Props) => {
  const style = {
    background: `linear-gradient(to bottom, rgba(128, 128, 128, 0.5) ${
      (1 - props.ratio ?? 0) * 100
    }%, transparent 0%)`,
  };
  return (
    <Draggable
      id={props.id}
      data={{ func: props.func, data: props.data }}
      disabled={props.disabled}
      children={
        <>
          <div
            className={`c-policy-icon ${props.className || ""} ${props.disabled ? "-inactive" : ""}`}
            style={style}
          >
            <div className="c-policy-icon__overlay" style={style}></div>
            <div className="c-policy-icon__cost">{props.cost}</div>
            {props.image ? (
              <Image
                className="c-policy-icon__img"
                src={props.image}
                alt="img"
              />
            ) : null}
          </div>
        </>
      }
    />
  );
};

export default PolicyIcon;
