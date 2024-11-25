import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

import { ResponseDto } from 'common/dtos';
import { Web3LoginDTO } from './dto/web3-login.dto';
import BigNumber from 'bignumber.js';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

@Injectable()
export class AuthService {
  private RPC_URL: string;
  private uniceAddress: string;
  private privateKey: string;
  private UNICE_REQUIRED = 1000000000000000000000000;
  private BNB_REQUIRED = 1000000000000000;

  constructor(private configService: ConfigService) {
    this.RPC_URL = this.configService.get<string>('RPC_URL');
    this.uniceAddress = this.configService.get<string>('UNICE_ADDRESS');
    this.privateKey = this.configService.get<string>('PRIVATE_KEY');
  }

  async userLogIn(loginDTO: Web3LoginDTO): Promise<ResponseDto<any>> {
    try {
      const { addr, message, signature } = loginDTO;

      const signerAddress = ethers.verifyMessage(message, signature);

      const isAuthorize = signerAddress.toLowerCase() === addr.toLowerCase();

      if (!isAuthorize) {
        return ResponseDto.responseError(AuthService.name, 'Unauthorized');
      }

      const provider = new ethers.JsonRpcProvider(this.RPC_URL);

      const balance = await provider.getBalance(addr);
      const balanceInBnb = ethers.formatEther(balance);
      const tokenContract = new ethers.Contract(
        this.uniceAddress,
        ERC20_ABI,
        provider,
      );
      const balanceInUnice = await tokenContract.balanceOf(addr);

      if (
        BigNumber(balanceInUnice).gt(this.UNICE_REQUIRED) &&
        BigNumber(balanceInBnb).lt(this.BNB_REQUIRED)
      ) {
        const wallet = new ethers.Wallet(this.privateKey, provider);
        const balance = await provider.getBalance(wallet.address);
        const amountToSend = ethers.parseEther('0.001'); 

        if(BigNumber(balance.toString()).lt(BigNumber(amountToSend.toString()))) {
          return ResponseDto.responseError(AuthService.name, 'Insufficient balance');
        }

        const tx = {
          to: addr,
          value: amountToSend, 
          gasLimit: 21000, 
        };

        const transactionResponse = await wallet.sendTransaction(tx);

        await transactionResponse.wait();
      }
    } catch (error) {
      return ResponseDto.responseError(AuthService.name, error);
    }
  }
}
