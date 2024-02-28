"use strict";
import { Button } from "@/components/button";
import { GameState, PlayingState } from "../_states/state";

import pauseImage from "@/assets/img/pause-icon.png";
import startImage from "@/assets/img/start-icon.png";
import quitImage from "@/assets/img/quit-icon.png";
import homeImage from "@/assets/img/home-icon.png";
import { ParamsModel } from "../_params/params";
import { stateIsPlaying } from "../_params/consts";
import { useContext } from "react";
import { GameStateContext } from "../contextProvoder";

type Props = {
  params: ParamsModel | null;
  ctx: CanvasRenderingContext2D | null;
};

export const GameButtons = (props: Props) => {
  const { params, ctx } = props;
  const {
    gameState,
    startSimulate,
    quitSimulate,
    updateGameStateFromGameView,
  } = useContext(GameStateContext);

  const onReady = !!(params && ctx && gameState);

  if (!onReady) {
    return <></>;
  }
  return (
    <>
      {gameState.playingState == PlayingState.waiting ? (
        <Button
          className="p-game__start-button u-tr"
          image={startImage}
          onClick={() =>
            updateGameStateFromGameView({
              playingState: PlayingState.selecting,
            })
          }
        />
      ) : null}
      {gameState.playingState == PlayingState.pausing ? (
        <Button
          className="p-game__quit-button u-tr"
          image={quitImage}
          onClick={() => quitSimulate(params, onReady, ctx)}
        />
      ) : null}
      {stateIsPlaying.includes(gameState.playingState) ? (
        <Button
          className={`p-game__pause-button u-tr`}
          image={
            gameState.playingState == PlayingState.pausing
              ? startImage
              : pauseImage
          }
          onClick={() => {
            gameState.playingState == PlayingState.pausing
              ? updateGameStateFromGameView({
                  playingState: PlayingState.playing,
                })
              : updateGameStateFromGameView({
                  playingState: PlayingState.pausing,
                });
          }}
        />
      ) : null}
      {gameState.playingState == PlayingState.finishing ? (
        <Button
          className="p-game__restart-button u-tr"
          image={homeImage}
          onClick={() =>
            updateGameStateFromGameView({ playingState: PlayingState.waiting })
          }
        />
      ) : null}
    </>
  );
};
