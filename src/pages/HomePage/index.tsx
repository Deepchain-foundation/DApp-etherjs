import './style.css';

import { Button, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { MenuName } from '@/store';

import Menu from './Menu';

const HomePage = () => {
  const [menuName] = useRecoilState(MenuName);
  return (
    <>
      <Layout style={{ height: '100vh', width: '100%' }}>
        <Header className="Header">
          <Menu></Menu>
          <h1 className="Middle">{menuName}</h1>
        </Header>
        <Content
          style={{
            height: '100%',
            width: '100%',
            position: 'relative',
            overflow: 'auto',
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </>
  );
};

export default HomePage;
