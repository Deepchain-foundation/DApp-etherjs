import { message } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';


declare let window: any;
const useMetamask = () => {
    const [success, setIssuccess] = useState(false);
    const [provider, setProvider] = useState<any>();
    const [accountAddress, setAccountAddress] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    message.config({
        top: 50,
        duration: 2,
        maxCount: 3,
        rtl: true,
    });

    // 监听 MetaMask 连接状态的变化
    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = (accounts: any) => {
                setIssuccess(accounts.length > 0);
                setAccountAddress(accounts);
                if (accounts.length > 0) {

                    message.info('当前账户数量' + accounts.length);
                    message.info('当前使用账号' + accounts[0]);
                } else {
                    message.info('无账号连接');
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 进行连接  首次连接或者已授权情况下直接连接成功
    const connectToMetamask = async () => {
        setIsLoading(true);
        setError('');

        // 请求连接
        if (window.ethereum) {
            try {
                // 请求用户授权连接 MetaMask
                const accounts = await
                    window.ethereum.request({ method: 'eth_requestAccounts' });
                // 创建以太坊 Provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);

                // 设置用户账户地址
                setAccountAddress(accounts);

                message.success('已连接');
                // 标记连接状态为已连接
                setIssuccess(true);
                setIsLoading(false);
            } catch (error: any) {
                if (error.code === 4001) {
                    if (accountAddress.length > 0) {
                        setError('新的授权已被拒绝');
                        message.error('新的授权已被拒绝');
                    } else {
                        setError('授权已被拒绝');
                        message.error('授权已被拒绝');
                    }
                } else {
                    setError('连接到 MetaMask 时出错：');

                }
                setIsLoading(false);
                throw error;
            }
        }
        else {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    async function request() {
        setIsLoading(true);
        try {

            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }],
            });
            message.success('已重新连接');
            setIssuccess(true);
            setIsLoading(false);
        }
        catch (err: any) {
            if (err?.code === 4001) {
                if (accountAddress.length > 0) {
                    setError('新的授权已被拒绝');
                    message.error('新的授权已被拒绝');
                } else {
                    message.error('授权已被拒绝');
                    setError('授权已被拒绝');
                }
            }
            setIssuccess(false);
            setIsLoading(false);
        }
    }

    return {
        connectToMetamask,
        data: {
            accountAddress,
            provider,
        },
        success,
        isLoading,
        error,
        request
    };
};

export default useMetamask;





