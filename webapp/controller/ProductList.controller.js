sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("qst4.controller.ProductList", {
        _oParent: null,
        init: function(oParent) {
            this._oParent = oParent;
        },       
        onItemPressed: function (oEvent) {
            var oItem = oEvent.getSource();
            var sPath= oItem.getBindingContext().getPath(); 
            var sIndex = sPath.substr(sPath.lastIndexOf("/") + 1);
            var oDetail = this._oParent.getView().byId("detail");
            oDetail.bindElement(sPath);
        }
      });
    }
  );
  