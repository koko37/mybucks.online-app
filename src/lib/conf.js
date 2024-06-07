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
  p: 1, // parallelization parameter: [TODO] 5
  keyLen: 32,
};

export const getEvmPrivateKey = (h) =>
  ethers.keccak256(abi.encode(["string"], [h]));

// btc | evm | solana | tron
export const NETWORK_BTC = "btc"
export const NETWORK_EVM = "evm"
export const NETWORK_TRON = "tron"
export const NETWORK_SOLANA = "sol"

export const DEFAULT_NETWORK = NETWORK_EVM;
export const DEFAULT_CHAIN_ID = 1;

export const NETWORKS = {
  1: {
    chainId: 1,
    name: "ethereum",
    label: "Ethereum",
    provider:
      "https://mainnet.infura.io/v3/" +
      import.meta.env.VITE_RPC_MAINNNET_KEY,
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
    provider:
      "https://polygon-mainnet.g.alchemy.com/v2/" +
      import.meta.env.VITE_RPC_POLYGON_KEY,
    scanner: "https://polygonscan.com",
  },
};
