sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment"
    ],
    function(Controller, Fragment) {
      "use strict";
  
      return Controller.extend("qst4.controller.ProductList", {
        _oParent: null,
        init: function(oParent) {
            this._oParent = oParent;
        },       
        onItemPressed: function (oEvent) {
            var oItem = oEvent.getSource();
            var sPath= oItem.getBindingContext().getPath(); // /Products(0)
            //var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);
            var oDetail = this._oParent.getView().byId("detail");
            oDetail.bindElement({
                path: sPath
            });
            var oDetailList = this._oParent.getView().byId("detailFragment--detailList--list");

            var oModel = this._oParent.getOwnerComponent().getModel();
                oModel.read(sPath + "/Supplier", {
                    success: function(oData){
                        var sSupplier = oData.Name;
                        console.log("oData", sSupplier);
                        var oFilter = new sap.ui.model.Filter(
                          "Supplier/Name",
                          sap.ui.model.FilterOperator.EQ,
                          sSupplier
                        );
                        oDetailList.getBinding("items").filter([oFilter]);
                    }
                });


        }
      });
    }
  );
  