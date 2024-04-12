"use strict";
import { useContext, useEffect, useState } from "react";
import { CanvasContext, GameStateContext } from "@/app/contextProvoder";
import { Button } from "@/components/button";
import { maps } from "@/app/_states/maps";
import { ParamsModel } from "@/app/_params/params";
import { PlayingState } from "@/app/_states/state";
import Image from "next/image";

type Props = {
  params: ParamsModel | null;
};

const SelectView = (props: Props) => {
  const [mapName, selectMapName] = useState("kanto");
  const { params } = props;
  const { gameState, startSimulate, updateGameStateForce } =
    useContext(GameStateContext)!;

  return (
    <>
      <div className="p-game__select-map-box">
        <ul className="p-game__select-map-items">
          {Object.keys(maps).map((m) => {
            return (
              <li
                className={`p-game__select-map-item ${
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
                  className="p-game__select-map-img"
                />
              </li>
            );
          })}
        </ul>
        <div className="p-game__select-map-buttons">
          <Button
            className="p-game__select-map-button"
            label="戻る"
            onClick={() => {
              updateGameStateForce({
                playingState: PlayingState.title,
              });
            }}
          />
          <Button
            className="p-game__select-map-button"
            label="開始"
            onClick={() => {
              startSimulate(params, mapName);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SelectView;
