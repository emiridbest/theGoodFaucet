// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract GoodFaucet {
    address public admin;
    uint256 public giveAmount;
    uint256 public timeout;
    IERC20 public token;
    struct TokenBalance {
        uint256 tokenBalance;
        uint256 depositTime;
    }

    mapping(address => TokenBalance) public balances;
    mapping(address => uint256) public lastRequestTime;

    event TokensRequested(address indexed recipient, uint256 amount);
    event Deposited(
        address indexed depositor,
        uint256 amount,
        address indexed token
    );

    constructor(address _tokenAddress) {
        admin = msg.sender;
        giveAmount = 1; // Initial airdrop amount
        timeout = 1 days; // Set the timeout to 1 day
        token = IERC20(_tokenAddress); // Initialize the ERC-20 token contract
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    receive() external payable {
        deposit(address(token), msg.value);
    }

    function deposit(address tokenAddress, uint256 amount) public {
        require(amount > 0, "Deposit amount must be greater than 0");
        require(tokenAddress == address(token), "Unsupported token");

        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed. Make sure to approve the contract to spend the tokens."
        );

        TokenBalance storage userBalance = balances[msg.sender];
        userBalance.tokenBalance += amount;
        userBalance.depositTime = block.timestamp;

        emit Deposited(msg.sender, amount, tokenAddress);
    }

    function changeAmount(uint256 amount) public onlyAdmin {
        giveAmount = amount;
    }

    function getAmount() public view returns (uint256) {
        return giveAmount;
    }

    function changeTimeout(uint256 newTimeout) public onlyAdmin {
        timeout = newTimeout;
    }

    function getTimeout() public view returns (uint256) {
        return timeout;
    }

    function requestTokens() public {
        require(
            block.timestamp - lastRequestTime[msg.sender] >= timeout,
            "You need to wait before requesting tokens again."
        );

        require(
            token.transfer(msg.sender, giveAmount),
            "Token transfer failed"
        );

        lastRequestTime[msg.sender] = block.timestamp;

        emit TokensRequested(msg.sender, giveAmount);
    }
}
