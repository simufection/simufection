import { useContext, useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  getClientRect,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  updateBackGround,
  drawGameScreen,
  drawOverLay,
} from "@/app/_functions/_drawing/draw";
import {
  Policy,
  PolicyPreviewArea,
  mapPos,
  policies,
} from "@/app/_functions/_policies/policies";
import { PlayingButtons } from "@/app/_components/gameButtons";
import PolicyIcon from "@/app/_components/policyIcon";
import {
  getPointerPosition,
  getPointerStopPosition,
} from "@/app/_functions/getPointerPosition";
import { eventMessage } from "@/app/_params/eventMessage";
import { stateIsPlaying } from "@/app/_params/consts";
import { PlayingState, updateGameState } from "@/app/_states/state";
import {
  CanvasContext,
  GameSizeContext,
  GameStateContext,
} from "@/app/contextProvoder";
import { Droppable } from "@/components/droppable";
import useInterval from "@/hooks/useInterval";
import { updatePrefPreview } from "../_states/pref";

const GameView = () => {
  const { gameSize } = useContext(GameSizeContext)!;
  const { ctx, createCtx } = useContext(CanvasContext)!;
  const { offCvs, setOffCvs, gameState, updateGameStateForce, params } =
    useContext(GameStateContext)!;
  const onReady = !!(params && ctx && gameState);
  const [draggingPos, setDraggingPos] = useState<Position | null>(null);
  const [draggingPolicy, setDraggingPolicy] = useState<Policy | null>(null);

  const [updatePreview, setUpdatePreview] = useState(false);
  const [handlers, setHandlers] = useState<{
    addListener: () => void;
    removeListener: () => void;
  } | null>(null);

  const updateLockdown =
    gameState &&
    gameState.map.prefIds.reduce((flag: boolean, prefId: number) => {
      return flag || gameState.prefs[prefId].updated;
    }, false);

  const setPreviewPrefs = () => {
    if (onReady) {
      const previewPrefs = [];
      if (draggingPos) {
        const cvsRect = getClientRect(document.getElementById("screen")!);
        const cvsPos = { x: cvsRect.left, y: cvsRect.top };
        const pos = mapPos(
          cvsPos,
          draggingPos,
          gameState.map,
          params,
          gameSize[0]
        );
        if (pos && draggingPolicy) {
          switch (draggingPolicy.previewArea) {
            case PolicyPreviewArea.pref:
              const prefId = gameState.map.map[pos.x][pos.y];
              if (prefId > 0) {
                previewPrefs.push(prefId);
              }
              break;
            case PolicyPreviewArea.all:
              previewPrefs.push(0);
              break;
            default:
              break;
          }
        }
      }
      updateGameStateForce({
        prefs: updatePrefPreview(gameState.prefs, previewPrefs),
      });
      setUpdatePreview(true);
    }
  };

  useEffect(() => {
    if (params) {
      const canvas = document.getElementById("screen") as HTMLCanvasElement;
      canvas.width = params.MAX_WIDTH;
      canvas.height = params.MAX_HEIGHT + 50;
      createCtx(params);
    }
  }, []);

  useEffect(() => {
    if (handlers) {
      handlers.addListener();
    }
  }, [handlers]);

  useEffect(() => {
    setPreviewPrefs();
  }, [draggingPos]);

  useInterval(
    () => {
      if (onReady && offCvs) {
        if (updateLockdown || updatePreview) {
          setOffCvs(
            updateBackGround(gameState.map.map, gameState.prefs, params, offCvs)
          );
          setUpdatePreview(false);
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

  const detectSensor = () => {
    const isMobile = navigator.userAgent.match(/iPhone|Android.+Mobile/);
    return isMobile ? TouchSensor : PointerSensor
  };
  const sensors = useSensors(useSensor(detectSensor()));

  return (
    <div className={`p-game`}>
      <DndContext
        onDragEnd={async (event: DragEndEvent) => {
          if (handlers) {
            handlers.removeListener();
            setHandlers(null);
          }
          setDraggingPolicy(null);
          const { active } = event;
          if (!active.data.current || !active.data.current.func) {
            return;
          }
          const mousePos = await getPointerPosition();

          const cvsRect = getClientRect(document.getElementById("screen")!);
          const cvsPos = { x: cvsRect.left, y: cvsRect.top };
          active.data.current.func(mousePos, cvsPos);
        }}
        onDragStart={(event: DragStartEvent) => {
          if (event.active.data.current) {
            setDraggingPolicy(event.active.data.current.data);
          }
          if (!handlers) {
            setHandlers(getPointerStopPosition(setDraggingPos));
          }
        }}
        sensors={sensors}
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
                    events.length > 0
                      ? events[events.length - 1][0]
                      : policy.firstCooltime;
                  return (
                    <PolicyIcon
                      key={policy.key}
                      id={`policy-${policy.key}`}
                      data={policy}
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
