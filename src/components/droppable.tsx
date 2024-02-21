import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function Droppable(props: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    opacity: isOver ? 1 : 0.5,
  };

  return (
    <div ref={setNodeRef} style={style} className={props.className!}>
      {props.children}
    </div>
  );
}
