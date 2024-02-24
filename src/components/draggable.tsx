import React, { ReactNode, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  children?: ReactNode;
  data?: { [name: string]: any };
}

export const Draggable = (props: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: props.data,
  });
  const data = props.data;
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      id={props.id}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </button>
  );
};
