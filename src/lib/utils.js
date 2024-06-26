import { NETWORKS } from "./conf";

export const explorerLinkOfAddress = (chainId, addr) =>
  NETWORKS[chainId].scanner + "/address/" + addr;

export const explorerLinkOfContract = (chainId, addr) =>
  NETWORKS[chainId].scanner + "/address/" + addr + "#code";

export const explorerLinkOfTransaction = (chainId, tx) =>
  NETWORKS[chainId].scanner + "/tx/" + tx;

export const truncate = (str, len = 12) =>
  str.slice(0, (len >> 1) + 2) + "..." + str.slice((len >> 1) * -1);
