interface Props {
  addClass?: string;
}

export const OverLay = (props: Props) => {
  return <div className={`c-overlay ${props.addClass || ""}`} />;
};
