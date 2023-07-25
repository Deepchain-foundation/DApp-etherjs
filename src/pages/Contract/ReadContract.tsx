import './read.css';

import { Button, Card, Col, Input, Row, Select, Space, Spin } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import useMetamask from '@/components/hook/useMetamask';

declare let window: any;
const myaddresstest = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const addressERC20 = '0x25100e2adC08B2956C8f5AecE6F0928f65f315E0';
const abiERC20 = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint)',
];

type ECR20Info = {
  remain?: string;
  total?: string;
  name?: string;
  code?: string;
};
const ReadContract = () => {
  const {
    connectToMetamask,
    data: { accountAddress },
    isLoading,
    request,
    error,
  } = useMetamask();

  const [ERCinformation, setERCinformation] = useState<ECR20Info>();

  const [currentAddress, setCurrentAddress] = useState<undefined | string>(undefined);
  const [addressERC20, setAddressERC20] = useState<undefined | string>(undefined);
  const [readloading, setReadloading] = useState(false);

  const readMain = async () => {
    if (currentAddress && addressERC20) {
      setReadloading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contractDAI = new ethers.Contract(addressERC20 as string, abiERC20, provider);
      // 1. 读取WETH合约的链上信息（WETH abi）
      const nameWETH = await contractDAI.name();
      const symbolWETH = await contractDAI.symbol();
      const totalSupplyWETH = await contractDAI.totalSupply();
      const balance = await contractDAI.balanceOf(currentAddress);
      setReadloading(false);
      setERCinformation({
        name: nameWETH,
        code: symbolWETH,
        total: ethers.utils.formatEther(totalSupplyWETH),
        remain: ethers.utils.formatEther(balance),
      });
    }
  };

  // 首次加载自动连接
  useEffect(() => {
    connectToMetamask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accountAddress.length > 0) {
      setCurrentAddress(accountAddress[0]);
    } else {
      setCurrentAddress(undefined);
    }
  }, [accountAddress]);

  return (
    <Card className="read-div-center">
      <Space size={'large'}>
        <Button
          loading={!error && isLoading}
          onClick={() => {
            if (window.ethereum) {
              setCurrentAddress(undefined);
              setERCinformation({});
              request();
            }
          }}
          style={{ width: '200px' }}
        >
          重新授权/新建连接
        </Button>
      </Space>
      <Button type="primary" className="ReadMain" onClick={readMain}>
        查询
      </Button>
      <hr />
      <Row align={'middle'}>
        <Col span={7}>
          <h3>选择账户地址：</h3>
        </Col>
        <Col span={17}>
          <Select
            style={{ width: '100%' }}
            value={currentAddress}
            onChange={(e) => {
              setCurrentAddress(e);
            }}
          >
            {accountAddress.length > 0 &&
              accountAddress.map((item) => {
                return (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                );
              })}
          </Select>
        </Col>
        <Col span={7}>
          <h3>合约地址：</h3>
        </Col>
        <Col span={17}>
          <Input
            style={{ textAlign: 'center' }}
            value={addressERC20}
            onChange={(e) => {
              setAddressERC20(e.target.value);
            }}
          ></Input>
        </Col>
      </Row>
      <hr />
      <br />

      <Card type="inner" hoverable title="读取合约">
        <Spin spinning={readloading}>
          <Row align={'middle'} gutter={[0, 20]}>
            <Col span={12}>ERC20合约名称</Col>
            <Col span={12} style={{ fontWeight: 'bold' }}>
              {ERCinformation?.name}
            </Col>
            <Col span={12}>ERC币种</Col>
            <Col span={12} style={{ fontWeight: 'bold' }}>
              {ERCinformation?.code}
            </Col>
            <Col span={12}>发行总量</Col>
            <Col span={12} style={{ fontWeight: 'bold' }}>
              {ERCinformation?.total}&nbsp;
              {ERCinformation?.code}
            </Col>
            <Col span={12}>当前账号ERC代币余额</Col>
            <Col span={12} style={{ fontWeight: 'bold' }}>
              {ERCinformation?.remain}&nbsp;
              {ERCinformation?.code}
            </Col>
          </Row>
        </Spin>
      </Card>
      <br />
      <hr />
      <div>ERC-20合约地址：0x25100e2adC08B2956C8f5AecE6F0928f65f315E0</div>
    </Card>
  );
};

export default ReadContract;
