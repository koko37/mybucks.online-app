import { ethers, Contract } from "ethers";
import { CovalentClient } from "@covalenthq/client-sdk";
import camelcaseKeys from "camelcase-keys";
import { tokens as defaultTokensList } from "@sushiswap/default-token-list";

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

  queryClient = null;

  constructor(hashKey, chainId) {
    this.chainId = chainId;
    this.provider = new ethers.JsonRpcProvider(NETWORKS[chainId].provider);

    this.signer = getEvmPrivateKey(hashKey);
    this.account = new ethers.Wallet(this.signer, this.provider);

    this.queryClient = new CovalentClient(
      import.meta.env.VITE_COVALENT_API_KEY
    );
  }

  get address() {
    return this.account && this.account.address;
  }

  async getGasPrice() {
    const { gasPrice } = await this.provider.getFeeData();
    this.gasPrice = gasPrice;
  }

  async queryBalances() {
    try {
      const { data, error } =
        await this.queryClient.BalanceService.getTokenBalancesForWalletAddress(
          this.chainId,
          this.account.address
        );
      if (error) {
        throw new Error("invalid balances");
      }
      const tokens = camelcaseKeys(data.items, { deep: true });

      const nativeTokenName = tokens.find(
        (t) => !!t.nativeToken
      ).contractTickerSymbol;
      const nativeTokenBalance = ethers.formatUnits(
        tokens.find((t) => !!t.nativeToken).balance,
        18
      );
      const nativeTokenPrice = tokens.find((t) => !!t.nativeToken).quoteRate;
      const balances = tokens
        .filter(
          (token) => token.balance.toString() !== "0" || token.nativeToken
        )
        .map((token) => ({
          ...token,
          logoURI: defaultTokensList.find((t) =>
            token.nativeToken
              ? t.name === token.contractName
              : t.address.toLowerCase() === token.contractAddress.toLowerCase()
          )?.logoURI,
        }));

      /**
       * token attributes:
       *
       *    nativeToken
       *    contractName
       *    contractTickerSymbol
       *    contractAddress
       *    contractDecimals
       *    balance
       *    quote
       *    logoURI
       */

      return [nativeTokenName, nativeTokenBalance, nativeTokenPrice, balances];
    } catch (e) {
      return null;
    }
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
