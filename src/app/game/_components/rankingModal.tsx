"use strict";

import { CloseButton } from "@/components/closeButton";

interface Props {
  rankingData: RankingData | null;
  closeModal: Function;
}

const RankingModal = (props: Props) => {
  return (
    <div className="p-ranking">
      {props.rankingData ? (
        <div className="p-ranking__container">
          <CloseButton
            onClick={() => props.closeModal()}
            addClass="p-ranking__close-button"
          />
          <div className="p-ranking__all">
            <li className="p-ranking__row">スコアランキング</li>
            {props.rankingData.all.map((item, index) => (
              <li key={index} className="p-ranking__row">
                <div>{item.urName}</div>
                <div>{item.score}</div>
              </li>
            ))}
          </div>
          <div className="p-ranking__today">
            <li className="p-ranking__row">今日のランキング</li>
            {props.rankingData.today.map((item, index) => (
              <li key={index} className="p-ranking__row">
                <div>{item.urName}</div>
                <div>{item.score}</div>
              </li>
            ))}
          </div>
        </div>
      ) : (
        <>読み込み中です</>
      )}
    </div>
  );
};

export default RankingModal;
