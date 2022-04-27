// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract OperationHistoryContract {
    uint id = 0;

    struct Operation{
        uint id;
        address from;
        address to;
        uint quantity;
        uint timestamp;
        bool isBuyer;
    }

    mapping(address=>Operation[]) UserOperationsHistory;
    
    function addOperation(address buyer,address seller,uint quantity) public {
        if (buyer != address(0)){
            UserOperationsHistory[buyer].push(Operation(
                id,
                buyer,
                seller,
                quantity,
                block.timestamp,
                true
            ));
        }
        if (seller != address(0)){
            UserOperationsHistory[seller].push(Operation(
                id,
                buyer,
                seller,
                quantity,
                block.timestamp,
                false
            ));
        }
    }

    function getUserOperations() public view returns(Operation[] memory){
        return UserOperationsHistory[msg.sender];
    }
}