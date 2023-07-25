import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Col, Form, Input, message, Row, Select, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ethers } from 'ethers';
import { parse } from 'papaparse';
import { useEffect, useRef } from 'react';

import useMetamask from '@/components/hook/useMetamask';
import batchTransfer from '@/components/util/BatchTransfer';

declare let window: any;
const BatchTransfer = () => {
  // 表单管理
  const [form] = Form.useForm();

  // 发送地址
  const recipients = useRef();

  // 发送数量
  const amounts = useRef();

  // 连接hook
  const {
    connectToMetamask,
    data: { accountAddress },
  } = useMetamask();

  // 上传文件的回调函数
  const onFileUpload = (file: any) => {
    const reader = new FileReader();

    // 读取文件内容为文本
    reader.onload = () => {
      const csvText: any = reader.result;

      form.setFieldValue('content', csvText);
    };

    reader.readAsText(file);
  };

  // antd文件上传配置
  const props: UploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // 发送前处理数据成两个数组
  const parseSendContent = (text: any) => {
    // 解析数据
    const parsedData: any = parse(text, {
      header: false,
      skipEmptyLines: true,
    });

    // 直接处理数据存在ref中 如果不添加内容可以直接用
    recipients.current = parsedData.data?.map((item: any) => item[0]);
    amounts.current = parsedData.data?.map((item: any) =>
      ethers.utils.parseUnits(item[1], 18),
    );
  };

  const send = async () => {
    // 获取所有的表单值
    const data = form.getFieldsValue(true);

    // 发送前处理 都是同步的不用处理
    parseSendContent(data.content);

    // 调用发送函数
    batchTransfer({ ...data, recipients: recipients.current, amounts: amounts.current });
  };

  useEffect(() => {
    // 现在这个hooks写的差点  不手动触发不会返回地址
    connectToMetamask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <br />
      <div className="Title-header-div">
        快速地将代币转给大批账户(一笔交易转上百个账户),
        大大提高代币空投、奖励发放等操作的效率
      </div>
      <br />
      <div className="transfer-card">
        <div className="Title">
          {/* 可以选择代币 */}
          <Button>代币:{}</Button>
          <Button>余额:{}</Button>
        </div>
        <hr />
        <Form
          name="sendConent"
          form={form}
          labelCol={{ span: 5 }}
          style={{ width: '100%', marginTop: '10px' }}
          initialValues={{ remember: true }}
          onFinish={send}
          autoComplete="off"
        >
          <Form.Item
            label="合约地址"
            name="contractAddress"
            rules={[{ required: true, message: 'Please input your contract address' }]}
          >
            <Input style={{ textAlign: 'center' }} />
          </Form.Item>
          <Form.Item
            label="选择账号"
            name="useAddress"
            rules={[{ required: true, message: 'Please select your send address' }]}
          >
            <Select style={{ width: '100%' }}>
              {accountAddress.length > 0 &&
                accountAddress.map((item) => {
                  return (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Row justify={'end'}>
            <Upload
              {...props}
              showUploadList={false}
              beforeUpload={(file) => {
                onFileUpload(file);
                return false; // 阻止默认上传行为
              }}
            >
              <Button icon={<UploadOutlined />}>上传</Button>
            </Upload>
          </Row>
          <hr />

          {/* 内容--- 地址和数量  数组 */}
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Please select your send content' }]}
          >
            <TextArea rows={8} />
          </Form.Item>

          {/* 操作 */}
          <Row className="form-button-row">
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
        <div>测试批量转账合约地址 0x68B1D87F95878fE05B998F19b66F4baba5De1aed</div>
      </div>
    </>
  );
};

export default BatchTransfer;
