import { CSSProperties, useContext, useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  getClientRect,
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
import { ParamsModel } from "../_params/params";
import { Spotlight, tutorialEventsData } from "../_tutorial/tutorial";

const TutorialView = () => {
  const { gameSize, ratio } = useContext(GameSizeContext)!;
  const { ctx, createCtx } = useContext(CanvasContext)!;
  const { offCvs, setOffCvs, gameState, updateGameStateForce, params } =
    useContext(GameStateContext)!;

  const [tutorialParams, setTutorialParams] = useState<ParamsModel>();
  const onReady = !!(tutorialParams && ctx && gameState);
  const [draggingPos, setDraggingPos] = useState<Position | null>(null);
  const [draggingPolicy, setDraggingPolicy] = useState<Policy | null>(null);

  const [updatePreview, setUpdatePreview] = useState(false);
  const [handlers, setHandlers] = useState<{
    addListener: () => void;
    removeListener: () => void;
  } | null>(null);
  const [tutorialProgress, setTutorialProgress] = useState(0);
  const [tutorialMessages, setMessages] = useState<string[]>([]);
  const [tutorialMessageIndex, settMessageIndex] = useState(0);
  const [tutorialTurns, setTutorialTurns] = useState(0);
  const [spottedElement, setSpottedElement] = useState<string>();
  const [spotlight, setSpotlight] = useState<Spotlight>();

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
          tutorialParams,
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
    setTutorialParams({
      ...params,
      ...{
        MAX_BALLS: 100,
      },
    });
  }, []);

  useEffect(() => {
    if (tutorialParams) {
      const canvas = document.getElementById("screen") as HTMLCanvasElement;
      canvas.width = tutorialParams.MAX_WIDTH;
      canvas.height = tutorialParams.MAX_HEIGHT + 50;
      createCtx(tutorialParams);
    }
  }, [tutorialParams]);

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
            updateBackGround(
              gameState.map.map,
              gameState.prefs,
              tutorialParams,
              offCvs
            )
          );
          setUpdatePreview(false);
        }
        drawGameScreen(ctx, gameState, tutorialParams, offCvs);
        if (gameState.playingState == PlayingState.pausing) {
          drawOverLay(ctx, tutorialParams);
        } else {
          updateGameStateForce(
            updateGameState(gameState, tutorialParams, true)
          );
        }

        const eventsData = [...tutorialEventsData(gameState, tutorialTurns)];
        const index = eventsData.findIndex(
          (e, i) => e.condition && tutorialProgress == i
        );

        if (index != -1) {
          const event = eventsData[index];
          setMessages(event.messages ?? []);
          if (event?.func) {
            updateGameStateForce(event.func(tutorialParams));
          }
          setTutorialProgress(index + 1);
          setTutorialTurns(0);
          setSpottedElement(event.spotlightElement);
          setSpotlight(event.spotlight);
        }
        setTutorialTurns((prev) => prev + 1);
      }
    },
    tutorialParams?.INTERVAL * 1000 ?? 30
  );

  return (
    <div
      className={`p-game`}
      onClick={() => {
        if (gameState?.playingState == PlayingState.tutorial) {
          if (tutorialMessageIndex + 1 >= tutorialMessages.length) {
            updateGameStateForce({ tutorialMessage: "clicked" });
            setMessages([]);
            settMessageIndex(0);
          } else {
            settMessageIndex((prev) => prev + 1);
          }
        }
      }}
    >
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
          if (gameState?.playingState == PlayingState.tutorial) {
            if (tutorialProgress == 7)
              if (active.data.current.data.key == "v") {
                active.data.current.func(mousePos, cvsPos);
              } else {
                setMessages(["その政策は使えません"]);
              }
          } else {
            active.data.current.func(mousePos, cvsPos);
          }
        }}
        onDragStart={(event: DragStartEvent) => {
          if (event.active.data.current) {
            setDraggingPolicy(event.active.data.current.data);
          }
          if (!handlers) {
            setHandlers(getPointerStopPosition(setDraggingPos));
          }
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
          {gameState?.playingState == PlayingState.tutorial ? (
            <div
              className="p-game__tutorial-overlay"
              style={
                {
                  "--posX": `${(spotlight?.position.x ?? 0) * ratio}px`,
                  "--posY": `${(spotlight?.position.y ?? 0) * ratio}px`,
                  "--width": `${(spotlight?.size.x ?? 0) * ratio}px`,
                  "--height": `${(spotlight?.size.y ?? 0) * ratio}px`,
                } as CSSProperties
              }
            >
              <div className="p-game__tutorial-message">
                {tutorialMessages[tutorialMessageIndex]}
              </div>
              <div className="p-game__tutorial-next">{">>>"}</div>
            </div>
          ) : null}
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
            ? policies(tutorialParams)
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
                      data={policy}
                      image={policy.image}
                      disabled={
                        gameState.playingState == PlayingState.pausing ||
                        gameState.policyData[policy.key].cost >
                          gameState.player.points ||
                        tutorialMessages.length > 0
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
                              tutorialParams,
                              cvsPos,
                              mousePos,
                              gameSize[0]
                            )
                          );
                        } else if (
                          tutorialProgress == 7 &&
                          policy.key == "v" &&
                          mapPos(
                            cvsPos,
                            mousePos,
                            gameState.map,
                            tutorialParams,
                            gameSize[0]
                          )
                        ) {
                          updateGameStateForce({
                            ...policy.func(
                              gameState,
                              tutorialParams,
                              cvsPos,
                              mousePos,
                              gameSize[0]
                            ),
                            ...{ tutorialMessage: "dropped" },
                          });
                        }
                      }}
                      className={`p-game__policy-button ${
                        gameState.policyData[policy.key].cost >
                        gameState.player.points
                          ? "-inactive"
                          : ""
                      } ${spottedElement == policy.key ? "-spotted" : ""}`}
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
      <PlayingButtons params={tutorialParams!} />
    </div>
  );
};

export default TutorialView;
