import React, { useContext, useState, useMemo } from "react";
import { Buffer } from "buffer";
import { scrypt } from "scrypt-js";
import { HASH_OPTIONS } from "@mybucks/lib/conf";
import { StoreContext } from "@mybucks/contexts/Store";

import s from "./index.module.css";

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
    <div className={s.content}>
      <div className={s.help}>
        <h1>mybucks.online</h1>
        <p>crypto wallet, safe and easy to use</p>
        <ul>
          <li>no seed, your password is your account</li>
          <li>no recover, no reset, no update password</li>
          <p>
            do not forget your password! There is no way to reset, recover your
            account
          </p>
          <li>no custodial, fully decentralized</li>
          <li>no censorship, no admin, no backend API</li>
          <li>no email, no setup, no install</li>
          <li>opensource</li>
          <li>mobile friendly, PWA enabled</li>
          <li>friendly interface, listing portfolios</li>
        </ul>

        <h2>Formula: how to generate your account?</h2>
        <p>
          We use&nbsp;
          <a
            href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt"
            target="_blank"
          >
            <strong>scrypt</strong>,
          </a>
          <a href="https://keccak.team/keccak.html" target="_blank">
            <strong>keccak256</strong>
          </a>
          &nbsp; hash functions to generate your private key and account.
        </p>
        <pre>
          key = scrypt(password1, password2, N, r, p, keyLen); <br />
          N: 2^15 <br />
          r: 8 <br />
          p: 5 <br />
          keyLen: 64 <br />
          <br />
          privateKey = keccak256(abi.encode(["string"], [key]))
        </pre>
        <p>
          You can find our codebase &nbsp;
          <a
            href="https://github.com/koko37/mybucks.online/blob/master/src/lib/conf.js"
            target="_blank"
          >
            here
          </a>
          .
        </p>
      </div>

      <div className={s.form}>
        <div>
          <h2>Open your account</h2>
          <p>Keep your password strong, and secure</p>
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
    </div>
  );
};

export default SignIn;
