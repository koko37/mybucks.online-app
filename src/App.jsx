import { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useIdleTimer } from "react-idle-timer";
import { toast } from "react-toastify";
import { IDLE_DURATION } from "./lib/conf";
import { StoreContext } from "./contexts/Store";
import styled from "styled-components";

import Landing from "@mybucks/pages/Landing";
import SignIn from "@mybucks/pages/Signin";
import Home from "@mybucks/pages/Home";
import Token from "./pages/Token";

import "react-toastify/dist/ReactToastify.css";

const AppWrapper = styled.div`
  position: relative;
`;

function App() {
  const { connectivity, hash, account, selectedTokenAddress, reset } =
    useContext(StoreContext);
  const [app, setApp] = useState(false);

  const onIdle = () => {
    if (hash && account) {
      reset();
      toast("Account locked after 15 minutes idle!");
    }
  };

  useIdleTimer({ onIdle, timeout: IDLE_DURATION, throttle: 500 });

  if (!app) {
    return <Landing open={() => setApp(true)} />;
  }

  return (
    <AppWrapper>
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
    </AppWrapper>
  );
}

export default App;
