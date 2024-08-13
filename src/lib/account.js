import { ethers, Contract } from "ethers";
import { NETWORKS, getEvmPrivateKey } from "@mybucks/lib/conf";
import IERC20 from "./erc20.json";

class EvmAccount {
  static network = "ethereum";
  chainId = null;

  signer = null;
  account = null;
  provider = null;

  // wei unit
  gasPrice = 0;

  constructor(hashKey, chainId) {
    this.chainId = chainId;
    this.provider = new ethers.JsonRpcProvider(NETWORKS[chainId].provider);

    this.signer = getEvmPrivateKey(hashKey);
    this.account = new ethers.Wallet(this.signer, this.provider);
  }

  get address() {
    return this.account && this.account.address;
  }

  async getGasPrice() {
    const { gasPrice } = await this.provider.getFeeData();
    this.gasPrice = gasPrice;
  }
/*
  async nativeCurrency() {
    const balance = await this.provider.getBalance(this.address);
    return ethers.formatEther(balance);
  }

  async balanceOfErc20(token) {
    const erc20 = new Contract(token, IERC20.abi, this.provider);
    const result = await erc20.balanceOf(this.account.address);
    return result;
  }

  async transferErc20(token, to, amount, gasPrice = null, gasLimit = null) {
    const erc20 = new Contract(token, IERC20.abi, this.provider);
    const tx = await erc20.connect(this.account).transfer(to, amount);
    await tx.wait();
  }
*/
  async populateTransferErc20(token, to, amount) {
    const erc20 = new Contract(token, IERC20.abi, this.provider);
    const result = await erc20
      .connect(this.account)
      .transfer.populateTransaction(to, amount);
    return result;
  }

  async estimateGas({ to, data, value = 0, from = this.account.address }) {
    return await this.provider.estimateGas({
      to,
      data,
      value,
      from,
    });
  }

  async execute({ to, data, value = 0, gasPrice = null, gasLimit = null }) {
    const tx = await this.account.sendTransaction({
      to,
      value,
      data,
      gasPrice,
      gasLimit,
    });
    return await tx.wait();
  }
}

export default EvmAccount;
