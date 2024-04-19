import { useContext, useState } from "react";
import Image from "next/image";
import { maps } from "@/app/_states/maps";
import { PlayingState } from "@/app/_states/state";
import { GameStateContext } from "@/app/contextProvoder";
import { Button } from "@/components/button";

const SelectView = () => {
  const [mapName, selectMapName] = useState("kanto");
  const { startSimulate, updateGameStateForce } = useContext(GameStateContext)!;

  return (
    <>
      <div className="p-select__map-box">
        <ul className="p-select__map-items">
          {Object.keys(maps).map((m) => {
            return (
              <li
                className={`p-select__map-item ${
                  m == mapName ? "-selected" : ""
                }`}
                key={m}
                onClick={() => {
                  selectMapName(m);
                }}
              >
                {m}
                <Image
                  src={maps[m].preview}
                  alt="map"
                  className="p-select__map-img"
                />
              </li>
            );
          })}
        </ul>
        <div className="p-select__map-buttons">
          <Button
            className="p-select__map-button"
            label="戻る"
            onClick={() => {
              updateGameStateForce({
                playingState: PlayingState.title,
              });
            }}
          />
          <Button
            className="p-select__map-button"
            label="開始"
            onClick={() => {
              startSimulate(mapName);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SelectView;
