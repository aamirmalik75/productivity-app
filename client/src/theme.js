import { createTheme } from "@mui/material";
import { createContext, useEffect, useMemo, useState } from "react";

const getStoredThemePreferences = () => {
  const storedMode = localStorage.getItem("themeMode") || "dark";
  const storedVariantColor = localStorage.getItem("variantColor") || "blue";
  return { storedMode, storedVariantColor };
}

export const tokens = (mode, variantColor) => {
  const commonColors = {
    grey: {
      light: {
        100: "#e0e0e0",
        200: "#c2c2c2",
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414",
      },
      dark: {
        100: "#141414",
        200: "#292929",
        300: "#3d3d3d",
        400: "#525252",
        500: "#666666",
        600: "#858585",
        700: "#a3a3a3",
        800: "#c2c2c2",
        900: "#e0e0e0",
      },
    },
    redAccent: {
      light: {
        100: "#f8dcdb",
        200: "#f1b9b7",
        300: "#e99592",
        400: "#e2726e",
        500: "#db4f4a",
        600: "#af3f3b",
        700: "#832f2c",
        800: "#58201e",
        900: "#2c100f",
      },
      dark: {
        100: "#2c100f",
        200: "#58201e",
        300: "#832f2c",
        400: "#af3f3b",
        500: "#db4f4a",
        600: "#e2726e",
        700: "#e99592",
        800: "#f1b9b7",
        900: "#f8dcdb",
      },
    },
  };

  const themeColors = {
    violet: {
      light: {
        primary: {
          100: "#f3e5f5",
          200: "#e1bee7",
          300: "#ce93d8",
          400: "#ba68c8",
          500: "#ab47bc",
          600: "#9c27b0",
          700: "#7b1fa2",
          800: "#6a1b9a",
          900: "#4a148c",
        },
      },
      dark: {
        primary: {
          100: "#4a148c",
          200: "#6a1b9a",
          300: "#7b1fa2",
          400: "#9c27b0",
          500: "#ab47bc",
          600: "#ba68c8",
          700: "#ce93d8",
          800: "#e1bee7",
          900: "#f3e5f5",
        },
      },
    },
    blue: {
      light: {
        primary: {
          100: "#e0f1fb",
          200: "#c2e3f7",
          300: "#a3d4f3",
          400: "#85c6ef",
          500: "#66b8eb",
          600: "#5293bc",
          700: "#3d6e8d",
          800: "#294a5e",
          900: "#14252f",
        },
      },
      dark: {
        primary: {
          100: "#14252f",
          200: "#294a5e",
          300: "#3d6e8d",
          400: "#5293bc",
          500: "#66b8eb",
          600: "#85c6ef",
          700: "#a3d4f3",
          800: "#c2e3f7",
          900: "#e0f1fb",
        },
      }
    },
    pink: {
      light: {
        primary: {
          100: "#f4dde7",
          200: "#e9bbce",
          300: "#dd98b6",
          400: "#d2769d",
          500: "#c75485",
          600: "#9f436a",
          700: "#773250",
          800: "#502235",
          900: "#28111b"
        },
      },
      dark: {
        primary: {
          100: "#28111b",
          200: "#502235",
          300: "#773250",
          400: "#9f436a",
          500: "#c75485",
          600: "#d2769d",
          700: "#dd98b6",
          800: "#e9bbce",
          900: "#f4dde7",
        },
      }
    },
    purple: {
      light: {
        primary: {
          100: "#ebe9fd",
          200: "#d6d3fb",
          300: "#c2bef8",
          400: "#ada8f6",
          500: "#9992f4",
          600: "#7a75c3",
          700: "#5c5892",
          800: "#3d3a62",
          900: "#1f1d31",
        },
      },
      dark: {
        primary: {
          100: "#1f1d31",
          200: "#3d3a62",
          300: "#5c5892",
          400: "#7a75c3",
          500: "#9992f4",
          600: "#ada8f6",
          700: "#c2bef8",
          800: "#d6d3fb",
          900: "#ebe9fd",
        },
      }
    },
    orange: {
      light: {
        primary: {
          100: "#f2dfd2",
          200: "#e4bfa4",
          300: "#d79f77",
          400: "#c97f49",
          500: "#bc5f1c",
          600: "#964c16",
          700: "#713911",
          800: "#4b260b",
          900: "#261306",
        },
      },
      dark: {
        primary: {
          100: "#261306",
          200: "#4b260b",
          300: "#713911",
          400: "#964c16",
          500: "#bc5f1c",
          600: "#c97f49",
          700: "#d79f77",
          800: "#e4bfa4",
          900: "#f2dfd2",
        },
      }
    },
    teal: {
      light: {
        primary: {
          100: "#d0e7e8",
          200: "#a1cfd0",
          300: "#72b7b9",
          400: "#439fa1",
          500: "#14878a",
          600: "#106c6e",
          700: "#0c5153",
          800: "#083637",
          900: "#041b1c",
        },
      },
      dark: {
        primary: {
          100: "#041b1c",
          200: "#083637",
          300: "#0c5153",
          400: "#106c6e",
          500: "#14878a",
          600: "#439fa1",
          700: "#72b7b9",
          800: "#a1cfd0",
          900: "#d0e7e8",
        },
      }
    }
  };

  const textColors = {
    light: {
      text: "#2a2e34",
    },
    dark: {
      text: "#f0f1f3",
    }
  };

  return {
    grey: commonColors.grey[mode],
    redAccent: commonColors.redAccent[mode],
    primary: themeColors[variantColor][mode].primary,
    text: textColors[mode].text,
    darkTopColor: '#191c1f',
    sideColor: mode === 'dark' ? '#22252a' : '#fcfcfc',
    themeColors: themeColors
  }
}

