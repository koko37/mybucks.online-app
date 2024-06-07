import React, { useContext } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { NETWORK_EVM } from "@mybucks/lib/conf";
import EvmHome from "./EvmHome";

const Home = () => {
  const { network } = useContext(StoreContext);

  if (network === NETWORK_EVM) {
    return <EvmHome />;
  }

  return <div>Unsupported network</div>;
};

export default Home;
