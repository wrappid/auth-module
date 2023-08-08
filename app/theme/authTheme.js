import { getConfigurationObject } from "@wrappid/styles";

const appThemeConfig = getConfigurationObject()?.theme || {};

export const AUTH_THEME = {
  palette: {
    action: {
      active  : "rgba(255, 255, 255, 0.54)",
      disabled: "rgba(255, 255, 255, 0.26)",
      focus   : "rgba(255, 255, 255, 0.12)",
      hover   : "rgba(255, 255, 255, 0.04)",
    },
    background: { default: appThemeConfig?.primaryMainColor },
    common    : {
      black: "#FFFFFF",
      white: "#FFFFFF",
    },
    error: {
      contrastText: "#0000",
      dark        : "#FFFFFF",
      light       : "#FFFFFF",
      main        : "#FFFFFF",
    },
    info: {
      contrastText: "rgba(255, 255, 255, 0.87)",
      dark        : "#FFFFFF",
      light       : "#FFFFFF",
      main        : "#FFFFFF",
    },
    primary: {
      contrastText: "#FB607F",
      dark        : "#FFFFFF",
      light       : "#FFFFFF",
      main        : "#FFFFFF",
    },
    secondary: {
      dark            : "#6D6C6C",
      light           : "#FAFAFA",
      main            : "#FFFFFF",
      transparentDark : "#6D6C6CAA",
      transparentLight: "#FAFAFAAA",
    },
    success: {
      contrastText: " rgba(255, 255, 255, 0.87)",
      dark        : "#FFFFFF",
      light       : "#FFFFFF",
      main        : "#FFFFFF",
    },
    text: {
      primary  : "#FFFFFF",
      secondary: "#FFFFFF"
    },
    type   : "light",
    warning: {
      contrastText: "rgba(255,255,255, 0.87)",
      dark        : "#FFFFFF",
      light       : "#FFFFFF",
      main        : "#FFFFFF",
    }
  },
  shape     : { borderRadius: 4 },
  typography: { button: { textTransform: "none" } },
};
