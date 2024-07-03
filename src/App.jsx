import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { useIdleTimer } from "react-idle-timer";
import copy from "clipboard-copy";
import { toast } from "react-toastify";
import { StoreContext } from "./contexts/Store";
import SignIn from "@mybucks/pages/Signin";
import Home from "@mybucks/pages/Home";
import Token from "./pages/Token";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const { connectivity, hash, account, selectedTokenAddress, reset } =
    useContext(StoreContext);

  const onIdle = () => {
    if (hash && account) {
      reset();
      copy("");
      toast("Account locked after 15 minutes idle!")
    }
  };

  useIdleTimer({ onIdle, timeout: 900_000, throttle: 500 });

  return (
    <div>
      {!connectivity && (
        <div className="border border-rounded">
          Please check your internet connection!
        </div>
      )}
      {!hash || !account ? (
        <SignIn />
      ) : selectedTokenAddress ? (
        <Token />
      ) : (
        <Home />
      )}
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        theme="light"
      />
    </div>
  );
}

export default App;
