import { useContext } from "react";
import { StoreContext } from "./contexts/Store";
import SignIn from "@mybucks/pages/Signin";
import Home from "@mybucks/pages/Home";

function App() {
  const { hash, account } = useContext(StoreContext);

  return !hash || !account ? <SignIn /> : <Home />;
}

export default App;
