/* eslint-disable max-len */
import { message } from 'antd';
import { ethers } from 'ethers';

import { MyContract__factory } from '@/abi';

type TransType = {
  tokenAddress: string;
  batchAddress: string;
  contractAddress: string;
  useAddress: string;
  recipients: [string];
  amounts: [string];
  totalAmounts: number;
};

declare let window: any;

/**
 * 
 * @param tokenAddress  代币合约地址
 * @param batchAddress  批量转账地址
 * @param useAddress     使用的地址
 * @param recipients     交易地址数组
 * @param amounts    交易数量数组 转换后的大整数string数组
 * @param totalAmounts 总数 可读小数 number|string
 */
// 执行批量转账的函数
async function batchTransfer({
  tokenAddress,
  batchAddress,
  useAddress,
  recipients,
  amounts,
  totalAmounts
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

  // 代币合约地址
  // const tokenAddress = '0x25100e2adC08B2956C8f5AecE6F0928f65f315E0';
  // // 批量转账地址
  // const batchAddress = '0x96281F20ECafe44f6C18cB51A7439B9Ac7200Ee4';

  // 获取ERC20合约实例
  // const contract = new ethers.Contract(contractAddress, tokenAbi, signer);
  const tokenContract = MyContract__factory.connect(tokenAddress, signer);
  const BatchContract = MyContract__factory.connect(batchAddress, signer);


  // approve授权
  async function approveBatchTransfer() {
    // 转换大整数
    const amountToApprove = ethers.utils.parseUnits(totalAmounts.toString(), 18);
    console.log('amountToApprove', totalAmounts.toString());
    try {
      message.loading({
        content: '请授权',
        key: '123',
        duration: 0,
      });
      // 授权批量转账地址 和转账数量
      const approveTx = await tokenContract.approve(batchAddress, amountToApprove);
      message.loading({
        content: '已授权，等待中',
        key: '123',
        duration: 0,
      });
      await approveTx.wait();
      message.destroy('123');


      // 查询授权的额度
      const approvecount = await tokenContract.allowance(useAddress, batchAddress);

      if (parseFloat(ethers.utils.formatUnits(approvecount)) < totalAmounts) {
        message.error('授权额度不足');
        return new Error('授权额度不足');
      } else {
        message.success('授权成功');
      }
      console.log('Approval successful!');
    } catch (error) {
      message.destroy('123');
      message.error('已拒绝授权');
      console.error('Approval failed:', error);
      throw error;
    }
  }

  async function performBatchTransfer() {
    try {
      // 调用 ERC20 合约中的批量转账方法

      message.loading({
        content: '请确认交易',
        key: 'keymessage',
        duration: 0,
      });

      const tx = await BatchContract.batchTransfer(recipients, amounts);

      message.loading({
        content: '已确认，等待交易中',
        key: 'keymessage',
        duration: 0,
      });

      await tx.wait();
      message.destroy('keymessage');
      message.success('成功');

    } catch (err: any) {
      if (err.code === 'ACTION_REJECTED') {
        message.error('已拒绝');
      } else {
        console.log('交易错误', err.message);
      }
      message.destroy('keymessage');
      console.error('Error during batch transfer:', err.message);
    }
  }


  approveBatchTransfer().then(() => {
    performBatchTransfer().then(() => {
      console.log('Batch transfer completed.');
    });
  });

}


export default batchTransfer; 