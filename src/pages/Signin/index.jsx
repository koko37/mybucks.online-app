import React, { useContext, useState, useMemo } from "react";
import { Buffer } from "buffer";
import { scrypt } from "scrypt-js";
import { HASH_OPTIONS } from "@mybucks/lib/conf";
import { StoreContext } from "@mybucks/contexts/Store";
import Button from "@mybucks/components/Button";

const SignIn = () => {
  const [password, setPassword] = useState(
    import.meta.env.DEV ? "ranDommPassword***$%" : ""
  );
  const [salt, setSalt] = useState(import.meta.env.DEV ? "90901210" : "");
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
        <div className="flex center">
          <img src="/logo.png" alt="mybucks.online" width="64" height="64" />
        </div>
        <h2 className="text-center">Open your account</h2>
        <p className="text-center mb-h">
          Keep your password strong, and secure
        </p>
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
        <ul>
          <li className="disabled">Min length: 12</li>
          <li className="disabled">Uppercase (A~Z)</li>
          <li className="disabled">Lowercase (a~z)</li>
          <li className="disabled">Number (012~9)</li>
          <li className="disabled">Special characters(!@#..)</li>
          <li className="disabled">Don't forget!!!</li>
        </ul>
      </div>

      <div>
        <Button onClick={onSubmit} disabled={disabled || hasError} block>
          Open
        </Button>
      </div>
      {!!progress && <div>progress: {progress}%</div>}
    </div>
  );
};

export default SignIn;
