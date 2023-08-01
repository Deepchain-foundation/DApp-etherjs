import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Card, Col, Form, Input, message, Row, Select, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ethers } from 'ethers';
import { parse } from 'papaparse';
import { useEffect, useRef, useState } from 'react';

import useMetamask from '@/components/hook/useMetamask';
import batchTransfer from '@/components/util/BatchTransfer';
import ERC20Remain from '@/components/util/ERC20Remain';

const BatchTransfer = () => {
  // 表单管理
  const [form] = Form.useForm();

  // 余额
  const [remain, setRemain] = useState<string | undefined>();

  // 发送地址
  const recipients = useRef();

  // 发送数量
  const amounts = useRef();
  // 总数
  const totalAmounts = useRef<undefined | number>();

  // 连接hook
  const {
    connectToMetamask,
    data: { accountAddress },
    request,
    error,
    isLoading,
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

  // 发送前处理数据成两个数组 以及计算总数
  const parseSendContent = (text: any) => {
    // 借用工具 处理数据虽然这里已经不是csv 但我用它处理,了
    // ( 考虑用正则找, 分别放到两个数组中)
    const parsedData: any = parse(text, {
      header: false,
      skipEmptyLines: true,
    });

    // 直接处理数据存在ref中 都去空格  把ref当成了一个数据过渡变量
    recipients.current = parsedData.data?.map((item: any) => item[0]?.trim());
    let total = 0;
    amounts.current = parsedData.data?.map((item: any) => {
      total += parseFloat(item[1].trim());
      return ethers.utils.parseUnits(item[1].trim(), 18);
    }
    );
    totalAmounts.current = total;
  };

  // 查询余额函数  地址选择框改变函数
  const handleRemainSearch = (value: string | undefined) => {
    if (!value) {
      // eslint-disable-next-line no-param-reassign
      value = form.getFieldValue('useAddress');
    }
    // 合约地址 去空格
    const addressContract = form.getFieldValue('tokenAddress')?.trim();

    if (addressContract && value) {
      ERC20Remain(addressContract, value as string)
        .then((e) => {
          setRemain(e);
        })
        .catch(() => {
          console.log('获取余额出错');
        });
    }
  };

  const send = async () => {
    // 获取所有的表单值
    const data = form.getFieldsValue(true);

    // 去除空格
    data.tokenAddress = data.tokenAddress.trim();

    // 发送前处理 都是同步的不用处理
    parseSendContent(data.content);

    // 调用发送函数
    batchTransfer({
      ...data,
      recipients: recipients.current,
      amounts: amounts.current,
      totalAmounts: totalAmounts.current,
    }).then(() => {
      // 重新获取余额数据
      handleRemainSearch(undefined);
    });
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
          {/* 可以选择代币  这里先写死 后续补上代币选择功能*/}
          {/* <Button>代币:{}MTK</Button> */}
          <Button
            loading={!error && isLoading}
            onClick={() => {
              request();
            }}
          >
            连接钱包
          </Button>
          <Button>余额:{remain}MTK</Button>
        </div>
        <hr />
        <Form
          name="sendConent"
          form={form}
          labelCol={{ span: 6 }}
          style={{ width: '100%', marginTop: '10px' }}
          initialValues={{ remember: true }}
          onFinish={send}
          autoComplete="off"
        >
          <Form.Item
            label="选择账号"
            name="useAddress"
            rules={[{ required: true, message: 'Please select your send address' }]}
          >
            <Select style={{ width: '100%' }} onChange={handleRemainSearch}>
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

          <Form.Item
            label="Token合约地址"
            name="tokenAddress"
            rules={[{ required: true, message: 'Please input your token contract address' }]}
          >
            <Input
              onChange={() => {
                handleRemainSearch(undefined);
              }}
              style={{ textAlign: 'center' }}
            />
          </Form.Item>

          <Form.Item
            label="批量转账合约地址"
            name="batchAddress"
            rules={[{ required: true, message: 'Please input your batch contract address' }]}
          >
            <Input style={{ textAlign: 'center' }}
            />
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
            rules={[{ required: true, message: 'Please input your send content' }]}
          >
            <TextArea rows={8} />
          </Form.Item>

          {/* 操作 */}
          <Row className="form-button-row" justify={'space-between'}>
            <Col span={4}>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button htmlType="submit" style={{ width: 100 }}>
                  发送
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  style={{ width: 100 }}
                  onClick={() => {
                    form.resetFields();
                    setRemain(undefined);
                  }}
                >
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <Card className="show-answer">
        <h4>功能</h4>
        <hr />
        <div>
          整合后的代码，所有练习内容，连接钱包/重连，显示代币余额，批量转账，可以导入，导入后可以手动修改，处理了空格，过程状态显示，数据由表单统一管理，空值检测
        </div>
        <hr />
        <div>batchAddress 0x96281F20ECafe44f6C18cB51A7439B9Ac7200Ee4</div>
        <div>tokenAddress 0x25100e2adC08B2956C8f5AecE6F0928f65f315E0</div>
        <div>
          选择代币种类，正式网中是不是选择了代币，就能获取到合约地址，合约地址不用手动填写呢
        </div>
      </Card>
    </>
  );
};

export default BatchTransfer;
