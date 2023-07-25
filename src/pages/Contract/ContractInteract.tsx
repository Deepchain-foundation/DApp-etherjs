import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import { ethers } from 'ethers';
import { useEffect } from 'react';

import useMetamask from '@/components/hook/useMetamask';

declare let window: any;
// ERC20合约地址
// const addressWETH = '0x25100e2adC08B2956C8f5AecE6F0928f65f315E0';
const abiWETH = [
  'function balanceOf(address) public view returns(uint)',
  'function deposit() public payable',
  'function transfer(address, uint) public returns (bool)',
  'function withdraw(uint) public',
];

type TransferType = {
  contractAddress: string;
  address: string;
  count: number;
};

// 合约交互转账
const ContractInteract = () => {
  // 连接metamask hook
  const { connectToMetamask } = useMetamask();
  const [form] = Form.useForm();
  const transfer = async ({ contractAddress, address, count }: TransferType) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // 声明可写合约
      const contractWETH = new ethers.Contract(contractAddress, abiWETH, signer);
      // 查询余额
      // const balanceWETH = await contractWETH.balanceOf(
      //   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      // );
      // console.log(`存款前MTK持仓: ${ethers.utils.formatEther(balanceWETH)}\n`);
      message.loading({
        content: '待确认',
        key: 'sendLoading-transfer',
        duration: 0,
      });

      // 构建交易
      const tx2 = await contractWETH.transfer(
        address,
        ethers.utils.parseEther(count.toString()),
      );

      message.loading({
        content: '已确认，等待交易中',
        key: 'sendLoading-transfer',
        duration: 0,
      });

      // 等待交易完成
      await tx2.wait();

      message.destroy('sendLoading-transfer');
      message.success('交易成功');
    } catch (e: any) {
      if (e.code === 'ACTION_REJECTED') {
        message.error('已拒绝');
        message.destroy('sendLoading-transfer');
      } else {
        message.error('失败');
        message.destroy('sendLoading-transfer');
        console.log('交易错误', e.message);
      }
    }

    // const balanceWETH_deposit = await contractWETH.balanceOf(
    //   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    // );
    // console.log(`存款后WETH持仓: ${ethers.utils.formatEther(balanceWETH_deposit)}\n`);
  };

  const send = () => {
    const data = form.getFieldsValue(true);
    transfer(data);
  };

  useEffect(() => {
    connectToMetamask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card className="read-div-center">
        <Form
          name="sendConent"
          form={form}
          labelCol={{ span: 5 }}
          style={{ width: '100%' }}
          initialValues={{ remember: true }}
          onFinish={send}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="合约地址"
            name="contractAddress"
            rules={[{ required: true, message: 'Please input your contract address' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="发送目的地址"
            name="address"
            rules={[{ required: true, message: 'Please input your send address' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="交易数量"
            name="count"
            rules={[{ required: true, message: 'Please input your count!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Row>
            <Col offset={8} span={4}>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button htmlType="submit">发送</Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div>ERC-20合约地址：0x25100e2adC08B2956C8f5AecE6F0928f65f315E0</div>
      </Card>
    </>
  );
};

export default ContractInteract;
