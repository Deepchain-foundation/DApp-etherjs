import { ethers } from 'ethers';

declare let window: any;

const getethRemain = async (walletAddress: string) => {
    if (walletAddress) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const address = ethers.utils.getAddress(walletAddress);

            // 使用 `provider.getBalance` 方法查询以太币余额
            const balance = await provider.getBalance(address);

            // 将余额从 Wei 转换为以太币
            const etherBalance = ethers.utils.formatEther(balance);

            return etherBalance;
        } catch (error: any) {
            throw new Error('查询以太币余额时出错：' + error.message);
        }
    }
};

export default getethRemain;
