import { Button, Card, Col, Input, Row, Select } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState, useTransition } from 'react';

import useTokenTransfer from './Tranform';

const textStyle = {
  fontSize: 16,
  fontWeight: 'bold',
};

declare let window: any;
// const addressERC20 = '0x25100e2adC08B2956C8f5AecE6F0928f65f315E0';
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

  // 记录转账合约地址
  const [addressERC20, setAddressERC20] = useState<string | undefined>();

  // 币数量
  const [transCount, setTransCount] = useState<number | undefined>();

  const [type, setType] = useState(0);

  // 交易hooks
  const { transferTokens, loading } = useTokenTransfer();

  // 查询ERC-20余额
  async function getremain(provider: any) {
    if (addressERC20) {
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

  useEffect(() => {
    if (!window.ethereum) {
      console.log('please install MetaMask');
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    getremain(provider)
      .then((res) => {
        console.log('res', res);
        setEcbalance(res);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, addressERC20]);

  const handleTransform = () => {
    if (addressERC20 && toAddress && transCount) {
      console.log('addressERC20', addressERC20, toAddress, transCount);
      transferTokens(addressERC20 as string, toAddress as string, transCount as number);
    }
  };

  // const onClickDisconnect = () => {
  //   console.log('onClickDisConnect');
  //   setBalance(undefined);
  //   setAllAccount(undefined);
  //   setCurrentAccount(undefined);
  // };
  return (
    <>
      <Card style={{ width: 600, height: '100%' }}>
        <Row justify={'space-between'} align={'middle'}>
          <Col span={7}>
            <h1>转账设置</h1>
          </Col>
          <Col span={17} style={{ textAlign: 'right' }}>
            类型：
            <Select
              value={type}
              onChange={(e) => {
                setType(e);
              }}
            >
              <Select.Option value={0}>批量转账</Select.Option>
              <Select.Option value={1}>单独转账</Select.Option>
            </Select>
          </Col>
        </Row>

        <Row align="middle" gutter={[16, 16]}>
          <Col span={6} style={{ justifyContent: 'end', display: 'flex' }}>
            <span style={textStyle}>批量转账合约：</span>
          </Col>
          <Col span={18}>
            <Input
              type="text"
              placeholder="输入批量转账合约地址"
              value={addressERC20}
              onChange={(e) => {
                setAddressERC20(e.target.value);
              }}
              style={{ width: '100%', textAlign: 'center' }}
            />
          </Col>
          <Col span={6} style={{ justifyContent: 'end', display: 'flex' }}>
            <span style={textStyle}>选择账户：</span>
          </Col>
          <Col span={18}>
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

          <Col span={6} style={{ justifyContent: 'end', display: 'flex' }}>
            <span style={textStyle}>发送到：</span>
          </Col>
          <Col span={18}>
            <Input
              type="text"
              value={toAddress}
              onChange={(e) => {
                setToAddress(e.target.value);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6} style={{ justifyContent: 'end', display: 'flex' }}>
            <span style={textStyle}>交易数量：</span>
          </Col>
          <Col span={18}>
            <Input
              type="number"
              value={transCount}
              onChange={(e) => {
                console.log('e.target.value', e.target.value);
                const data = parseInt(e.target.value);
                console.log('data', data);
                if (e.target.value === '') {
                  setTransCount(undefined);
                } else if (data > 0) {
                  console.log('sdsfkljs');
                  setTransCount(data);
                } else {
                  return;
                }
              }}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Button loading={loading} onClick={handleTransform}>
          {loading ? '发送中' : '确定'}
        </Button>
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
