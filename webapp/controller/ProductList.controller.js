sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter"
  ],
  function (Controller, Fragment, Sorter) {
    "use strict";

    return Controller.extend("qst4.controller.ProductList", {
      _oParent: null,
      _bMaster: null,
      init: function (oParent, isMaster) {
        this._bMaster = isMaster
        this._oParent = oParent;
      },
      onItemPressed: function (oEvent) {
        var oItem = oEvent.getSource();
        var sPath = oItem.getBindingContext().getPath(); // /Products(0)
        //var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);
        var oDetail = this._oParent.getView().byId("detail");
        oDetail.bindElement({
          path: sPath,
          parameters: {
            expand: "Supplier, Category"
          }
        });
        var oDetailList = this._oParent.getView().byId("detailFragment--detailLayout").mAggregations.content[2].mAggregations.content[1];
        var oModel = this._oParent.getOwnerComponent().getModel();
        oModel.read(sPath + "/Supplier", {
          success: function (oData) {
            var sSupplier = oData.Name;
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
        var oItemsList = this.checkMasterDetailListView();

        var oSelectedCategory = oEvent.getParameter("selectedItem").getBindingContext().getPath() //Categories(x)

        if (this._bMaster) {  //if master view, filter for category only
          oModel.read(oSelectedCategory, {
            success: function (oCategory) {
              var sCategory = oCategory.Name;
              var oFilter = new sap.ui.model.Filter(
                "Category/Name",
                sap.ui.model.FilterOperator.EQ,
                sCategory
              );
              oItemsList.getBinding("items").filter([oFilter]);
            },
            error: function (oError) {
              console.log("Error filtering:", oError);
            }
          });
        } else {  //if detail view, filter for supplier and then for category
          var oItem = oEvent.getSource();
          var sPath = oItem.getBindingContext().getPath(); // /Products(0)
          //var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);
          var oDetail = this._oParent.getView().byId("detail");
          oDetail.bindElement({
            path: sPath,
            parameters: {
              expand: "Supplier, Category"
            }
          });
          //var oDetailList = this._oParent.getView().byId("detailFragment--detailLayout").mAggregations.content[2].mAggregations.content[1];
          var oModel = this._oParent.getOwnerComponent().getModel();
          oModel.read(sPath + "/Supplier", {
            success: function (oData) {
              var sSupplier = oData.Name;
              var oFilterSupplier = new sap.ui.model.Filter(
                "Supplier/Name",
                sap.ui.model.FilterOperator.EQ,
                sSupplier
              );
              oModel.read(oSelectedCategory, {
                success: function (oCategory) {
                  var sCategory = oCategory.Name;
                  var oFilterCategory = new sap.ui.model.Filter(
                    "Category/Name",
                    sap.ui.model.FilterOperator.EQ,
                    sCategory
                  );
                  oItemsList.getBinding("items").filter([oFilterCategory, oFilterSupplier]);
                },
                error: function (oError) {
                  console.log("Error filtering:", oError);
                }
              });
            },
            error: function (oError) {
              console.log("Error:", oError);
            }
          });
        }

      },
      onSortAsc: function (oEvent) {
        var oItemsList = this.checkMasterDetailListView();

        var oSorter = new Sorter('Name', true);
        oItemsList.getBinding("items").sort([oSorter]);
      },
      onSortDesc: function (oEvent) {
        var oItemsList = this.checkMasterDetailListView();

        var oSorter = new Sorter('Name', false);
        oItemsList.getBinding("items").sort([oSorter]);
      },
      checkMasterDetailListView() {
        var oItemsList;
        if (this._bMaster) {
          oItemsList = this._oParent.getView().byId("masterFragment--list");
        } else {
          oItemsList = this._oParent.getView().byId("detailFragment--detailLayout").mAggregations.content[2].mAggregations.content[1];
        }
        return oItemsList;
      }

    });
  }
);
