sap.ui.define([
    "sap/ui/core/mvc/Controller",

    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History) {
        "use strict";

        return Controller.extend("qst4.controller.Cart", {
            onInit: function () {
                this._oShoppingCartModel = this.getOwnerComponent().getModel("shoppingCartModel");
                this.getView().setModel(this._oShoppingCartModel);
            },
            onNavBack: function () {
                var data = this._oShoppingCartModel.getData();
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
                oRouter.navTo("");
            },
            orderSummary: function () {
                let shoppingItems = this._oShoppingCartModel.getProperty("items");
                let sumPrice = shoppingItems.reduce((accumulator, currentValue) => accumulator + currentValue.PriceAll, 0);
                console.log(sumPrice);
                debugger;
            }
        });
    });
