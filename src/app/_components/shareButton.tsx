import React from "react";
import { scoreToRank } from "@/app/_functions/_game/rank";
import { prodShareText, testShareText } from "@/consts/shareText";

const ShareButtons = ({ score }: { score: number }) => {
  const rank = scoreToRank(score).name;
  const shareMessage = encodeURIComponent(prodShareText(score, rank));

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
