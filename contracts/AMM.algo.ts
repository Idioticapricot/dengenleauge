// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function decimals() external view returns (uint8);
}

interface IWAVAX is IERC20 {
    function deposit() external payable;   // wraps native AVAX -> WAVAX
    function withdraw(uint wad) external;  // unwraps WAVAX -> AVAX
}

contract WamAmm {
    IERC20 public immutable WAM;
    IWAVAX public immutable WAVAX;

    uint public reserveWAM;    // WAM in pool
    uint public reserveWAVAX;  // WAVAX in pool

    uint public totalShares;   // LP total supply
    mapping(address => uint) public shares; // LP balances

    error InsufficientLiquidity();
    error InvalidAmounts();

    constructor(address _wam, address _wavax) {
        WAM = IERC20(_wam);
        WAVAX = IWAVAX(_wavax);
    }

    // ----------- internal helpers -----------
    function _update(uint newWAM, uint newWAVAX) private {
        reserveWAM = newWAM;
        reserveWAVAX = newWAVAX;
    }

    function _mintShares(address to, uint s) private {
        totalShares += s;
        shares[to] += s;
    }

    function _burnShares(address from, uint s) private {
        shares[from] -= s;
        totalShares -= s;
    }

    // ----------- views -----------
    function getK() public view returns (uint) { return reserveWAM * reserveWAVAX; }

    function getPriceWAMperAVAX() external view returns (uint num, uint den) {
        // returns price as fraction: WAM per AVAX ~ reserveWAM / reserveWAVAX
        num = reserveWAM; den = reserveWAVAX;
    }

    // ----------- add liquidity -----------
    // Add with ERC20s you already hold (WAM + WAVAX)
    function addLiquidity(uint amountWAM, uint amountWAVAX) external returns (uint mintedShares) {
        if (amountWAM == 0 || amountWAVAX == 0) revert InvalidAmounts();

        // pull tokens
        require(WAM.transferFrom(msg.sender, address(this), amountWAM), "WAM tf");
        require(WAVAX.transferFrom(msg.sender, address(this), amountWAVAX), "WAVAX tf");

        if (totalShares == 0) {
            // arbitrary seed; 1:1 with geometric mean is common, but simple sum works for demo
            mintedShares = sqrt(amountWAM * amountWAVAX);
        } else {
            // must keep ratio
            uint share1 = (amountWAM * totalShares) / reserveWAM;
            uint share2 = (amountWAVAX * totalShares) / reserveWAVAX;
            require(share1 > 0 && share1 == share2, "bad ratio");
            mintedShares = share1;
        }

        _mintShares(msg.sender, mintedShares);
        _update(reserveWAM + amountWAM, reserveWAVAX + amountWAVAX);
    }

    // Add using native AVAX (contract wraps to WAVAX)
    function addLiquidityWithAVAX(uint amountWAM) external payable returns (uint mintedShares) {
        if (amountWAM == 0 || msg.value == 0) revert InvalidAmounts();

        // wrap AVAX -> WAVAX
        WAVAX.deposit{value: msg.value}();

        require(WAM.transferFrom(msg.sender, address(this), amountWAM), "WAM tf");

        if (totalShares == 0) {
            mintedShares = sqrt(amountWAM * msg.value);
        } else {
            uint share1 = (amountWAM * totalShares) / reserveWAM;
            uint share2 = (msg.value * totalShares) / reserveWAVAX;
            require(share1 > 0 && share1 == share2, "bad ratio");
            mintedShares = share1;
        }

        _mintShares(msg.sender, mintedShares);
        _update(reserveWAM + amountWAM, reserveWAVAX + msg.value);
    }

    // ----------- remove liquidity -----------
    function removeLiquidity(uint share) external returns (uint amtWAM, uint amtWAVAX) {
        if (share == 0 || share > shares[msg.sender]) revert InvalidAmounts();
        if (totalShares == 0) revert InsufficientLiquidity();

        amtWAM = (reserveWAM * share) / totalShares;
        amtWAVAX = (reserveWAVAX * share) / totalShares;

        _burnShares(msg.sender, share);
        _update(reserveWAM - amtWAM, reserveWAVAX - amtWAVAX);

        require(WAM.transfer(msg.sender, amtWAM), "WAM t");
        require(WAVAX.transfer(msg.sender, amtWAVAX), "WAVAX t");
    }

    // ----------- swaps -----------
    // exact WAVAX in -> WAM out
    function swapExactAVAXForWAM(uint minOut) external payable returns (uint outWAM) {
        if (msg.value == 0) revert InvalidAmounts();
        if (reserveWAVAX == 0 || reserveWAM == 0) revert InsufficientLiquidity();

        // wrap
        WAVAX.deposit{value: msg.value}();

        // x*y=k with no fee (add your fee if you want)
        uint newWAVAX = reserveWAVAX + msg.value;
        uint newWAM = getK() / newWAVAX;
        outWAM = reserveWAM - newWAM;
        require(outWAM >= minOut && outWAM > 0, "slippage");

        // adjust reserves
        _update(newWAM, newWAVAX);

        // send WAM to trader
        require(WAM.transfer(msg.sender, outWAM), "WAM t");
    }

    // exact WAM in -> AVAX out (unwrap before sending)
    function swapExactWAMForAVAX(uint amountIn, uint minOutAVAX) external returns (uint outAVAX) {
        if (amountIn == 0) revert InvalidAmounts();
        if (reserveWAVAX == 0 || reserveWAM == 0) revert InsufficientLiquidity();

        require(WAM.transferFrom(msg.sender, address(this), amountIn), "WAM tf");

        uint newWAM = reserveWAM + amountIn;
        uint newWAVAX = getK() / newWAM;
        uint outWAVAX = reserveWAVAX - newWAVAX;
        require(outWAVAX > 0, "no out");

        // update reserves
        _update(newWAM, newWAVAX);

        // unwrap to AVAX and send
        WAVAX.withdraw(outWAVAX);
        (bool ok, ) = msg.sender.call{value: outWAVAX}("");
        require(ok, "AVAX send");

        require(outWAVAX >= minOutAVAX, "slippage");
        outAVAX = outWAVAX;
    }

    // util
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    receive() external payable {}
}
