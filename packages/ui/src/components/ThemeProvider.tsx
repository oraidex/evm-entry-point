import {
  useGetTheme,
  usePersistActions,
} from "@/stores/persist-config/selector";
import { CustomStyles } from "@/types/swap";
import React, { useEffect } from "react";
import {
  AGENTS_LAND_SCHEME,
  ColorScheme,
  DEFAULT_CONFIG,
  ORAI_DEX_SCHEME,
  STYLES_THEME_ID,
} from "../constants/config";
import { Theme } from "@/stores/persist-config/usePersistStore";

type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: Theme;
  colorScheme?: ColorScheme;
  customStyles: Partial<CustomStyles>;
};

const initializeVariables = (
  vars: Partial<CustomStyles>,
  theme: Theme = Theme.DARK,
  colorScheme: ColorScheme = ColorScheme.ORAI_DEX
) => {
  const {
    colors,
    size = {},
    font = DEFAULT_CONFIG.customStyles.font,
  } = vars || {};

  let customColors = colors || {};
  if (colorScheme === ColorScheme.CUSTOM) {
    customColors = colors || {};
  } else if (colorScheme === ColorScheme.AGENTS_LAND) {
    customColors = AGENTS_LAND_SCHEME;
  } else if (colorScheme === ColorScheme.ORAI_DEX) {
    customColors = ORAI_DEX_SCHEME;
  }

  const { light = {}, dark = {} } = customColors || { light: {}, dark: {} };

  const headTag = document.head;
  let styleTag = document.getElementById(STYLES_THEME_ID);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = STYLES_THEME_ID;
    headTag.appendChild(styleTag);
  }

  const createCSSVariables = (theme, suffix = "") =>
    Object.entries(theme)
      .map(([key, value]) => `--${key}${suffix}: ${value};`) // must to have ';'
      .join("");

  const lightTheme = createCSSVariables(light);
  const darkTheme = createCSSVariables(dark); // "Dark"
  const sizeTheme = createCSSVariables(size);

  if (theme === Theme.LIGHT) {
    styleTag.innerHTML = `
      :root {
        ${lightTheme}
        ${sizeTheme}
        --font-family: ${font || DEFAULT_CONFIG.customStyles.font}
      }
    `;
  } else if (theme === Theme.DARK) {
    styleTag.innerHTML = `
      :root {
        ${darkTheme}
        ${sizeTheme}
        --font-family: ${font || DEFAULT_CONFIG.customStyles.font}
      }
    `;
  }
};

export const ThemeProvider = ({
  children,
  theme = Theme.DARK,
  colorScheme = ColorScheme.ORAI_DEX,
  customStyles = DEFAULT_CONFIG.customStyles,
}: ThemeProviderProps) => {
  const currentTheme = useGetTheme();
  const { handleSetTheme } = usePersistActions();

  useEffect(() => {
    // Update theme when config changes
    handleSetTheme(theme);
  }, [theme, handleSetTheme]);

  useEffect(() => {
    initializeVariables(customStyles, theme, colorScheme);
  }, [customStyles, colorScheme, theme]);

  return <div className={`app ${currentTheme}`}>{children}</div>;
};
