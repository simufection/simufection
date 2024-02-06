import { KeyModel } from "../_types/Models";

export type Keys = KeyModel;

const updateKey = (currentKeys: Keys, inputKeys: Set<string>): Keys => {
  const { down, up, downAll, id } = currentKeys;
  const [newDown, newUp] = [new Set<string>(), new Set<string>()];

  inputKeys.forEach((item) => {
    if (!downAll.has(item)) {
      newDown.add(item);
    }
  });

  downAll.forEach((item) => {
    if (!inputKeys.has(item)) {
      newUp.add(item);
    }
  });

  const newKey = {
    id: (id || 0) + 1,
    down: newDown,
    up: newUp,
    downAll: inputKeys,
  };

  return newKey;
};

export const updateKeys = (currentKeys: Keys, inputKeys: Set<string>): Keys => {
  const keys = updateKey(currentKeys, inputKeys);

  return keys;
};
