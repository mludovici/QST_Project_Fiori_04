sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("qst4.controller.Cart", {
            onInit: function () {

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
                oRouter.navTo("");
            }
        });
    });
