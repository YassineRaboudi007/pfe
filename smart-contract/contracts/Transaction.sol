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
        address userId;
        uint sellPrice;
        uint timestamp;  
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
            Transaction memory tran = Transaction(
                _buyParams[i].asset_id,
                msg.sender,
                _price,
                block.timestamp
            );
            AssetTransactionHistory[_buyParams[i].asset_id].push(tran);
            UserTransactionHistory[msg.sender].push(tran);
        }
    }
}