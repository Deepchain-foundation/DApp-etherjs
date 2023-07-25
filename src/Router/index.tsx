import './index.css';

import { Spin } from 'antd';
import { Suspense, useCallback } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, useRoutes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import BatchTransfer from '@/pages/Contract/BatchTransfer';
import ContractInteract from '@/pages/Contract/ContractInteract';
import ReadContract from '@/pages/Contract/ReadContract';
import Home from '@/pages/Home';
import HomePage from '@/pages/HomePage';
import SendEth from '@/pages/SendEth/SendEth';
import { userType } from '@/store';

import type { routerConfigType } from './routerConfigType';

const routeConfig: routerConfigType[] = [
  {
    path: '/*',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <HomePage />
      </Suspense>
    ),
    auth: [1, 9, 8, 7, 'user1'],
    children: [
      {
        path: '',
        auth: [1, 9, 8, 7, 'user1'],
        element: <Navigate to="contractDAIRead" replace></Navigate>,
      },
      {
        path: 'home',
        auth: [1, 9, 8, 7, 'user1'],
        element: <Home></Home>,
      },
      {
        path: 'contractDAIRead',
        auth: [1, 9, 8, 7, 'user1'],
        element: <ReadContract></ReadContract>,
      },
      {
        path: 'sendETH',
        auth: [1, 9, 8, 7, 'user1'],
        element: <SendEth></SendEth>,
      },
      {
        path: 'contractInteract',
        auth: [1, 9, 8, 7, 'user1'],
        element: <ContractInteract></ContractInteract>,
      },
      {
        path: 'TransferAll',
        auth: [1, 9, 8, 7, 'user1'],
        element: <BatchTransfer></BatchTransfer>,
      },
    ],
  },
];

function MyRoutes() {
  const currentUserType = useRecoilValue(userType);
  /**
   * @description: 路由配置列表数据转换
   * @param {routeConfig} routeConfig 路由配置
   */
  const transformRoutes = useCallback(
    (routeList: typeof routeConfig) => {
      const list: RouteObject[] = [];
      routeList.forEach((route: routerConfigType) => {
        if (route.path === undefined) {
          return null;
        }
        if (
          route.path !== '404' &&
          route.auth !== undefined &&
          route.auth.find((item) => item === currentUserType) === undefined
        ) {
          route.element = <Navigate replace to="404"></Navigate>;
        }
        if (route.children) {
          route.children = transformRoutes(route.children);
        }

        list.push(route);
      });
      return list;
    },
    [currentUserType],
  );

  const getRoutes = useRoutes(transformRoutes(routeConfig));
  return <>{getRoutes}</>;
}
export default MyRoutes;
