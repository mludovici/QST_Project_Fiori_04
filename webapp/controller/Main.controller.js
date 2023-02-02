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
                var oFragController2 = sap.ui.controller("qst4.controller.ProductList");
                oFragController2.init(this, true);
                var oFragment2 = sap.ui.xmlfragment(this.createId("masterFragment"), "qst4.view.ProductList", oFragController2);
                this.getView().byId("master").insertContent(oFragment2);
            },
            navToCart: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("ShoppingCart");
            }


        });
    });
