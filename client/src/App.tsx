import { Route, Switch, Router } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Currency from "./pages/Currency";
import Books from "./pages/Books";
import "./styles.css";
import { useHashLocation } from "wouter/use-hash-location";

function Routes() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/music"} component={Music} />
      <Route path={"/currency"} component={Currency} />
      <Route path={"/books"} component={Books} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
          <Router hook={useHashLocation}>
              <Routes />
          </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
