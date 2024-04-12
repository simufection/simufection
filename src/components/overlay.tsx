interface Props {
  className?: string;
}

export const OverLay = (props: Props) => {
  return <div className={`c-overlay ${props.className || ""}`} />;
};
