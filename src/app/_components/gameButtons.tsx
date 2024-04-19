"use strict";
import { Button } from "@/components/button";
import { PlayingState } from "@/app/_states/state";

import pauseImage from "@/assets/img/pause-icon.png";
import startImage from "@/assets/img/start-icon.png";
import quitImage from "@/assets/img/quit-icon.png";
import rankingImage from "@/assets/img/ranking-icon.png";
import { ParamsModel } from "@/app/_params/params";
import { useContext } from "react";
import { CanvasContext, GameStateContext } from "@/app/contextProvoder";
import { useRouter } from "next/navigation";

export const PlayingButtons = ({ params }: { params: ParamsModel }) => {
  const { ctx } = useContext(CanvasContext)!;
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
          onClick={() => quitSimulate(onReady, ctx)}
        />
      ) : null}
      {[PlayingState.playing, PlayingState.pausing].includes(
        gameState.playingState
      ) ? (
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
