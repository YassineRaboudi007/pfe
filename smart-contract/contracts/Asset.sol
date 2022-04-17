// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract AssetContract {
    uint id;

    struct CompanyAssetInfo{
        string company_id;
        uint lowPrice;
        uint midPrice;
        uint highPrice;
    }

    struct Asset {
        uint id;
        uint price;
        string company_id;
        address owner;
        bool isListed;
    }

    struct OrderAssetInfo{
        string company_id;
        uint asset_id;
    }

    event AssetStateChanged(
        uint id,
        uint price,
        string company_id,
        address owner,
        bool isListed
    );

    mapping (string => Asset[]) public AssetListByCompany;
    
    function createAsset(
        uint price,
        uint _amount,
        string memory company_id
    ) public {
        for (uint _i=0;_i<_amount;_i++){
            AssetListByCompany[company_id].push(Asset(
                id,
                price,
                company_id,
                msg.sender,
                true
            )); 

            id++;
            emit AssetStateChanged(
                id-1,
                price,
                company_id,
                msg.sender,
                true
            );
        }
        
    }

    function listAsset(string memory _compID , uint _id,uint price) public{
        Asset[] storage _compAssets = AssetListByCompany[_compID];
        Asset storage _asset = _compAssets[0];
        for (uint i=0;i<_compAssets.length;i++){
            if (_compAssets[i].id == _id) {
                _asset = _compAssets[i];
                break;
            }
        }

        _asset.isListed = true;
        _asset.price = price;

        emit AssetStateChanged(
            _asset.id,
            _asset.price,
            _asset.company_id,
            _asset.owner,
            true
        );
    }

    function unlistAsset(string memory _compID , uint _id) public{
        Asset[] storage _compAssets = AssetListByCompany[_compID];
        Asset storage _asset = _compAssets[0];
        for (uint i=0;i<_compAssets.length;i++){
            if (_compAssets[i].id == _id) {
                _asset = _compAssets[i];
                break;
            }
        }

        _asset.isListed = false;
    }

    function getAsset(string memory company_id,uint _id) public view returns(Asset memory){
        Asset[] memory _companyAssets  = getCompanyAssets(company_id);
        for (uint i=0;i<_companyAssets.length;i++){
            if (_companyAssets[i].id == _id) return _companyAssets[i];
        }
    }
    
    function getCompanyAssets(string memory _companyId) public view returns (Asset[] memory){
        return AssetListByCompany[_companyId];
    }  

    function getAllAssets(string[] memory _companyIds) public view returns (Asset[] memory){
        uint cpt = 0;
        Asset[] memory _assets = new Asset[](id);
        for (uint i=0;i<_companyIds.length;i++){
            for (uint j=0;j<AssetListByCompany[_companyIds[i]].length;j++){
                _assets[cpt] = AssetListByCompany[_companyIds[i]][j];
                cpt++;
            }
        }
        return _assets;
    }

    function getAssetsByOwner(string[] memory _companyIds) public view returns (Asset[] memory){
        uint cpt = 0;
        uint counter = 0;
        for (uint i=0;i<_companyIds.length;i++){
            for (uint j=0;j<AssetListByCompany[_companyIds[i]].length;j++){
                if (AssetListByCompany[_companyIds[i]][j].owner == msg.sender){
                    counter++;
                }
            }
        }

        Asset[] memory _assets = new Asset[](counter);
        for (uint i=0;i<_companyIds.length;i++){
            for (uint j=0;j<AssetListByCompany[_companyIds[i]].length;j++){
                if (AssetListByCompany[_companyIds[i]][j].owner == msg.sender){
                    _assets[cpt] = AssetListByCompany[_companyIds[i]][j];
                    cpt++;
                }
            }
        }
        return _assets;
    }

    function getMarketAssets(string[] memory _companyIds) public view returns (Asset[] memory){
        uint cpt = 0;
        uint counter = 0;
        for (uint i=0;i<_companyIds.length;i++){
            for (uint j=0;j<AssetListByCompany[_companyIds[i]].length;j++){
                if (AssetListByCompany[_companyIds[i]][j].owner != tx.origin && AssetListByCompany[_companyIds[i]][j].isListed == true){
                    counter++;
                }
            }
        }

        Asset[] memory _assets = new Asset[](counter);
        for (uint i=0;i<_companyIds.length;i++){
            for (uint j=0;j<AssetListByCompany[_companyIds[i]].length;j++){
                if (AssetListByCompany[_companyIds[i]][j].owner != tx.origin && AssetListByCompany[_companyIds[i]][j].isListed == true){
                    _assets[cpt] = AssetListByCompany[_companyIds[i]][j];
                    cpt++;
                }
            }
        }
        return _assets;
    }

    function getCompanyMarketAssets(string memory _companyId) public view returns (Asset[] memory){
        uint cpt = 0;
        uint counter = 0;
        for (uint j=0;j<AssetListByCompany[_companyId].length;j++){
            if (AssetListByCompany[_companyId][j].owner != tx.origin && AssetListByCompany[_companyId][j].isListed == true){
                counter++;
            }
        }

        Asset[] memory _assets = new Asset[](counter);
        for (uint j=0;j<AssetListByCompany[_companyId].length;j++){
            if (AssetListByCompany[_companyId][j].owner != tx.origin && AssetListByCompany[_companyId][j].isListed == true){
                _assets[cpt] = AssetListByCompany[_companyId][j];
                cpt++;
            }
        }
        return _assets;
    }

    function getCompanyAssetsInfo(string memory _companyId) public view returns (CompanyAssetInfo memory ){
        Asset[] memory assets = getCompanyAssets(_companyId);
        if (assets.length == 0) return CompanyAssetInfo(
            _companyId,
            0,0,0
            );
        uint lowPrice = assets[0].price;
        uint midPrice = 0;
        uint highPrice = assets[0].price;

        for (uint i=0;i<assets.length;i++){
            if (assets[i].price<lowPrice){
                lowPrice = assets[i].price;
            }else if (assets[i].price>highPrice){
                highPrice = assets[i].price;
            }
            midPrice+=assets[i].price;
        }
        midPrice = midPrice/assets.length;

        return CompanyAssetInfo(
            _companyId,
            lowPrice,
            midPrice,
            highPrice
        );
    }

    function changeAssetOwner(string memory company_id,uint _id,address _newOwner) public {
        Asset[] storage _compAssets = AssetListByCompany[company_id];
        Asset storage _asset = _compAssets[0];
        for (uint i=0;i<_compAssets.length;i++){
            if (_compAssets[i].id == _id) {
                _asset = _compAssets[i];
                break;
            }
        }
        _asset.owner = _newOwner;
    }

    function getBuyOrderItems(string memory company_id,uint price) public view returns (OrderAssetInfo[] memory){
        Asset[] memory _companyAssets = getCompanyMarketAssets(company_id);
        uint cpt = 0;
        uint counter = 0;

        for (uint j=0;j<_companyAssets.length;j++){
            if (_companyAssets[j].price <= price){
                counter++;
            }
        }

        OrderAssetInfo[] memory _assets = new OrderAssetInfo[](counter);
        for (uint j=0;j<_companyAssets.length;j++){
            if (_companyAssets[j].price <= price){
                _assets[cpt] = OrderAssetInfo(_companyAssets[j].company_id,_companyAssets[j].id);
                cpt++;
            }
        }

        return _assets;
    }
}