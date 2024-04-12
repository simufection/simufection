import { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RankingButton } from "@/app/_components/gameButtons";
import { PlayingState } from "@/app/_states/state";
import { GameStateContext } from "@/app/contextProvoder";
import titleImage from "@/assets/img/simufection-title.png";
import { Button } from "@/components/button";
import { appVersion } from "@/consts/appVersion";
import useWindowSize from "@/hooks/useWindowSize";

const TitleView = () => {
  const { gameState, updateGameStateForce } = useContext(GameStateContext)!;
  const [w, h] = useWindowSize();
  const [imgw, imgh] = [titleImage.height, titleImage.width];
  const imgAspect = imgh / imgw;

  const [wi, he] = w * imgAspect <= h ? [w, w * imgAspect] : [h / imgAspect, h];

  return (
    <>
      <Image
        className="p-title__img"
        src={titleImage}
        alt="title"
        style={{ width: wi, height: he }}
        priority
      />
      <span className="p-title__version">{appVersion}</span>
      {gameState ? (
        <>
          <Button
            className="p-title__start u-tr"
            onClick={() =>
              updateGameStateForce({
                playingState: PlayingState.selecting,
              })
            }
          />
          <span className="p-title__start-text">画面をクリック</span>
          <RankingButton
            className="p-title__ranking-button"
            playingState={gameState.playingState}
          />
        </>
      ) : null}
    </>
  );
};
export default TitleView;
