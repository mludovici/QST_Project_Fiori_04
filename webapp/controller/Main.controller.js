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

            },
            onItemPressed: function (oEvent) {
                var oItem = oEvent.getSource();
                var sPath= oItem.getBindingContext().getPath(); 
                var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);
                var oDetail = this.getView().byId("box");
                oDetail.bindElement(sPath);

            }
         });
    });
