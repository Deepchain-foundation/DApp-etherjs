import { atom } from 'recoil';

export const MenuName = atom({
  key: 'MenuName',
  default: '读取合约',
});

export const userType = atom({
  key: 'userType',
  default: 1,
});
