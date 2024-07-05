import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { ethers } from "ethers";
import s from "./index.module.css";
import { gasMultiplier } from "@mybucks/lib/conf";

const ConfirmTransaction = ({ to, value = 0, data, onSubmit, onReject }) => {
  const { account, fetchBalances, nativeTokenName, nativeTokenPrice } =
    useContext(StoreContext);
  const [gasOption, setGasOption] = useState("low");

  const [gasEstimation, setGasEstimation] = useState(0);
  const [gasEstimationValue, setGasEstimationValue] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const estimateGas = async () => {
      const gasAmount = await account.estimateGas({ to, data, value });
      const gas = Number(
        ethers.formatUnits(
          (account.gasPrice * gasMultiplier(gasOption) * gasAmount) / 100n,
          18
        )
      );

      const gasInUsd = gas * nativeTokenPrice;
      setGasEstimation(gas.toFixed(6));
      setGasEstimationValue(gasInUsd.toFixed(6));
    };

    estimateGas();
  }, [gasOption]);

  const confirm = async () => {
    setPending(true);
    const tx = await account.execute({
      to,
      value,
      data,
      gasPrice: (account.gasPrice * gasMultiplier(gasOption)) / 100n,
    });
    setPending(false);

    // update balances
    fetchBalances();
    onSubmit(tx);
  };

  return (
    <div className="app">
      <div>
        <button onClick={onReject} disabled={pending}>
          &lt; Back
        </button>
      </div>

      <h2>Confirm transaction</h2>

      <div>
        <p>To: {to}</p>
        {!!value && <p>Value: {ethers.formatEther(value)}</p>}
        <p className={s.txdata}>Data: {data}</p>
      </div>

      <div>
        <fieldset disabled={pending}>
          <legend>Select gas price:</legend>
          <div>
            <input
              type="radio"
              name="low"
              id="low"
              value="low"
              checked={gasOption === "low"}
              onChange={() => setGasOption("low")}
            />
            <label htmlFor="low">
              Low / {ethers.formatUnits(account.gasPrice, 9)} GWei
            </label>
          </div>

          <div>
            <input
              type="radio"
              name="average"
              id="average"
              value="average"
              checked={gasOption === "average"}
              onChange={() => setGasOption("average")}
            />
            <label htmlFor="average">Average (*1.5)</label>
          </div>

          <div>
            <input
              type="radio"
              name="high"
              id="high"
              value="high"
              checked={gasOption === "high"}
              onChange={() => setGasOption("high")}
            />
            <label htmlFor="high">High (*1.75)</label>
          </div>
        </fieldset>
      </div>

      <div>
        Estimated gas fee: {gasEstimation}&nbsp; {nativeTokenName} / $
        {gasEstimationValue}
      </div>

      <div className="mt-h">
        <button onClick={confirm} disabled={pending}>
          Confirm
        </button>
        <button onClick={onReject} disabled={pending}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default ConfirmTransaction;
