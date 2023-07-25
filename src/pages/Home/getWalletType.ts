declare let window: any;

export async function getAllTokens() {
  const tokens = await window.ethereum.request({
    method: 'wallet_getTokens'
  });
  console.log('tokens', tokens);
  return '123';

}
