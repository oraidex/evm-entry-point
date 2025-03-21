export const STYLES_THEME_ID = "theme-styles-swap-widget";

export enum ColorScheme {
  AGENTS_LAND = "agentsland",
  ORAI_DEX = "oraidex",
  CUSTOM = "custom",
}

export const ORAI_DEX_SCHEME = {
  light: {
    neutralContent: "#181a17",
    baseContent: "#686a66",
    background: "#fff",
    foreground: "#f2f4f0",
    boxSelect: "#dfe0de",
    borderBox: "#c7c8c6",
    borderContainer: "#efefef",
    highlight: "#2f5711",
    highlightBackground: "#eef9e5",
    backgroundWarning: "#ffedeb",
    warningText: "#ad9c00",

    swapBtn: "#aee67f",
    primaryBtnBg: "#aee67f",
    primaryBtnText: "#232521",
    thirdBtnBg: "#efefef",
    secondaryNeutralText: "#232521",
  },
  dark: {
    neutralContent: "#f7f7f7",
    baseContent: "#979995",
    background: "#1b1d19",
    foreground: "#232521",
    boxSelect: "#494949",
    borderBox: "#595b57",
    borderContainer: "#232521",
    highlight: "#d7f5bf",
    highlightBackground: "#292f23",
    backgroundWarning: "#383200",
    warningText: "#e6cf00",

    swapBtn: "#aee67f",
    primaryBtnBg: "#aee67f",
    primaryBtnText: "#292f23",
    thirdBtnBg: "#31332e",
    secondaryNeutralText: "#f7f7f7",
  },
};

export const AGENTS_LAND_SCHEME = {
  light: {
    neutralContent: "#E8E9EE",
    baseContent: "#9192A0",
    background: "#13141D",
    foreground: "#1A1C28",
    boxSelect: "#13141D",
    borderBox: "#30344A",
    borderContainer: "#1A1C28",
    highlight: "#E4775D",
    highlightBackground: "#292f23",
    backgroundWarning: "#383200",
    warningText: "#e6cf00",

    swapBtn: "#FCFCFC",
    primaryBtnBg: "#aee67f",
    primaryBtnText: "#080A14",
    thirdBtnBg: "#31332e",
    secondaryNeutralText: "#f7f7f7",
  },
  dark: {
    neutralContent: "#E8E9EE",
    baseContent: "#9192A0",
    background: "#13141D",
    foreground: "#1A1C28",
    boxSelect: "#13141D",
    borderBox: "#30344A",
    borderContainer: "#1A1C28",
    highlight: "#E4775D",
    highlightBackground: "#292f23",
    backgroundWarning: "#383200",
    warningText: "#e6cf00",

    swapBtn: "#FCFCFC",
    primaryBtnBg: "#aee67f",
    primaryBtnText: "#080A14",
    thirdBtnBg: "#31332e",
    secondaryNeutralText: "#f7f7f7",
  },
};

export const DEFAULT_CONFIG = {
  // initFromToken: "usdt",
  // initToToken: "orai",
  theme: "dark" as const,
  colorScheme: ColorScheme.ORAI_DEX,
  customStyles: {
    colors: ORAI_DEX_SCHEME,
    size: {
      borderWrapperRadius: "12px",
      boxRadius: "8px",
      boxSelectRadius: "99px",
      buttonRadius: "99px",
      maxWidgetWidth: "500px",
    },
    font: "IBM Plex Sans",
  },
  showAccountInfo: true,
};
