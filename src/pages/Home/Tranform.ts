import { ethers } from 'ethers';
import React, { useState } from 'react';

declare let window: any;
// 连接到以太坊网络
const provider = new ethers.providers.Web3Provider(window.ethereum);

// ERC-20 代币合约地址和合约 ABI
const tokenAddress = 'YOUR_ERC20_TOKEN_ADDRESS';
const tokenAbi = ['function transfer(address to, uint256 amount)'];

function useTokenTransfer() {
    const [loading, setLoading] = useState(false);

    async function transferTokens(tokenAddress: string, toAddress: string, amount: number) {
        setLoading(true);

        const wallet = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

        try {
            const transaction = await contract.transfer(toAddress, amount);
            await transaction.wait(); // 等待交易确认
            console.log(`转账成功：向地址 ${toAddress} 转账 ${amount} 个代币`);
        } catch (error) {
            console.error('转账失败：', error);
        } finally {
            setLoading(false);
        }
    }

    return { transferTokens, loading };
}
export default useTokenTransfer;
