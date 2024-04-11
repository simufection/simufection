import { useContext } from "react";
import { GameState } from "../_states/state";
import SendScoreInput from "./sendScoreInput";
import { GameStateContext } from "../contextProvoder";
import { scoreToRank } from "../_functions/_game/rank";
import Image from "next/image";

import virusImage1 from "@/assets/img/virus1.png";
import virusImage2 from "@/assets/img/virus2.png";

const colorList = ["yw", "gr", "bl", "wt", "gy", "re"];

const Result = () => {
  const { gameState: state, score } = useContext(GameStateContext)!;
  if (!state || !score) return null;
  const rank = scoreToRank(score);
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
          ターン数　：　　{state.sceneState.turns}
        </div>
        <div className="p-result__score">
          死者数　　：　　{state.sceneState.deadCount}
        </div>
      </div>
      <div className="p-result__rank">
        <Image className="p-result__rank-image" src={rank.image} alt="rank" />
        <div className={`p-result__rank-name u-${colorList[rank.index]}`}>
          {rank.name}
        </div>
      </div>
      {state.sceneState.contactedCount === 1 ? null : <SendScoreInput />}
    </div>
  );
};

export default Result;
