import { useContext, useEffect } from "react";
import { DndContext, DragEndEvent, getClientRect } from "@dnd-kit/core";
import {
  updateBackGround,
  drawGameScreen,
  drawOverLay,
} from "@/app/_functions/_drawing/draw";
import { policies } from "@/app/_functions/_policies/policies";
import { PlayingButtons } from "@/app/_components/gameButtons";
import PolicyIcon from "@/app/_components/policyIcon";
import { getPointerPosition } from "@/app/_functions/getPointerPosition";
import { eventMessage } from "@/app/_params/eventMessage";
import { stateIsPlaying } from "@/app/_params/consts";
import { PlayingState, updateGameState } from "@/app/_states/state";
import {
  CanvasContext,
  GameSizeContext,
  GameStateContext,
} from "@/app/contextProvoder";
import Loading from "@/app/loading";
import { Droppable } from "@/components/droppable";
import useInterval from "@/hooks/useInterval";

const GameView = () => {
  const { gameSize } = useContext(GameSizeContext)!;
  const { ctx, createCtx } = useContext(CanvasContext)!;
  const { offCvs, setOffCvs, gameState, updateGameStateForce, params } =
    useContext(GameStateContext)!;
  const onReady = !!(params && ctx && gameState);

  useEffect(() => {
    if (params) {
      const canvas = document.getElementById("screen") as HTMLCanvasElement;
      canvas.width = params.MAX_WIDTH;
      canvas.height = params.MAX_HEIGHT + 50;
      createCtx(params);
    }
  }, []);

  useInterval(
    () => {
      if (onReady && offCvs) {
        if (
          gameState.map.prefIds.reduce((flag: boolean, prefId: number) => {
            return flag || gameState.prefs[prefId].updated;
          }, false)
        ) {
          setOffCvs(
            updateBackGround(gameState.map.map, gameState.prefs, params, offCvs)
          );
        }
        drawGameScreen(ctx, gameState, params, offCvs);
        if (gameState.playingState == PlayingState.pausing) {
          drawOverLay(ctx, params);
        } else {
          updateGameStateForce(updateGameState(gameState, params));
        }
      }
    },
    params?.INTERVAL * 1000 ?? 30
  );

  return (
    <div className={`p-game`}>
      <DndContext
        onDragEnd={async (event: DragEndEvent) => {
          const { active } = event;
          if (!active.data.current || !active.data.current.func) {
            return;
          }
          const mousePos = await getPointerPosition();
          const cvsRect = getClientRect(document.getElementById("screen")!);
          const cvsPos = { x: cvsRect.left, y: cvsRect.top };

          active.data.current.func(mousePos, cvsPos);
        }}
      >
        <Droppable id="canvas" className="p-game__canvas-container">
          <canvas
            id="screen"
            style={{
              width: gameSize[0],
              height: gameSize[1],
            }}
          >
            サポートされていません
          </canvas>
        </Droppable>
        <div className="p-game__timeline-container">
          <div className="p-game__timeline">
            {onReady
              ? gameState.events
                  .toReversed()
                  .map((r) => {
                    return eventMessage(r[0], r[2])[r[1]];
                  })
                  .join("\n")
              : ""}
          </div>
        </div>

        <div
          className="p-game__policies"
          style={{
            width: gameSize[0],
          }}
        >
          {onReady && stateIsPlaying.includes(gameState.playingState)
            ? policies(params)
                .filter((policy) => policy.isActive)
                .map((policy) => {
                  const events = gameState.events.filter(
                    (e) => e[1] == `policy_${policy.key}`
                  );
                  const lastTurn =
                    events.length > 0 ? events[events.length - 1][0] : null;
                  return (
                    <PolicyIcon
                      key={policy.key}
                      id={`policy-${policy.key}`}
                      image={policy.image}
                      disabled={
                        gameState.playingState == PlayingState.pausing ||
                        gameState.policyData[policy.key].cost >
                          gameState.player.points
                      }
                      cost={gameState.policyData[policy.key].cost}
                      func={(mousePos: Position, cvsPos: Position) => {
                        if (
                          gameState.playingState == PlayingState.playing &&
                          gameState.policyData[policy.key].cost <=
                            gameState.player.points &&
                          (!policy.cooltime ||
                            !lastTurn ||
                            gameState.sceneState.turns >
                              policy.cooltime + lastTurn)
                        ) {
                          updateGameStateForce(
                            policy.func(
                              gameState,
                              params,
                              cvsPos,
                              mousePos,
                              gameSize[0]
                            )
                          );
                        }
                      }}
                      className={`p-game__policy-button ${
                        gameState.policyData[policy.key].cost >
                        gameState.player.points
                          ? "-inactive"
                          : ""
                      }`}
                      ratio={
                        policy.cooltime && lastTurn
                          ? (gameState.sceneState.turns - lastTurn) /
                            policy.cooltime
                          : 1
                      }
                    />
                  );
                })
            : null}
        </div>
      </DndContext>
      <PlayingButtons params={params!} />
    </div>
  );
};

export default GameView;
