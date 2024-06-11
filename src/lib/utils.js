import { NETWORKS } from "./conf";

export const explorerLinkOfAddress = (chainId, addr) =>
  NETWORKS[chainId].scanner + "/address/" + addr;

export const explorerLinkOfContract = (chainId, addr) =>
  NETWORKS[chainId].scanner + "/address/" + addr + "#code";

export const truncateAddress = (address, len = 12) =>
  address.slice(0, (len >> 1) + 2) + "..." + address.slice((len >> 1) * -1);
