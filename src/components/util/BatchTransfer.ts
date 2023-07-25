/* eslint-disable max-len */
import { ethers } from 'ethers';

import { tokenAbi } from '@/abi';

type TransType = {
  contractAddress: string;
  useAddress: string;
  recipients: [string];
  amounts: [string];
};

declare let window: any;

/**
 * 
 * @param contractAddress  批量转账合约地址
 * @param useAddress     使用的地址
 * @param recipients     交易地址数组
 * @param amounts    交易数量数组
 * 
 */
// 执行批量转账的函数
async function batchTransfer({
  contractAddress,
  useAddress,
  recipients,
  amounts,
}: TransType) {

  // 验证接收者地址和金额数组长度是否相等
  if (recipients.length !== amounts.length) {
    throw new Error('Recipients and amounts arrays must have the same length.');
  }

  // 检查是否安装了MetaMask，并获取用户授权
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install and authorize MetaMask extension.');
  }

  await window.ethereum.enable();

  // 创建 ethers.js 提供者
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // 获取当前钱包地址
  const signer = provider.getSigner(useAddress);

  // 获取ERC20合约实例
  const contract = new ethers.Contract(contractAddress, tokenAbi, signer);

  try {
    // 调用 ERC20 合约中的批量转账方法
    const tx = await contract.batchTransfer(recipients, amounts);

    await tx.wait();
  } catch (err: any) {
    console.error('Error during batch transfer:', err.message);
  }

}


export default batchTransfer; 