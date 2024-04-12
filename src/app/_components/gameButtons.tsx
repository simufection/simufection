"use strict";
import { Button } from "@/components/button";
import { GameState, PlayingState } from "@/app/_states/state";

import pauseImage from "@/assets/img/pause-icon.png";
import startImage from "@/assets/img/start-icon.png";
import quitImage from "@/assets/img/quit-icon.png";
import homeImage from "@/assets/img/home-icon.png";
import rankingImage from "@/assets/img/ranking-icon.png";
import { ParamsModel } from "@/app/_params/params";
import { stateIsPlaying } from "@/app/_params/consts";
import { Dispatch, MouseEventHandler, useContext } from "react";
import { CanvasContext, GameStateContext } from "@/app/contextProvoder";
import { useRouter } from "next/navigation";

type Props = {
  params: ParamsModel | null;
  showRanking: Dispatch<boolean>;
};

export const GameButtons = (props: Props) => {
  const { ctx } = useContext(CanvasContext)!;
  const { params } = props;
  const { gameState, quitSimulate, updateGameStateForce } =
    useContext(GameStateContext)!;

  const onReady = !!(params && ctx && gameState);

  if (!onReady) {
    return <></>;
  }
  return (
    <>
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
              ? updateGameStateForce({
                  playingState: PlayingState.playing,
                })
              : updateGameStateForce({
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
            updateGameStateForce({ playingState: PlayingState.title })
          }
        />
      ) : null}
      {gameState.playingState == PlayingState.title ||
      gameState.playingState == PlayingState.finishing ? (
        <Button
          className={`p-game__ranking-button${
            gameState.playingState == PlayingState.finishing ? "_result" : ""
          } u-tr`}
          image={rankingImage}
          onClick={() => props.showRanking(true)}
        />
      ) : null}
    </>
  );
};

export const RankingButton = ({
  className,
}: {
  playingState: PlayingState;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <Button
      className={`c-ranking-button ${className} u-tr`}
      image={rankingImage}
      onClick={() => router.push("/ranking")}
    />
  );
};
