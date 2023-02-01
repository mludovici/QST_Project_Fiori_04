sap.ui.define([
    "sap/ui/core/mvc/Controller"
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

                var oFragController2 = sap.ui.controller("qst4.controller.ProductList");
                oFragController2.init(this);
                var oFragment2 = sap.ui.xmlfragment(this.createId("masterFragment"), "qst4.view.ProductList", oFragController2);
                this.getView().byId("master").insertContent(oFragment2);
            }
        });
    });
