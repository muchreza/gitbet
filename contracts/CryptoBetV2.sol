// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CryptoBetV2 {
    address public owner;
    uint256 public marketCount;

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

    event MarketCreated(uint256 indexed marketId, string question, string coinId, uint256 targetPrice, uint256 endTime);
    event BetPlaced(uint256 indexed marketId, address indexed bettor, bool position, uint256 tokenAmount);
    event MarketResolved(uint256 indexed marketId, bool outcome);

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

    function placeBet(uint256 marketId, bool position, uint256 tokenAmount) external {
        Market storage market = markets[marketId];
        require(market.exists, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.endTime, "Market has ended");
        require(tokenAmount > 0, "Amount must be > 0");

        if (position) {
            yesBets[marketId][msg.sender] += tokenAmount;
            market.yesPool += tokenAmount;
        } else {
            noBets[marketId][msg.sender] += tokenAmount;
            market.noPool += tokenAmount;
        }

        emit BetPlaced(marketId, msg.sender, position, tokenAmount);
    }

    function resolveMarket(uint256 marketId, bool outcome) external onlyOwner {
        Market storage market = markets[marketId];
        require(market.exists, "Market does not exist");
        require(!market.resolved, "Already resolved");

        market.resolved = true;
        market.outcome = outcome;
        emit MarketResolved(marketId, outcome);
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
