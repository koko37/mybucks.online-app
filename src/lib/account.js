import { ethers } from "ethers";
import { NETWORKS, getEvmPrivateKey } from "@mybucks/lib/conf";

class EvmAccount {
  static network = "ethereum";
  chainId = null;

  signer = null;
  account = null;
  provider = null;

  constructor(hashKey, chainId) {
    this.chainId = chainId;
    this.provider = new ethers.JsonRpcProvider(NETWORKS[chainId].provider);

    this.signer = getEvmPrivateKey(hashKey);
    this.account = new ethers.Wallet(this.signer, this.provider);
  }

  get address() {
    return this.account && this.account.address;
  }

  async nativeCurrency() {
    const balance = await this.provider.getBalance(this.address);
    return ethers.formatEther(balance);
  }

  async transferNativeCurrency(to, value, gasPrice = null, gasLimit = null) {
    const tx = this.signer.sendTransaction({
      to,
      value: ethers.formatEther(value),
      gasPrice,
      gasLimit,
    });
    return await tx.wait();
  }

  async execute(to, data, value, gasPrice = null, gasLimit = null) {
    const tx = this.signer.sendTransaction({
      to,
      value: ethers.formatEther(value),
      data,
      gasPrice,
      gasLimit,
    });
    return await tx.wait();
  }
}

export default EvmAccount;
