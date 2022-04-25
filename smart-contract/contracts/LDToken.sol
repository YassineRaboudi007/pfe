// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./library/SafeMath.sol";
import "./interfaces/IERC20.sol";
import "./ReentrancyGuard.sol";
import "./Ownable.sol";


contract LDToken is IERC20,Ownable,ReentrancyGuard {
    using SafeMath for uint;
    uint x;
    uint _totalSupply;
    address public TransactionContract;
    
    struct Transaction{
        address from;
        address to;
        uint tokenCount;
    }

    Transaction[] transactions;


    mapping(address => uint) public balances;
    mapping (address => mapping (address => uint)) public allowed;

    function setTransactionContract(address _transactionContract) public onlyOwner{
        TransactionContract = _transactionContract;
    }

    function totalSupply() override public view returns (uint256){
        return _totalSupply;
    }

    function balanceOf(address account) override public view returns (uint256){
        return balances[account];
    }

    function transfer(address _to, uint _value) override  public nonReentrant returns (bool){
        require(_to != address(0),"Address is empty");
        require(balances[msg.sender] >= _value,"Insuffiecent Funds");
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    } 

    function allowance(address owner, address spender) override public view  returns (uint256){
        return allowed[owner][spender];
    }

    function approve(address spender, uint256 amount) override public  returns (bool){
        require(spender != address(0),"Account address is empty");  
        allowed[msg.sender][spender] += amount;
        emit Approval(msg.sender,spender,amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) override public  returns (bool){
        uint _allowance = allowed[from][msg.sender];
        if (msg.sender != TransactionContract){
            require(balances[from] >= amount,"Insufficent funds");
            require(_allowance >= amount ,"Insufficent funds");    
        }
        require(from != address(0),"from address is empty");
        require(to != address(0),"to address is empty");
        balances[from] = balances[from].sub(amount);
        balances[to] = balances[to].add(amount);
        if (msg.sender != TransactionContract) {allowed[from][msg.sender] = _allowance.sub(amount);} 
        emit Transfer(from,to,amount);
        return true;
    }

    

    function increaseAllowance(address spender, uint256 addedValue) public returns(bool){
        require(spender != address(0),"from address is empty");
        allowed[msg.sender][spender] = allowed[msg.sender][spender].add(addedValue);
        emit Approval(msg.sender,spender,allowed[msg.sender][spender]);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns(bool){
        require(spender != address(0),"from address is empty");
        allowed[msg.sender][spender] = allowed[msg.sender][spender].sub(subtractedValue);
        emit Approval(msg.sender,spender,allowed[msg.sender][spender]);
        return true;
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0),"from address is empty");
        balances[account] = balances[account].add(amount);
        _totalSupply = _totalSupply.add(amount);
        emit Transfer(address(0),account,amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0),"from address is empty");
        require(balances[account] >= amount,"from address is empty");
        balances[account] = balances[account].sub(amount);
        _totalSupply = _totalSupply.add(amount);
        emit Transfer(account,address(0),amount);
    }

    function buyTokens(uint _amount) public payable nonReentrant  {
        require(msg.value == _amount,"Its is good");
        approve(TransactionContract, _amount);
        _mint(msg.sender,_amount);
    }

    function sellTokens(uint _amount) public payable nonReentrant{
        require (balances[msg.sender] >= _amount,"Its is good");
        _burn(msg.sender,_amount);
        payable(msg.sender).transfer(_amount);    
    }
}