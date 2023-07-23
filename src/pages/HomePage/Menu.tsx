import './style.css';

import { WindowsOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { MenuName } from '@/store';

const Menu: React.FC = () => {
  const navigator = useNavigate();
  const [, setMenu] = useRecoilState(MenuName);

  const items: MenuProps['items'] = [
    {
      key: '1',
      type: 'group',
      label: '合约',
      children: [
        {
          key: '1-1',
          label: '读取合约',
          onClick: () => {
            setMenu('读取合约');
            navigator('/contractDAIRead');
          },
        },
        {
          key: '1-2',
          label: '合约交互',
          onClick: () => {
            setMenu('合约交互');
            navigator('/contractInteract');
          },
        },
      ],
    },
    {
      key: '2',
      type: 'group',
      label: '签名',
      children: [
        {
          key: '2-1',
          label: '发送ETH',
          onClick: () => {
            setMenu('发送ETH');
            navigator('/sendETH');
          },
        },
        {
          key: '2-2',
          label: '4th menu item',
        },
      ],
    },
    {
      key: '3',
      label: 'disabled sub menu',
      children: [
        {
          key: '3-1',
          label: '5d menu item',
        },
        {
          key: '3-2',
          label: '6th menu item',
        },
      ],
    },
  ];
  return (
    <Dropdown menu={{ items }} className="Drop">
      <Space>
        <div className="Menu">
          <WindowsOutlined style={{ fontSize: 25 }} />
        </div>
      </Space>
    </Dropdown>
  );
};

export default Menu;
