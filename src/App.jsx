import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { useIdleTimer } from "react-idle-timer";
import { toast } from "react-toastify";
import { IDLE_DURATION } from "./lib/conf";
import { StoreContext } from "./contexts/Store";
import styled from "styled-components";

import SignIn from "@mybucks/pages/Signin";
import Home from "@mybucks/pages/Home";
import Token from "./pages/Token";
import Menu from "./pages/Menu";

import "react-toastify/dist/ReactToastify.css";

const AppWrapper = styled.div`
  position: relative;
`;

const ConnectionIssue = styled.div`
  text-align: center;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray200};
  color: ${({ theme }) => theme.colors.gray25};
  font-size: ${({ theme }) => theme.sizes.base};
  font-weight: ${({ theme }) => theme.weights.regular};
`;

function App() {
  const { connectivity, hash, account, selectedTokenAddress, inMenu, reset } =
    useContext(StoreContext);

  useIdleTimer({
    onIdle: () => {
      if (hash && account) {
        reset();
        toast("Account locked after 15 minutes idle!");
      }
    },
    timeout: IDLE_DURATION,
    throttle: 500,
  });

  return (
    <AppWrapper>
      {!connectivity && (
        <ConnectionIssue>
          Please check your internet connection!
        </ConnectionIssue>
      )}

      {!hash || !account ? (
        <SignIn />
      ) : selectedTokenAddress ? (
        <Token />
      ) : inMenu ? (
        <Menu />
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
