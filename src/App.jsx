import { useContext } from "react";
import { StoreContext } from "./contexts/Store";
import SignIn from "@mybucks/pages/Signin";
import Home from "@mybucks/pages/Home";
import Token from "./pages/Token";

function App() {
  const { connectivity, hash, account, selectedTokenAddress } =
    useContext(StoreContext);

  return (
    <div>
      {!connectivity && (
        <div className="border border-rounded">
          Please check your internet connection!
        </div>
      )}
      {!hash || !account ? <SignIn /> : selectedTokenAddress ? <Token /> : <Home />}
    </div>
  );
}

export default App;
