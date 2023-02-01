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
      onFilter: function (oEvent) {
        var oItem = oEvent.getSource();
        var sPath = oItem.getBindingContext().getPath();
        console.log("sPath:", sPath);
        // var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);
        //   var oDetail = this._oParent.getView().byId("detail");
        //   oDetail.bindElement(sPath);
      },
      onSelectionChange: function (oEvent) {
        // var oITT = oEvent.getSelectedItem();
        // console.log(oITT);

        var sItem = oEvent.getParameter("selectedItem");
        var sPath = sItem.getBindingContext().getPath()

        console.log(sPath);
        // var sPath = oItem.getBindingContext().getPath();
        // console.log("path:", sPath);

        var oList = this._oParent.getView().byId(this.createId("list"));
        debugger;
        // var pars = oEvent.getParameters("selectedItem");
        // console.log(oItem);
        // console.log(oItem.getKeys("items"));
        // var item = oItem.getBinding("items");
        // console.log("items:", item);
        // var sPath= oItem.getBindingPath(); 
        // console.log("sPath:", sPath);

        // var oInput = this.getView().byId("input0");
        // var oList = this.getView().byId("__table0");
        // var oListValue = oInput.getValue();
        // var oFilter = new sap.ui.model.Filter("oscYear", FilterOperator.GE, oListValue);
        // var oBinding = oList.getBinding("items");
        // oBinding.filter(oFilter);
      }
    });
  }
);
