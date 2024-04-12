import Image from "next/image";
import { useContext } from "react";
import { GameSizeContext, GameStateContext } from "@/app/contextProvoder";
import titleImage from "@/assets/img/simufection-title.png";
import useWindowSize from "@/hooks/useWindowSize";
import { Button } from "@/components/button";
import { appVersion } from "@/consts/appVersion";
import { PlayingState } from "@/app/_states/state";
import startImage from "@/assets/img/start-icon.png";
import rankingImage from "@/assets/img/ranking-icon.png";
import { useRouter } from "next/navigation";
import { RankingButton } from "../_components/gameButtons";

const TitleView = () => {
  const { gameState, updateGameStateForce } = useContext(GameStateContext)!;
  const [w, h] = useWindowSize();
  const [imgw, imgh] = [titleImage.height, titleImage.width];
  const imgAspect = imgh / imgw;

  const [wi, he] = w * imgAspect <= h ? [w, w * imgAspect] : [h / imgAspect, h];
  const router = useRouter();

  return (
    <>
      <Image
        className="p-game__title-img"
        src={titleImage}
        alt="title"
        style={{ width: wi, height: he }}
        priority
      />
      <span className="p-game__version">{appVersion}</span>
      {gameState ? (
        <>
          <Button
            className="p-game__start u-tr"
            onClick={() =>
              updateGameStateForce({
                playingState: PlayingState.selecting,
              })
            }
          />
          <span className="p-game__start-text">画面をクリック</span>
          <RankingButton
            className="p-game__ranking-button"
            playingState={gameState.playingState}
          />
        </>
      ) : null}
    </>
  );
};
export default TitleView;
