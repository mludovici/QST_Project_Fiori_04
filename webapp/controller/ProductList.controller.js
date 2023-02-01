sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
  ],
  function (Controller, Fragment) {
    "use strict";

    return Controller.extend("qst4.controller.ProductList", {
      _oParent: null,
      init: function (oParent) {
        this._oParent = oParent;
      },
      onItemPressed: function (oEvent) {
        var oItem = oEvent.getSource();
        var sPath = oItem.getBindingContext().getPath(); // /Products(0)
        //var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);
        var oDetail = this._oParent.getView().byId("detail");
        oDetail.bindElement({
          path: sPath
        });
        var oDetailList = this._oParent.getView().byId("detailFragment--detailList--list");

        var oModel = this._oParent.getOwnerComponent().getModel();
        oModel.read(sPath + "/Supplier", {
          success: function (oData) {
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


      },
      onSelectionChange: function (oEvent) {
        var oModel = this._oParent.getOwnerComponent().getModel();

        var oProductList = this._oParent.getView().byId("masterFragment--list");
        var oSelectedCategory = oEvent.getParameter("selectedItem").getBindingContext().getPath() //Categories(x)

        oModel.read(oSelectedCategory, {
          success: function (oCategory) {
            debugger;
            var sCategory = oCategory.Name;
            var oFilter = new sap.ui.model.Filter(
              "Category/Name",
              sap.ui.model.FilterOperator.EQ,
              sCategory
            );
            oProductList.getBinding("items").filter([oFilter]);
          },
          error: function (oError) {
            console.log("Error filtering:", oError);
          }
        });
      },

      onFilter: function (oEvent) {
        var oItem = oEvent.getSource();
        var sPath = oItem.getBindingContext().getPath();
        console.log("sPath:", sPath);
        // var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);
        //   var oDetail = this._oParent.getView().byId("detail");
        //   oDetail.bindElement(sPath);
      }

    });
  }
);
