import { FC, ReactNode } from "react";
import { GameStateProvider } from "./contextProvoder";

type Props = {
  children?: ReactNode;
};

const GuestLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <GameStateProvider>{children}</GameStateProvider>
    </>
  );
};

export default GuestLayout;
