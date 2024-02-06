"use strict";
import { ChangeEvent, ChangeEventHandler, useState } from "react";

interface Props {
  className?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string | number;
  type?: string;
  disabled?: boolean;
}

export const InputBox = (props: Props) => {
  const [inputValue, setValue] = useState(props.value);
  const onInput = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  return (
    <input
      type={props.type || "string"}
      className={`c-input-box ${props.className || ""}`}
      onChange={onInput}
      onBlur={props.onChange}
      value={inputValue}
      placeholder={props.placeholder}
      disabled={props.disabled || false}
    />
  );
};
