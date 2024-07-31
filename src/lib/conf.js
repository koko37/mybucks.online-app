import { ethers } from "ethers";
const abi = new ethers.AbiCoder();

/**
 * [CRITICAL] DON'T CHANGE FOREVER!!!
 * Reference:
 *    https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt
 */
export const HASH_OPTIONS = {
  N: 32768, // CPU/memory cost parameter, 2^15
  r: 8, // block size parameter
  p: import.meta.env.DEV ? 1 : 5, // parallelization parameter
  keyLen: 64,
};

export const RAW_PASSWORD_MIN_LENGTH = 12;

export const splitPasswordAndSalt = (rawPassword) => [
  rawPassword
    .split("")
    .filter((v, id) => id % 2 === 0)
    .join(""),
  rawPassword
    .split("")
    .filter((v, id) => id % 2 === 1)
    .join(""),
];

export const joinPasswordAndSalt = (password, salt) =>
  password
    .split("")
    .map((p, i) => `${p}${salt[i] || ""}`)
    .join("");

export const getEvmPrivateKey = (h) =>
  ethers.keccak256(abi.encode(["string"], [h]));

// btc | evm | solana | tron
export const NETWORK_BTC = "btc";
export const NETWORK_EVM = "evm";
export const NETWORK_TRON = "tron";
export const NETWORK_SOLANA = "sol";

export const DEFAULT_NETWORK = NETWORK_EVM;
export const DEFAULT_CHAIN_ID = 1;
export const DEFAULT_ASSET = "ETH";

export const NETWORKS = {
  1: {
    chainId: 1,
    name: "ethereum",
    label: "Ethereum",
    provider: "https://mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_API_KEY,
    scanner: "https://etherscan.io",
  },
  56: {
    chainId: 56,
    name: "bsc",
    label: "BNB Chain",
    provider: "https://bsc-dataseed.binance.org/",
    scanner: "https://bscscan.com",
  },
  137: {
    chainId: 137,
    name: "polygon",
    label: "Polygon",
    provider: "https://polygon-mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_API_KEY,
    scanner: "https://polygonscan.com",
  },
  42161: {
    chainId: 42161,
    name: "arbitrum",
    label: "Arbitrum",
    provider: "https://arbitrum-mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_API_KEY,
    scanner: "https://arbiscan.io",
  },
  43114: {
    chainId: 43114,
    name: "avalanche",
    label: "Avalanche C-Chain",
    provider: "https://avalanche-mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_API_KEY,
    scanner: "https://snowtrace.io",
  },
  10: {
    chainId: 10,
    name: "optimism",
    label: "Optimism",
    provider: "https://optimism-mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_API_KEY,
    scanner: "https://optimistic.etherscan.io",
  },
  59144: {
    chainId: 59144,
    name: "linea",
    label: "Linea",
    provider: "https://linea-mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_API_KEY,
    scanner: "https://lineascan.build",
  },
  42220: {
    chainId: 42220,
    name: "celo",
    label: "Celo",
    provider: "https://celo-mainnet.infura.io/v3/" + import.meta.env.VITE_INFURA_API_KEY,
    scanner: "https://celoscan.io",
  },
};

// [TODO] Please do not forget dividing by 100n
export const gasMultiplier = (option) =>
  option === "high" ? 175n : option === "average" ? 150n : 100n;

// 15 minutes, after this period, wallet will be locked.
export const IDLE_DURATION = 900_000;
