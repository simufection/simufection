"use strict";
import { useContext, useState } from "react";
import { GameStateContext } from "../contextProvoder";
import { Button } from "@/components/button";
import { maps } from "../_states/maps";
import { ParamsModel } from "../_params/params";
import { PlayingState } from "../_states/state";
import Image from "next/image";

type Props = {
  params: ParamsModel | null;
  ctx: CanvasRenderingContext2D | null;
};

const SelectMap = (props: Props) => {
  const [mapName, selectMapName] = useState("kanto");
  const { params, ctx } = props;
  const { gameState, startSimulate, updateGameStateForce } =
    useContext(GameStateContext)!;

  const onReady = !!(params && ctx && gameState);
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
                playingState: PlayingState.waiting,
              });
            }}
          />
          <Button
            className="p-game__select-map-button"
            label="開始"
            onClick={() => {
              startSimulate(params, onReady, mapName);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SelectMap;
