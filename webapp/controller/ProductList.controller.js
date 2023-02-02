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
      _oCurrentItemModel: null,
      _oDetailFilter: null,
      _oCategoryFilter: null,
      _oSupplierFilter: null,
      _bDetailAdded: false,
      init: function (oParent, isMaster) {
        debugger;
        this._bMaster = isMaster
        this._oParent = oParent;
        this._oCurrentItemModel = this._oParent.getOwnerComponent().getModel("currentItem");
        this._oUIModel = this._oParent.getOwnerComponent().getModel("UIModel");
        if (!this._bMaster) {
          this._oUIModel.setProperty("/setSuppliersNotVisible", "true")
        } else {
          this._oUIModel.setProperty("/setSuppliersNotVisible", "false")
        }
      },
      onItemPressed: function (oEvent) {
        var oItem = oEvent.getSource();
        var sPath = oItem.getBindingContext().getPath(); // /Products(0)
        var oModel = this._oParent.getOwnerComponent().getModel();
        //var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);

        var oModel = this._oParent.getOwnerComponent().getModel();


        oModel.read(sPath, {
          success: function (oData) {

            this._oCurrentItemModel.setData(oData);
            this._oCurrentItemModel.setProperty("/Number", 1);
            this._oCurrentItemModel.setProperty("/PriceAll", oData.Price);
          }.bind(this)
        });
        if (!this._bDetailAdded && this._bMaster) {
          console.log("Add");
          var oFragController = sap.ui.controller("qst4.controller.ProductDetail");
          oFragController.init(this._oParent);
          var oFragment = sap.ui.xmlfragment(this._oParent.createId("detailFragment"), "qst4.view.ProductDetail", oFragController);
          this._oParent.getView().byId("detail").insertContent(oFragment);
          oFragController.insertDetailList();
          this._bDetailAdded = true;
        } else {
          var oSelect = this._oParent.getView().byId("detailFragment--bestellMenge");
          oSelect.setValue("1");
        }

        var oDetail = this._oParent.getView().byId("detail");
        oDetail.bindElement({
          path: sPath,
          parameters: {
            expand: "Supplier, Category"
          }
        });
        console.log("Falls ich das schon wieder verliere....", this._oParent.getView().byId("detailFragment--detailLayout"));
        var oDetailList = this._oParent.getView().byId("detailFragment--detailLayout").mAggregations.content[2].mAggregations.content[1]; //this is shitty

        oModel.read(sPath + "/Supplier", {
          success: function (oData) {
            var sSupplier = oData.Name;
            this._oDetailFilter = new sap.ui.model.Filter(
              "Supplier/Name",
              sap.ui.model.FilterOperator.EQ,
              sSupplier
            );
            console.log("Detail Filter wird gesetzt!", this._oDetailFilter);
            this._oParent.getOwnerComponent().getModel("UIModel").setProperty("/DetailFilter", this._oDetailFilter);

            oDetailList.getBinding("items").filter([this._oDetailFilter]);
          }.bind(this)
        });
      },
      /*onSelectCategory: function (oEvent) {
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

      }, */
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
      },
      onSelectFilter: function (oEvent) {
        console.log(oEvent);
        let selectedIndex = oEvent.getParameter("selectedIndex");
        var oSelectedRadioButtonValue = oEvent.getSource().getAggregation("buttons")[selectedIndex].getText();

        var oItemsList = this.checkMasterDetailListView();
        var oDropDownBox = this._oParent.getView().byId("masterFragment--onSelectFilter");

        if (oSelectedRadioButtonValue == "Categories") {
          sap.ui.core.Fragment.byId("masterFragment", "selectCategories").setVisible(true);
          sap.ui.core.Fragment.byId("masterFragment", "selectSuppliers").setVisible(false);
        } else {
          sap.ui.core.Fragment.byId("masterTest", "selectSuppliers").setVisible(true);
          sap.ui.core.Fragment.byId("masterFragment", "selectCategories").setVisible(false);
        }
        var jsModel = new sap.ui.model.json.JSONModel({
          filterPath: '/' + oSelectedRadioButtonValue
        });
      },
      onSelectCategory: function (oEvent) {
        var oModel = this._oParent.getOwnerComponent().getModel();
        var oItemsList = this.checkMasterDetailListView();        
        this._oDetailFilter =  this._oParent.getOwnerComponent().getModel("UIModel").getProperty("/DetailFilter");

        var sSelectedCategory = oEvent.getParameter("selectedItem").getText();
        this._oCategoryFilter = new sap.ui.model.Filter(
          "Category/Name",
          sap.ui.model.FilterOperator.EQ,
          sSelectedCategory
        );
        if (this._oSupplierFilter != null) {
          if(this._bMaster){
            oItemsList.getBinding("items").filter([this._oCategoryFilter, this._oSupplierFilter]);
          } else {            
            oItemsList.getBinding("items").filter([this._oCategoryFilter, this._oSupplierFilter, this._oDetailFilter]);
          }
        } else {
          if(this._bMaster){
            oItemsList.getBinding("items").filter([this._oCategoryFilter]);
          } else {            
            oItemsList.getBinding("items").filter([this._oCategoryFilter, this._oDetailFilter]);
          }
        }
      },
      onSelectSupplier: function (oEvent) {
        var oModel = this._oParent.getOwnerComponent().getModel();
        var oItemsList = this.checkMasterDetailListView();
        this._oDetailFilter =  this._oParent.getOwnerComponent().getModel("UIModel").getProperty("/DetailFilter");

        var sSelectedSupplier = oEvent.getParameter("selectedItem").getText();
        this._oSupplierFilter = new sap.ui.model.Filter(
          "Supplier/Name",
          sap.ui.model.FilterOperator.EQ,
          sSelectedSupplier
        );        
        if (this._oCategoryFilter != null) {
          if(this._bMaster){
            oItemsList.getBinding("items").filter([this._oCategoryFilter, this._oSupplierFilter]);
          } else {            
            oItemsList.getBinding("items").filter([this._oCategoryFilter, this._oSupplierFilter, this._oDetailFilter]);
          }
        } else {
          if(this._bMaster){
            oItemsList.getBinding("items").filter([this._oSupplierFilter]);
          } else {            
            oItemsList.getBinding("items").filter([this._oSupplierFilter, this._oDetailFilter]);
          }
        }
      },
      onResetFilter: function () {
        var oItemsList = this.checkMasterDetailListView();
        oItemsList.getBinding("items").filter(null);
        this._oSupplierFilter = null;
        this._oCategoryFilter = null;
        var select;
        var select2;
        if (this._bMaster == true) {
          select = this._oParent.getView().byId("masterFragment--selectFilterDropDown");
          select2 = this._oParent.getView().byId("masterFragment--selectFilterDropDown2");

        } else {
          select = this._oParent.getView().byId("detailFragment--detailLayout").mAggregations.content[5].mAggregations.content[0].mAggregations.items[0].mAggregations.items[0];
          select2 = this._oParent.getView().byId("detailFragment--detailLayout").mAggregations.content[5].mAggregations.content[0].mAggregations.items[0].mAggregations.items[1];
        }
        select.setValue(null);
        select2.setValue(null);
      },
      onFilter: function () {
        if (!this._oDialog) {
          Fragment.load({
            id: "filterDialog",
            name: "qst4.view.Filter",
            type: "XML",
            controller: this
          }).then(function (oDialog) {
            this._oDialog = oDialog;
            this._oDialog.open();
            //this._oDialog.bindElement({path:"/", model: "currentItem"}); // /Products(0)
            this._oDialog.setModel(this._oParent.getOwnerComponent().getModel(), "model");
            this._oDialog.setModel(this._oParent.getOwnerComponent().getModel("UIModel"), "UImodel");
          }.bind(this));
        } else {
          this._oDialog.open();
        }
      },
      onDialogClose: function (oEvent) {
        this._oDialog.close();
      }
    });
  }
);
