import { ethers } from 'ethers';

declare let window: any;

const tokenDecimals = 18;

/**
 * 
 * @param addressERC20 币种合约地址
 * @param address 查询地址
 * @returns 余额
 */
async function ERC20Remain(addressERC20: string, address: string) {
    if (addressERC20 && address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // 查询ERC-20余额
        const tokenContract = new ethers.Contract(
            addressERC20,
            ['function balanceOf(address) view returns (uint256)'],
            provider,
        );
        const balance = await tokenContract.balanceOf(address);
        const formattedBalance = ethers.utils.formatUnits(balance, tokenDecimals);
        return formattedBalance;
    }
}

export default ERC20Remain;
