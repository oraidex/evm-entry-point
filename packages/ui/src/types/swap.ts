export type Color = {
  neutralContent: string;
  baseContent: string;
  backgroundColor: string;
  foregroundColor: string;
  boxSelectColor: string;
  borderBoxColor: string;
  borderContainerColor: string;
  highlight: string;
  highlightBackgroundColor: string;
  backgroundWarning: string;
  warningText: string;

  swapBtnColor: string;
  primaryBtnBgColor: string;
  primaryBtnTextColor: string;
  thirdBtnBgColor: string;
  secondaryNeutralText: string;
};

export type Size = {
  borderWrapperRadius: string;
  boxRadius: string;
  boxSelectRadius: string;
  buttonRadius: string;
  maxWidgetWidth: string;
};

export type CustomStyles = {
  colors: {
    light?: Partial<Color>;
    dark?: Partial<Color>;
  };
  size: Partial<Size>;
  font: string;
};
