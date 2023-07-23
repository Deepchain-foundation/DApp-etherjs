import { Card, Col, Input, Row, Select } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const textStyle = {
  fontSize: 16,
  fontWeight: 'bold',
};

declare let window: any;
const addressERC20 = '0x25100e2adC08B2956C8f5AecE6F0928f65f315E0';
const tokenDecimals = 18;

const Home = () => {
  // ETH 余额
  const [balance, setBalance] = useState<string | undefined>();
  // ecr20余额
  const [ecbalance, setEcbalance] = useState<string | undefined>();
  // 保存所有的地址
  const [allAccount, setAllAccount] = useState<string[] | undefined>();
  // 地址
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  // id
  const [chainId, setChainId] = useState<number | undefined>();
  // 名称
  const [chainname, setChainName] = useState<string | undefined>();

  // 记录交易地址
  const [toAddress, setToAddress] = useState<string | undefined>();

  // 查询ERC-20余额
  async function getremain(provider: any) {
    const tokenContract = new ethers.Contract(
      addressERC20,
      ['function balanceOf(address) view returns (uint256)'],
      provider,
    );
    const addressToCheck = currentAccount;
    const balance = await tokenContract.balanceOf(addressToCheck);
    const formattedBalance = ethers.utils.formatUnits(balance, tokenDecimals);
    return formattedBalance;
  }

  useEffect(() => {
    // get ETH balance and network info only when having currentAccount
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return;

    // client side code
    if (!window.ethereum) {
      console.log('please install MetaMask');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .getBalance(currentAccount)
      .then((result) => {
        setBalance(ethers.utils.formatEther(result));
      })
      .catch((e) => console.log(e));

    provider
      .getNetwork()
      .then((result) => {
        setChainId(result.chainId);
        setChainName(result.name);
      })
      .catch((e) => console.log(e));

    getremain(provider)
      .then((res) => {
        console.log('res', res);
        setEcbalance(res);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  const onClickConnect = () => {
    if (!window.ethereum) {
      console.log('please install MetaMask');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .send('eth_requestAccounts', [])
      .then((accounts) => {
        if (accounts.length > 0) {
          setAllAccount(accounts);
          setCurrentAccount(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    onClickConnect();
  }, []);

  // const onClickDisconnect = () => {
  //   console.log('onClickDisConnect');
  //   setBalance(undefined);
  //   setAllAccount(undefined);
  //   setCurrentAccount(undefined);
  // };
  return (
    <>
      <Card style={{ width: 500, height: '100%' }}>
        <h2 style={{ textAlign: 'left' }}>转账设置</h2>
        <Row align="middle" gutter={[16, 16]}>
          <Col span={5}>
            <span style={textStyle}>选择账户：</span>
          </Col>
          <Col span={19}>
            <Select
              id="demo-simple-select"
              value={currentAccount}
              onChange={(e) => {
                setCurrentAccount(e);
              }}
              style={{ width: '100%' }}
            >
              {allAccount &&
                allAccount.map((item) => {
                  return (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
            </Select>
          </Col>
          <Col span={5}>
            <span style={textStyle}>发送到：</span>
          </Col>
          <Col span={19}>
            <Input
              type="text"
              value={toAddress}
              onChange={(e) => {
                setToAddress(e.target.value);
              }}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        {currentAccount ? (
          <div style={{}}>
            <h3>账户信息</h3>
            <div>ETH Balance: {balance}</div>
            <div>MKT Balance: {ecbalance}</div>
            <div>Chain Info: ChainId {chainId}</div>
          </div>
        ) : (
          <></>
        )}
      </Card>
    </>
  );
};

export default Home;
