sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
  ],
  function (Controller, Fragment) {
    "use strict";

    return Controller.extend("qst4.controller.ProductDetail", {
      _oParent: null,
      _oCurrentItemModel: null,
      _nNumber: null,
      _nPrice: null,
      _oDialog: null,
      _sCurrentPath: null,

      init: function (oParent) {
        this._oParent = oParent;
        this._oShoppingCartModel = this._oParent.getOwnerComponent().getModel("shoppingCartModel");
        this._oCurrentItemModel = this._oParent.getOwnerComponent().getModel("currentItem");
      },

      insertDetailList: function () {
        var oFragController = sap.ui.controller("qst4.controller.ProductList");
        oFragController.init(this._oParent);
        var oFragment = sap.ui.xmlfragment("detailListFragment", "qst4.view.ProductList", oFragController);
        var oLayout = this._oParent.getView().byId("detailFragment--detailLayout");
        oLayout.insertContent(oFragment, 99);
      },

      formatDate: function (sDate) {
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          format: "yMMMMd"
        });
        return oDateFormat.format(sDate);
      },

      onOrderNumberChanged: function (oEvent) {
        console.log("onOrderNumberChanged");
        var nValue = Number(oEvent.getParameter("selectedItem").getText());
        this._nNumber = nValue;
        var oText = this._oParent.getView().byId("detailFragment--preis");
        this._sCurrentPath = this._oParent.getView().byId("detail").getBindingContext().sPath;

        var oModel = this._oParent.getOwnerComponent().getModel();
        oModel.read(this._sCurrentPath + "/Price", {
          success: function (oData) {
            var nPrice = Number(oData.Price);
            this._nPrice = nPrice;
            oText.setText("Aktueller Preis: " + Number(nValue) * nPrice + "€");
            this._oCurrentItemModel.setProperty("/PriceAll", this._nPrice * this._nNumber);
            this._oCurrentItemModel.setProperty("/Number", this._nNumber);
          }.bind(this)
        });
      },

      onOrder: function () {
        if (!this._oDialog) {
          Fragment.load({
            id: "dialog",
            name: "qst4.view.OrderDialog",
            type: "XML",
            controller: this
          }).then(function (oDialog) {
            this._oDialog = oDialog;
            this._oDialog.open();
            //this._oDialog.bindElement({path:"/", model: "currentItem"}); // /Products(0)
            this._oDialog.setModel(this._oCurrentItemModel, "model");
          }.bind(this));
        } else {
          this._oDialog.open();
        }
      },
      onDialogClose: function (oEvent) {
        this._oDialog.close();
      },
      addToCart: function (oEvent) {
        var oItem = oEvent.getSource();
        var sPath = oItem.getBindingContext().getPath();
        let oModel = this._oParent.getOwnerComponent().getModel();
        var _oSingleItem;
        oModel.read(sPath, {
          success: function (oData) {
            var shoppingItems = this._oShoppingCartModel.getProperty("/items");
            _oSingleItem = this._oCurrentItemModel.getData();

            if (shoppingItems.some(function (item) {
              return item.ID == oData.ID
            })) {
              shoppingItems.map(function (item) {
                if (item.ID == oData.ID) {
                  item.Number = item.Number + 1;
                  item.PriceAll = item.Number * item.Price;
                }
                return item;
              });
            } else {
              shoppingItems.push(_oSingleItem);
            }
            this._oShoppingCartModel.setProperty("/items", shoppingItems);

            sap.m.MessageToast.show(`Zu Einkaufswagen hinzugefügt: ${_oSingleItem.Name} `, {
              duration: 3000,                  // default
            });
          }.bind(this),
          error: function (oError) {
            sap.m.MessageToast.show(`Fehler beim hinzufügen`, {
              duration: 3000,                  // default
            });
            console.log("Error:", oError);
          }
        })
      }
    });
  }
);
