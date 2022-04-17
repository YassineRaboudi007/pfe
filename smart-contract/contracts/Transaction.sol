// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Asset.sol";
import "./LDToken.sol";

contract TransactionContract {
    AssetContract assetContract;
    LDToken ldtContract;

    mapping(uint=>Transaction[]) AssetTransactionHistory;
    mapping(address=>Transaction[]) UserTransactionHistory;
    
    struct Transaction{
        uint asset_id;
        string company_id;
        address userId;
        uint sellPrice;
        uint timestamp; 
        bool isBuyer;
    }

    struct BuyParamsStruct{
        string company_id;
        uint asset_id;
    }
    
    constructor(address _ldtContract,address _assetContract){
        assetContract = AssetContract(_assetContract);
        ldtContract = LDToken(_ldtContract);
    }

    function buyAsset(BuyParamsStruct[] memory _buyParams) public payable{
        for (uint i=0;i<_buyParams.length;i++){
            uint _price = assetContract.getAsset(_buyParams[i].company_id, _buyParams[i].asset_id).price;
            address owner = assetContract.getAsset(_buyParams[i].company_id, _buyParams[i].asset_id).owner;
            ldtContract.transferFrom(msg.sender,owner, _price);
            assetContract.changeAssetOwner(_buyParams[i].company_id, _buyParams[i].asset_id, msg.sender);
            assetContract.unlistAsset(_buyParams[i].company_id, _buyParams[i].asset_id);
            Transaction memory buyerTransaction = Transaction(
                _buyParams[i].asset_id,
                _buyParams[i].company_id,
                msg.sender,
                _price,
                block.timestamp,
                true
            );

            Transaction memory sellerTransaction = Transaction(
                _buyParams[i].asset_id,
                _buyParams[i].company_id,
                owner,
                _price,
                block.timestamp,
                false
            );

            AssetTransactionHistory[_buyParams[i].asset_id].push(buyerTransaction);
            UserTransactionHistory[msg.sender].push(buyerTransaction);
            UserTransactionHistory[owner].push(sellerTransaction);
        }
    }

    function getUserTransactions() public view returns(Transaction[] memory){
        return UserTransactionHistory[msg.sender];
    }
}