// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Asset.sol";

contract OrderContract {
    uint buyId;
    uint sellId;
    AssetContract public _assetContract;
    
    struct Order{
        uint id;
        string company_id;
        uint price;
        uint quantity;
        uint timestamp;  
        address seller;
        address buyer;
        bool isActive;
    }

    struct OrderAssets{
        uint order_id;
        uint asset_id;
        string company_id;
        bool isBuyOrder;
    }
    
    event BuyOrder(
        uint id,
        string company_id,
        uint price,
        uint quantity,
        uint timestamp, 
        address seller,
        address buyer,
        bool isActive

    );

    event SellOrder(
        uint id,
        string company_id,
        uint price,
        uint quantity,
        uint timestamp, 
        address seller,
        address buyer,
        bool isActive
    );

    Order[] BuyOrders;
    Order[] SellOrders;

    constructor(address _AssetContract){
        _assetContract = AssetContract(_AssetContract);
    }
    
    function createBuyOrder(string memory company_id,uint price,uint quantity) public {
        BuyOrders.push(Order(
            buyId,
            company_id,
            price,
            quantity,
            block.timestamp,
            address(0),
            msg.sender,
            false
        ));
        buyId++;
        emit BuyOrder(
            buyId-1,
            company_id,
            price,
            quantity,
            block.timestamp,
            address(0),
            msg.sender,
            false
        );
    }

    function createSellOrder(string memory company_id,uint price,uint quantity) public {
        SellOrders.push(Order(
            sellId,
            company_id,
            price,
            quantity,
            block.timestamp,
            msg.sender,
            address(0),
            false
        ));
        sellId++;
        emit SellOrder(
            sellId-1,
            company_id,
            price,
            quantity,
            block.timestamp,
            msg.sender,
            address(0),
            false
        );
    }
    
    function getAllSellOrders() public view returns (Order[] memory){
        uint cpt = 0;
        Order[] memory _sellOrders = new Order[](buyId);
        for (uint i=0;i<sellId;i++){
            _sellOrders[cpt] = SellOrders[i];        
            cpt++;
        }
        return _sellOrders;
    }

    function getAllBuyOrders() public view returns (Order[] memory){
        uint cpt = 0;
        Order[] memory _buyOrders = new Order[](buyId);
        for (uint i=0;i<buyId;i++){
            _buyOrders[cpt] = BuyOrders[i];        
            cpt++;
        }
        return _buyOrders;
    }

    function getMarketBuyOrders() public view returns(Order[] memory){
        uint counter =  0;
        uint cpt =  0;

        for (uint i=0;i<buyId;i++){
            if(BuyOrders[i].buyer != tx.origin){
                counter++;
            }
        }
        
        Order[] memory _marketBuyOrders = new Order[](counter);
        for (uint i=0;i<buyId;i++){
            if(BuyOrders[i].buyer != tx.origin){
                _marketBuyOrders[cpt] = BuyOrders[i];        
                cpt++;
            }
        }

        return _marketBuyOrders;
    }

    function getMarketSellOrders() public view returns(Order[] memory){
        uint counter =  0;
        uint cpt =  0;

        for (uint i=0;i<buyId;i++){
            if(SellOrders[i].seller != tx.origin){
                counter++;
            }
        }
        
        Order[] memory _marketSellOrders = new Order[](counter);
        for (uint i=0;i<buyId;i++){
            if(SellOrders[i].seller != tx.origin){
                _marketSellOrders[cpt] = BuyOrders[i];        
                cpt++;
            }
        }

        return _marketSellOrders;
    }


    function getCurrentCompanyBuyOrder(string memory _company_id) public view returns(Order memory){
        for (uint i=0;i<buyId;i++){
            if (keccak256(abi.encodePacked(BuyOrders[i].company_id)) == keccak256(abi.encodePacked(_company_id))){
                return BuyOrders[i];
            }
        }
    }

    function getBuyOrder(uint _id) public view returns (Order memory){
        for (uint i=0;i<buyId;i++){
            if (BuyOrders[i].id == _id){
                return BuyOrders[i];
            }
        }
    }
     
    function getSellOrder(uint _id) public view returns (Order memory){
        for (uint i=0;i<sellId;i++){
            if (SellOrders[i].id == _id){
                return SellOrders[i];
            }
        }
    } 

    function getUserBuyOrders()public view returns (Order[] memory){
        uint counter =  0;
        uint cpt =  0;

        for (uint i=0;i<buyId;i++){
            if(BuyOrders[i].buyer == tx.origin){
                counter++;
            }
        }
        
        Order[] memory _marketBuyOrders = new Order[](counter);
        for (uint i=0;i<buyId;i++){
            if(BuyOrders[i].buyer == tx.origin){
                _marketBuyOrders[cpt] = BuyOrders[i];        
                cpt++;
            }
        }

        return _marketBuyOrders;
    }

    function getReadyBuyOrders() public view returns(OrderAssets[] memory){
        uint counter =  0;
        uint cpt =  0;
        Order[] memory allBuyOrders = getAllBuyOrders();
        for (uint i=0;i<allBuyOrders.length;i++){
            AssetContract.OrderAssetInfo[] memory assetsPerBuyOrder = _assetContract.getBuyOrderItems(allBuyOrders[i].company_id,allBuyOrders[i].price);
            if (assetsPerBuyOrder.length >= allBuyOrders[i].quantity){
                for (uint j=0;j<allBuyOrders[i].quantity;j++){
                   cpt++;
                }
            }
        }

        OrderAssets[] memory ordersReady =  new OrderAssets[](cpt);
        for (uint i=0;i<allBuyOrders.length;i++){
            AssetContract.OrderAssetInfo[] memory assetsPerBuyOrder = _assetContract.getBuyOrderItems(allBuyOrders[i].company_id,allBuyOrders[i].price);
            if (assetsPerBuyOrder.length >= allBuyOrders[i].quantity){
                for (uint j=0;j<allBuyOrders[i].quantity;j++){
                    ordersReady[counter] = OrderAssets(
                        allBuyOrders[i].id,
                        assetsPerBuyOrder[j].asset_id,
                        allBuyOrders[i].company_id,
                        true
                    );
                    counter++;
                }
            }
        }
        
        return ordersReady;
    }

    function cancelBuyOrder(uint _id) public{
        Order storage thisOrder = BuyOrders[0];
        for (uint i=0;i<buyId;i++){
            if (BuyOrders[i].id == _id){
                thisOrder = BuyOrders[i];
            }
        }
        thisOrder.isActive = true;
    }
}