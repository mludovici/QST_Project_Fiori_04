sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("qst4.controller.Main", {
            onInit: function () {
                var oFragController = sap.ui.controller("qst4.controller.ProductDetail");
                oFragController.init(this);
                var oFragment = sap.ui.xmlfragment(this.createId("detailFragment"), "qst4.view.ProductDetail", oFragController);
                this.getView().byId("detail").insertContent(oFragment);
                oFragController.insertDetailList();

                var oFragController2 = sap.ui.controller("qst4.controller.ProductList");
                oFragController2.init(this, true);
                var oFragment2 = sap.ui.xmlfragment(this.createId("masterFragment"), "qst4.view.ProductList", oFragController2);
                this.getView().byId("master").insertContent(oFragment2);
            },
            toCart: function (oEvent) {
                debugger;
                console.log("Nav Event: ", oEvent);
                var oRouter = this.getOwnerComponent().getRouter();
                // var oROuter2 = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("ShoppingCart");
            },



        });
    });