export const themeSettings = (mode, variantColor) => {
  const colors = tokens(mode, variantColor);

  return {
    palette: {
      mode: mode,
      variantColor: variantColor,
      ...(mode === 'dark'
        ? {
          primary: {
            main: colors.primary[500],
          },
          secondary: {
            main: colors.primary[500],
          },
          neutral: {
            light: colors.grey[100],
            main: colors.grey[500],
            dark: colors.grey[700],
          },
          background: {
            default: '#2a2e34',
          }
        }
        : {
          primary: {
            main: colors.primary[100],
          },
          secondary: {
            main: colors.primary[500],
          },
          neutral: {
            light: colors.grey[100],
            main: colors.grey[500],
            dark: colors.grey[700],
          },
          background: {
            default: '#fcfcfc',
          }
        }
      ),
    },
    typography: {
      fontFamily: ["Roboto", "sans-serif"].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ["Roboto", "sans-serif"].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Roboto", "sans-serif"].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Roboto", "sans-serif"].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Roboto", "sans-serif"].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Roboto", "sans-serif"].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Roboto", "sans-serif"].join(','),
        fontSize: 14,
      },
    },
  };
}

export const ColorModeContext = createContext({ toggleColorMode: () => { }, setVariantColor: (variant) => { } });

export const useMode = () => {

  const { storedMode, storedVariantColor } = getStoredThemePreferences();

  const [mode, setMode] = useState(storedMode);
  const [variantColor, setVariantColor] = useState(storedVariantColor);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('variantColor', variantColor);
  }, [mode, variantColor]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => prev === 'dark' ? 'light' : 'dark');
      },
      setVariantColor: (variant) => {
        setVariantColor(variant);
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode, variantColor)), [mode, variantColor]);

  return [theme, colorMode];
}

// black: {
//   100: "#d4d5d6",
//   200: "#aaabae",
//   300: "#7f8285",
//   400: "#55585d",
//   500: "#2a2e34",
//   600: "#22252a",
//   700: "#191c1f",
//   800: "#111215",
//   900: "#08090a"
// },
