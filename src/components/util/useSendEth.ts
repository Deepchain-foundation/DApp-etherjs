import { message } from 'antd';
import { ethers } from 'ethers';
import { useState } from 'react';


declare let window: any;
const useSendEth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [hash, setHash] = useState<string>();

    const sendEth = async (toAddress: string, amount: number) => {
        setLoading(true);
        setError('');
        setHash('');

        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();
            // 构建交易
            const transaction = {
                to: toAddress,
                value: ethers.utils.parseEther(amount.toString()),
            };

            // 发送交易
            const txResponse = await signer.sendTransaction(transaction);
            setHash(txResponse.hash);

            await txResponse.wait();
            message.success('成功');
            setLoading(false);
        } catch (err: any) {
            if (err.code === 'ACTION_REJECTED') {
                message.error('已拒绝');
            } else {
                setError('交易错误');
                console.log("交易错误", err.message);
            }
            setLoading(false);
        }
    };

    return {
        sendEth,
        loading,
        error,
        hash,
    };
};

export default useSendEth;
