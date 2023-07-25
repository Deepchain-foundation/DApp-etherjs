import { Button, Card, Col, Form, Input, Row } from "antd";

const TransferAll = () => {
  const [form] = Form.useForm();
  return (
    <>
      <div className="transfer-card">
        <Form
          name="sendConent"
          form={form}
          labelCol={{ span: 5 }}
          style={{ width: "100%" }}
          initialValues={{ remember: true }}
          // onFinish={send}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="合约地址"
            name="contractAddress"
            rules={[
              { required: true, message: "Please input your contract address" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="发送目的地址"
            name="address"
            rules={[
              { required: true, message: "Please input your send address" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="交易数量"
            name="count"
            rules={[{ required: true, message: "Please input your count!" }]}
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
      </div>
    </>
  );
};

export default TransferAll;
