import { useContext } from "react";
import { StoreContext } from "./contexts/Store";
import SignIn from "@mybucks/pages/Signin";
import Home from "@mybucks/pages/Home";
import Token from "./pages/Token";

function App() {
  const { hash, account, selectedToken } = useContext(StoreContext);

  if (!hash || !account) {
    return <SignIn />;
  }
  if (selectedToken) {
    return <Token />;
  }
  return <Home />;
}

export default App;
