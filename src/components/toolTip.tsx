import React from "react";

export enum Direction {
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
}

type Props = {
  text?: string;
  direction?: Direction;
  className?: string;
  position?: Position;
};

const Tooltip = (props: Props) => {
  const tooltipClass = `c-tooltip__content c-tooltip__content--${props.direction ?? "bottom"} ${props.className ?? ""}`;
  const style: React.CSSProperties = props.position
    ? {
        position: "absolute",
        left: `${props.position.x}px`,
        top: `${props.position.y}px`,
        transform: "translate(-50%, -100%)",
      }
    : {};
  return (
    <div className="c-tooltip" style={style}>
      {props.text}
      <div className={tooltipClass}>{props.text}</div>
    </div>
  );
};

export default Tooltip;
