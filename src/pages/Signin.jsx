import React, { useContext, useState, useMemo } from "react";
import { Buffer } from "buffer";
import { scrypt } from "scrypt-js";
import { HASH_OPTIONS } from "@mybucks/lib/conf";
import { StoreContext } from "@mybucks/contexts/Store";

const SignIn = () => {
  // [TODO] Remove default password, salt
  const [password, setPassword] = useState("ranDommPassword***$%");
  const [salt, setSalt] = useState("90901210");
  const [disabled, setDisabled] = useState(false);
  const [progress, setProgress] = useState(0);

  const hasError = useMemo(() => !password || !salt, [password, salt]);

  const { setup } = useContext(StoreContext);

  async function onSubmit() {
    setDisabled(true);
    try {
      const passwordBuffer = Buffer.from(password);
      const saltBuffer = Buffer.from(salt);
      const hashBuffer = await scrypt(
        passwordBuffer,
        saltBuffer,
        HASH_OPTIONS.N,
        HASH_OPTIONS.r,
        HASH_OPTIONS.p,
        HASH_OPTIONS.keyLen,
        (p) => setProgress(Math.floor(p * 100))
      );
      const hashHex = Buffer.from(hashBuffer).toString("hex");
      setup(password, salt, hashHex);
    } catch (e) {
      console.error("Error while setting up account ...");
    } finally {
      setDisabled(false);
    }
  }

  return (
    <div>
      <div>
        <h1>mybucks.online</h1>
        <p>No seed, non custodial, password only wallet</p>
      </div>
      <div>
        <label htmlFor="password1">Password 1</label>
        <input
          id="password1"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password 1"
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="password2">Password 2</label>
        <input
          id="password2"
          type="password"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
          placeholder="Password 2"
          disabled={disabled}
        />
      </div>

      <div>
        <button onClick={onSubmit} disabled={disabled || hasError}>
          Open
        </button>
      </div>
      {!!progress && <div>progress: {progress}%</div>}
    </div>
  );
};

export default SignIn;
