import { AppProps } from "next/app";
import "../styles/globals.css";
import { IntlProvider } from "react-intl";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Spanish from "../content/locales/es.json";
import English from "../content/locales/en.json";
import NavBar from "@/components/navBar";
import { ThemeProvider } from "@emotion/react";
import { MuiTheme } from "@/utils/theme";
import { CssBaseline } from "@mui/material";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  const { locale } = useRouter();
  const [shortLocale] = locale ? locale.split("-") : ["en"];

  const messages = useMemo(() => {
    switch (shortLocale) {
      case "es":
        return Spanish;
      case "en":
        return English;
    }
  }, [shortLocale]);

  return (
    <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
      <ThemeProvider theme={MuiTheme}>
        <CssBaseline />

        <NavBar></NavBar>
        <Component {...pageProps} />
      </ThemeProvider>
    </IntlProvider>
  );
};
export default App;
