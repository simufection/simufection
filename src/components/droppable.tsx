import React, { CSSProperties, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Droppable(props: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div
      id={props.id}
      ref={setNodeRef}
      style={props.style}
      className={props.className!}
    >
      {props.children}
    </div>
  );
}
