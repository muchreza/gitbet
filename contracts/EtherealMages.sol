// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title EtherealMages
 * @notice 10,000 unique 8x8 pixel mage NFTs on Ethereum
 *         - First 8,888 are FREE to mint (only gas)
 *         - Remaining 1,112 cost 0.0001 ETH each
 *         - Max 10 per transaction
 */
contract EtherealMages is ERC721, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant FREE_SUPPLY = 8888;
    uint256 public constant PAID_PRICE = 0.0001 ether;
    uint256 public constant MAX_PER_TX = 10;

    uint256 public totalMinted;
    string private _baseTokenURI;
    bool public mintActive;

    constructor(string memory baseURI) ERC721("Ethereal Mages", "EMAGE") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    modifier whenMintActive() {
        require(mintActive, "Minting is not active");
        _;
    }

    function mint(uint256 quantity) external payable whenMintActive {
        require(quantity > 0 && quantity <= MAX_PER_TX, "Invalid quantity");
        require(totalMinted + quantity <= MAX_SUPPLY, "Exceeds max supply");

        uint256 cost = 0;
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalMinted + i;
            if (tokenId >= FREE_SUPPLY) {
                cost += PAID_PRICE;
            }
        }

        require(msg.value >= cost, "Insufficient ETH");

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, totalMinted);
            totalMinted++;
        }

        // Refund excess ETH
        if (msg.value > cost) {
            (bool ok, ) = msg.sender.call{value: msg.value - cost}("");
            require(ok, "Refund failed");
        }
    }

    function setMintActive(bool active) external onlyOwner {
        mintActive = active;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    function withdraw() external onlyOwner {
        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }

    function isFreePhase() public view returns (bool) {
        return totalMinted < FREE_SUPPLY;
    }

    function mintPrice() public view returns (uint256) {
        if (totalMinted < FREE_SUPPLY) return 0;
        return PAID_PRICE;
    }

    function remainingFree() public view returns (uint256) {
        if (totalMinted >= FREE_SUPPLY) return 0;
        return FREE_SUPPLY - totalMinted;
    }
}
