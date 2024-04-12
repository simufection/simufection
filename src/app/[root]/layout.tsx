import { FC, ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const GuestLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default GuestLayout;
