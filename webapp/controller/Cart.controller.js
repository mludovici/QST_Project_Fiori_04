sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, History) {
        "use strict";

        return Controller.extend("qst4.controller.Cart", {
            onInit: function () {
                debugger;
                this.getOwnerComponent().getRouter().getRoute("ShoppingCart").attachPatternMatched(this._onRouteMatched, this);
                this._oDialog = null;
                this._oShoppingCartModel = this.getOwnerComponent().getModel("shoppingCartModel");
                this.getView().setModel(this._oShoppingCartModel);
                this._oUIModel = this.getOwnerComponent().getModel("UIModel");
                this.orderSummary();
            },
            _onRouteMatched: function (oEvent) {
                this.orderSummary();
            },
            onNavBack: function () {
                var oHistory = History.getInstance();
                var oPrevHash = oHistory.getPreviousHash();
                if (oPrevHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.toMain();
                }
            },
            toMain: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain");
            },
            orderSummary: function () {
                debugger;
                let shoppingItems = this._oShoppingCartModel.getProperty("/items");
                if (!shoppingItems || shoppingItems.length == 0) {
                    return;
                }
                let sumPrice = shoppingItems.reduce((accumulator, currentValue) => accumulator + Number(currentValue.PriceAll), 0);
                this._oUIModel.setProperty("/sumPriceShoppingCart", sumPrice.toFixed(2));

            },
            onCartOrder: function () {
                debugger;
                if (!this._oDialog) {
                    Fragment.load({
                        id: "oCartDialog",
                        name: "qst4.view.cartOrderSummaryDialog",
                        type: "XML",
                        controller: this
                    }).then(function (oDialog) {
                        this._oDialog = oDialog;
                        this._oDialog.open();
                        //this._oDialog.bindElement({path:"/", model: "currentItem"}); // /Products(0)
                        this._oDialog.setModel(this._oUIModel, "summaryModel");
                    }.bind(this));
                } else {
                    this._oDialog.open();
                }
            },
            onDialogClose: function (oEvent) {
                this._oDialog.close();
                this._oShoppingCartModel.setProperty("/items", []);
                this._oUIModel.setProperty("/sumPriceShoppingCart", 0);
            },
        });
    })
