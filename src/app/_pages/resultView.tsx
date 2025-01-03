import { useContext, useEffect } from "react";
import Image from "next/image";
import { RankingButton } from "@/app/_components/gameButtons";
import SendScoreInput from "@/app/_components/sendScoreInput";
import { scoreToRank } from "@/app/_functions/_game/rank";
import { calcScore } from "@/app/_functions/_game/score";
import { PlayingState } from "@/app/_states/state";
import { GameStateContext, UserDataContext } from "@/app/contextProvoder";
import homeImage from "@/assets/img/home-icon.png";
import virusImage1 from "@/assets/img/virus1.png";
import virusImage2 from "@/assets/img/virus2.png";
import { Button } from "@/components/button";
import ShareButtons from "@/app/_components/shareButton";

const colorList = ["yw", "gr", "bl", "wt", "gy", "re"];

const ResultView = () => {
  const { gameState, score, updateGameStateForce, params, setScore, mapName } =
    useContext(GameStateContext)!;

  const { userId } = useContext(UserDataContext)!;

  if (!gameState || !params) return null;

  useEffect(() => {
    if (!score) {
      setScore(calcScore(gameState, params, userId) ?? 0);
    }
  }, []);

  return (
    <div className="p-result">
      <div className="p-result__header">
        <Image className="p-result__virus1" src={virusImage1} alt="virus" />
        <Image className="p-result__virus2" src={virusImage2} alt="virus" />
        <div className="p-result__title">最終スコア</div>
      </div>
      <div className="p-result__score-container">
        <div className="p-result__score">スコア　　：　　{score}</div>
        <div className="p-result__score">
          クリア日数：　　{Math.floor(gameState.sceneState.turns / 5)}日
        </div>
        <div className="p-result__score">
          死者数　　：　　{gameState.sceneState.deadCount}人
        </div>
      </div>
      {mapName == "tutorial" ? null : (
        <>
          <div className="p-result__rank">
            <Image
              className="p-result__rank-image"
              src={scoreToRank(score).image}
              alt="rank"
            />
            <div
              className={`p-result__rank-name u-${
                colorList[scoreToRank(score).index]
              }`}
            >
              {scoreToRank(score).name}
            </div>
          </div>
          {gameState.sceneState.contactedCount === 1 ? null : (
            <SendScoreInput />
          )}
        </>
      )}
      <Button
        className="p-result__restart-button u-tr"
        image={homeImage}
        onClick={() =>
          updateGameStateForce({ playingState: PlayingState.title })
        }
      />
      <RankingButton
        playingState={PlayingState.finishing}
        className="p-result__ranking-button"
      />
      <ShareButtons score={score} />
    </div>
  );
};

export default ResultView;
