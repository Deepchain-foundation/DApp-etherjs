import './sendEth.css';

import { Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';

import getethRemain from '@/components/util/getethRemain';
import useMetamask from '@/components/util/useMetamask';
import useSendEth from '@/components/util/useSendEth';

declare let window: any;
const SendEth = () => {
  const [remain, setRemain] = useState<string | undefined>();
  const { sendEth, loading: sendLoading, hash } = useSendEth();
  const [form] = Form.useForm();
  const {
    data: { accountAddress },
    connectToMetamask,
  } = useMetamask();

  const send = async (values: any) => {
    await sendEth(values.address, values.count);
    const data = await getethRemain(accountAddress[0]);
    setRemain(data);
  };

  useEffect(() => {
    connectToMetamask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当账号改变的时候重新查询eth余额
  useEffect(() => {
    getethRemain(accountAddress[0]).then((e) => {
      setRemain(e);
    });
    // 这里在内部进行了错误处理没有向上冒泡
  }, [accountAddress]);

  return (
    <Card className="read-div-center middle-card-sendETH">
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
      <Row style={{ width: '100%' }} gutter={[0, 20]}>
        <Col span={24}>
          <Spin spinning={sendLoading}>
            <Card hoverable type="inner" title="当前账号信息">
              <Row justify={'center'} gutter={[0, 20]}>
                <Col span={7}>地址</Col>
                <Col span={17}>{accountAddress[0]}</Col>
                <Col span={7}>ETH余额</Col>
                <Col span={17}>{remain}ETH</Col>
              </Row>
            </Card>
          </Spin>
        </Col>
        <Col span={24}>
          <Card hoverable type="inner" title="交易信息">
            <Row justify={'center'}>
              <Col span={7}>交易hash</Col>
              <Col span={17}>{hash}</Col>
              <Col span={7}>交易金额</Col>
              <Col span={17}>{}</Col>
            </Row>
          </Card>
        </Col>
        <hr />
        <Col span={24}>
          <div>测试地址：0xf97D095CBB8b81f151d80f298680E6cDBBD4DBa8</div>
        </Col>
      </Row>
    </Card>
  );
};

export default SendEth;
