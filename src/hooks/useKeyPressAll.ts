import { useEffect, useReducer, useRef } from "react";
import useKey, { Handler } from "react-use/lib/useKey";

const noop = () => {};
const nonFilter = () => true;
const mapReducer = (
  v: Record<string, boolean>,
  { key, down }: { key: string; down: boolean }
) => ({ ...v, [key]: down });

export const useKeyPressAll = (
  keydown: Handler,
  keyup: Handler = noop,
  keydownAll: Handler = noop
) => {
  const [downs, set] = useReducer(mapReducer, {} as Record<string, boolean>);
  const downsRef = useRef(downs);

  useEffect(() => {
    downsRef.current = downs;
  }, [downs]);

  useKey(
    nonFilter,
    (e) => {
      keydownAll(e);

      if (!downsRef.current[e.key]) keydown(e);
      set({ key: e.key, down: true });
    },
    { event: "keydown" }
  );
  useKey(
    nonFilter,
    (e) => {
      if (downsRef.current[e.key]) keyup(e);
      set({ key: e.key, down: false });
    },
    { event: "keyup" }
  );
  return { downs };
};
