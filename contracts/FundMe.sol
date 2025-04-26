// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

//1. 创建一个收款函数
//2. 记录投资人并且查看
//3. 锁定期內，达到目标值，生产商可以提款
//4. 锁定期內，没有达到目标值，投资人可以退款
contract FundMe {

    mapping (address => uint256) public funderToAmount;

    uint256 constant MINIMUM_VALUE = 100 * 10 ** 18; //wei 

    AggregatorV3Interface public dataFeed;    //合约内部调用

    uint256 constant TARGET = 1000 * 10 ** 18 ;  //常量

    address public owner; 

    /*
        当前合约部署的时间
    */
    uint256 deploymentTimestamp;

    //部署者去输入锁定期是多长时间
    uint256 lockTime;

    address erc20Addr;

    //作为getFund函数成功被执行完以后的标记。
    bool public getFundSuccess = false;

    constructor(uint256 _lockTime){
        //Sepolia测试网
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        //合约部署人
        owner = msg.sender;

        deploymentTimestamp = block.timestamp;      //当前区块的时间点
    
        lockTime = _lockTime; 
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner{
        erc20Addr = _erc20Addr;
    }

    //修改funderToAmount，只能被FundToTokenERC20合约修改
    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr, "you do not have permission to call this function");
        funderToAmount[funder] = amountToUpdate;
    }

    //合约转移所有权
    function transferOwnership(address newOwner) public onlyOwner {
        //require(msg.sender == owner, "this function can only be called by owner");
        owner = newOwner;
    }

    
    /*
        外界才能看见，用external
        payable 关键词表示当前函数可以接收原生通证token
            如果是以太网上的原生通证就是eth.如果是在ploygon上是matic
            我们创建的token是一种，但是gas是另一种token,也就是链自带的，也就叫原生token
            如果你的合约想要收取原生token，就需要payable这个关键字
    */
    function fund() external payable {
        //锁定期
        require(block.timestamp < deploymentTimestamp + lockTime, "window is closed");
        //金额条件
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        funderToAmount[msg.sender] = msg.value;       
    }

    function getChainlinkDataFeekLatestAnswer() public view returns (int){
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    } 

    //把ETH转化为USD
    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256) {
        uint256 ethPrice = uint(getChainlinkDataFeekLatestAnswer());
        return ethAmount * ethPrice / (10**8);
        // ethAmount的单位是wei 1 ether = 10^18wei
        // ETH / USE = 10^8  1个ETH值多少USD,由于chainlink对于获取到的usd的价格扩大了10^8，所以在将ETH转化为USD时，需要除以10^8
    }

    //只有外部调用才有意义
    //锁定期內，达到目标值，生产商可以提款
    function getFund() external windowClosed onlyOwner {
        //获取到合约地址,从地址中获取value
        require(convertEthToUsd(address(this).balance) >= TARGET,"Target is not reached");
        //合约的所有者，可以提钱
        //require(msg.sender == owner,"this function can only be called by owner");
        //require(block.timestamp >= deploymentTimestamp + lockTime,"window is not closed");
        //transfer
        payable(msg.sender).transfer(address(this).balance); 

        //send
        //bool success = payable(msg.sender).send(address(this).balance);
        //require(success, "tx failed");

        //call transfer ETH with data return value of function and bool
        //bool succ;
        //(succ, ) = payable(msg.sender).call{value: address(this).balance}("");
        //提完钱，将map当中的数据归零
        funderToAmount[msg.sender] = 0;
        getFundSuccess = true;
    }


    //锁定期內，没有达到目标值，投资人可以退款
    function refund() external windowClosed {
        require(convertEthToUsd(address(this).balance) < TARGET, "Target is reached");
        //没有达成目标，那么你可以把你fund到账户里的钱，退回来
        uint256 amount =  funderToAmount[msg.sender];
        require(amount != 0, "there is no fund for you");

        //说明你有fund这个合约。那么就可以退款了
        bool succ;
        (succ, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(succ, "transfer tx failed");
        funderToAmount[msg.sender] = 0;
    }

    modifier windowClosed() {
        require(block.timestamp >= deploymentTimestamp + lockTime,"window is not closed");
        _;      //当前函数在调用之前，先执行上面的require操作
    }


    modifier onlyOwner() {
        require(msg.sender == owner,"this function can only be called by owner");
        _;
    }
}