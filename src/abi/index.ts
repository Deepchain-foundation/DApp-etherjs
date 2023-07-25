export const tokenAbi = [
    'function balanceOf(address) public view returns(uint)',
    'function deposit() public payable',
    'function transfer(address, uint) public returns (bool)',
    'function withdraw(uint) public',
    'function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external'
];