import { useEffect, useState } from "react";
import useKey from "react-use/lib/useKey";

const nonFilter = () => true;

export const usePressKey = () => {
  const [downs, setDowns] = useState<Set<string>>(new Set());

  useKey(
    nonFilter,
    (e) => {
      setDowns((prevDowns) => new Set(prevDowns).add(e.key));
    },
    { event: "keydown" }
  );

  useKey(
    nonFilter,
    (e) => {
      setDowns((prevDowns) => {
        const newDowns = new Set(prevDowns);
        newDowns.delete(e.key);
        return newDowns;
      });
    },
    { event: "keyup" }
  );

  return downs;
};
