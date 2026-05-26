// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CryptoBet {
    address public owner;
    uint256 public marketCount;
    uint256 public constant MIN_BET = 0.0001 ether;
    uint256 public constant PLATFORM_FEE_BPS = 200; // 2%

    struct Market {
        string question;
        string coinId;
        uint256 targetPrice;
        uint256 endTime;
        bool resolved;
        bool outcome;
        uint256 yesPool;
        uint256 noPool;
        bool exists;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesBets;
    mapping(uint256 => mapping(address => uint256)) public noBets;
    mapping(uint256 => mapping(address => bool)) public claimed;

    event MarketCreated(uint256 indexed marketId, string question, string coinId, uint256 targetPrice, uint256 endTime);
    event BetPlaced(uint256 indexed marketId, address indexed bettor, bool position, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event WinningsClaimed(uint256 indexed marketId, address indexed bettor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMarket(
        string calldata question,
        string calldata coinId,
        uint256 targetPrice,
        uint256 endTime
    ) external onlyOwner returns (uint256) {
        require(endTime > block.timestamp, "End time must be in future");

        uint256 marketId = marketCount;
        markets[marketId] = Market({
            question: question,
            coinId: coinId,
            targetPrice: targetPrice,
            endTime: endTime,
            resolved: false,
            outcome: false,
            yesPool: 0,
            noPool: 0,
            exists: true
        });

        marketCount++;
        emit MarketCreated(marketId, question, coinId, targetPrice, endTime);
        return marketId;
    }

    function placeBet(uint256 marketId, bool position) external payable {
        Market storage market = markets[marketId];
        require(market.exists, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.endTime, "Market has ended");
        require(msg.value >= MIN_BET, "Bet too small");

        if (position) {
            yesBets[marketId][msg.sender] += msg.value;
            market.yesPool += msg.value;
        } else {
            noBets[marketId][msg.sender] += msg.value;
            market.noPool += msg.value;
        }

        emit BetPlaced(marketId, msg.sender, position, msg.value);
    }

    function resolveMarket(uint256 marketId, bool outcome) external onlyOwner {
        Market storage market = markets[marketId];
        require(market.exists, "Market does not exist");
        require(!market.resolved, "Already resolved");

        market.resolved = true;
        market.outcome = outcome;
        emit MarketResolved(marketId, outcome);
    }

    function claimWinnings(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(market.exists, "Market does not exist");
        require(market.resolved, "Market not resolved");
        require(!claimed[marketId][msg.sender], "Already claimed");

        uint256 userBet;
        uint256 winningPool;
        uint256 losingPool;

        if (market.outcome) {
            userBet = yesBets[marketId][msg.sender];
            winningPool = market.yesPool;
            losingPool = market.noPool;
        } else {
            userBet = noBets[marketId][msg.sender];
            winningPool = market.noPool;
            losingPool = market.yesPool;
        }

        require(userBet > 0, "No winning bet");

        claimed[marketId][msg.sender] = true;

        uint256 totalPool = winningPool + losingPool;
        uint256 fee = (losingPool * PLATFORM_FEE_BPS) / 10000;
        uint256 distributable = totalPool - fee;
        uint256 payout = (distributable * userBet) / winningPool;

        (bool sent, ) = payable(msg.sender).call{value: payout}("");
        require(sent, "Transfer failed");

        emit WinningsClaimed(marketId, msg.sender, payout);
    }

    function withdrawFees() external onlyOwner {
        (bool sent, ) = payable(owner).call{value: address(this).balance}("");
        require(sent, "Transfer failed");
    }

    function getMarket(uint256 marketId) external view returns (
        string memory question,
        string memory coinId,
        uint256 targetPrice,
        uint256 endTime,
        bool resolved,
        bool outcome,
        uint256 yesPool,
        uint256 noPool
    ) {
        Market storage m = markets[marketId];
        require(m.exists, "Market does not exist");
        return (m.question, m.coinId, m.targetPrice, m.endTime, m.resolved, m.outcome, m.yesPool, m.noPool);
    }

    function getUserBets(uint256 marketId, address user) external view returns (uint256 yesBet, uint256 noBet) {
        return (yesBets[marketId][user], noBets[marketId][user]);
    }
}
