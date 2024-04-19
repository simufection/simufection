import React from "react";
import { scoreToRank } from "@/app/_functions/_game/rank";

const ShareButtons = ({ score }: { score: number }) => {
  const rank = scoreToRank(score).name; // 仮の関数を呼び出し
  const shareMessage = encodeURIComponent(`東大五月祭でSimufectionを遊んだよ！

スコア：${score}
ランク：${rank}

みんなも遊んでみよう！
simufection.vercel.app`);

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareMessage}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsimufection.vercel.app&quote=${shareMessage}`;

  return (
    <div className="p-share">
      <a
        href={twitterShareUrl}
        className="p-share__button -twitter"
        target="_blank"
        rel="noopener noreferrer"
      >
        結果をXでシェア
      </a>
      {/* <a
        href={facebookShareUrl}
        className="p-share__button -facebook"
        target="_blank"
        rel="noopener noreferrer"
      >
        Facebookでシェア
      </a> */}
    </div>
  );
};

export default ShareButtons;
