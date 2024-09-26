import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { useIdleTimer } from "react-idle-timer";
import { toast } from "react-toastify";
import { IDLE_DURATION } from "./lib/conf";
import { StoreContext } from "./contexts/Store";
import styled from "styled-components";

import SignIn from "@mybucks/pages/Signin";
import Home from "@mybucks/pages/evm/Home";
import Token from "./pages/evm/Token";
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

function Content() {
  const { account, hash, selectedTokenAddress, inMenu } =
    useContext(StoreContext);

  if (!hash || !account) {
    return <SignIn />;
  }
  if (inMenu) {
    return <Menu />;
  }
  if (selectedTokenAddress) {
    return <Token />;
  }
  return <Home />;
}

function App() {
  const { connectivity, hash, reset } = useContext(StoreContext);

  useIdleTimer({
    onIdle: () => {
      if (hash) {
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
      <Content />
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        theme="light"
      />
    </AppWrapper>
  );
}

export default App;
