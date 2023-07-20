// 获取当前用户accessToken
export const loginUser = () => {
  // return sessionStorage.getItem('accessToken') || '';
  return window.localStorage.getItem('accessToken') || '';
};

// 获取刷新token
export const getRefreshToken = () => {
  // return sessionStorage.getItem('refreshToken') || '';
  return window.localStorage.getItem('refreshToken') || '';
};

// 用户登录，保存window.localStorage
export const onLogin = (user: any) => {
  // console.log('user', user);
  // sessionStorage.setItem('accessToken', user?.token || '');
  // sessionStorage.setItem('refreshToken', user?.refresh_token || '');
  window.localStorage.setItem('accessToken', user?.accessToken || '');
  window.localStorage.setItem('refreshToken', user?.refreshToken);
};

// 保存新的token
export const saveToken = (user: any) => {
  // sessionStorage.setItem('accessToken', user?.access_token || '');
  // sessionStorage.setItem('refreshToken', user?.refresh_token || '');
  window.localStorage.setItem('accessToken', user?.accessToken || '');
  window.localStorage.setItem('refreshToken', user?.refreshToken || '');
};

// 存储用户的类型
export const saveUserType = (user: any) => {
  window.localStorage.setItem('userType', user || '');
};

// 获取当前用户的类型
export const getUserType = () => {
  return window.localStorage.getItem('userType') || '';
};

// 获取用户的名称
export const getUserName = () => {
  return window.localStorage.getItem('userName') || '';
};

// 获取当前用户的id
export const getUserId = () => {
  return window.localStorage.getItem('userId') || '';
};

// 存储用户的id
export const saveUserId = (user: number) => {
  window.localStorage.setItem('userId', user?.toString());
};

// 存储用户的名称
export const saveUserName = (user: any) => {
  window.localStorage.setItem('userName', user || '');
};
// 存储用户的身份号码
export const saveUserIdCard = (user: any) => {
  window.localStorage.setItem('userCard', user || '');
};

// 获取当前用户身份号码
export const getUserIdCard = () => {
  return window.localStorage.getItem('userCard') || '';
};

// 用户登出，删除window.localStorage 删除用户的类型
export const logout = () => {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  window.localStorage.removeItem('userType');
  window.localStorage.removeItem('userName');
  const url = window.location;
  const newUrl = url.origin + '/login';
  window.location.href = newUrl;
};

// 存储搜索数据
export const saveSearchData = (data: any) => {
  let a = JSON.stringify(data);
  window.localStorage.setItem('searchData', a || '');
};
