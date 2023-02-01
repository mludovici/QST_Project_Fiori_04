sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("qst4.controller.ProductDetail", {
        _oParent: null,
        init: function(oParent) {
            this._oParent = oParent;
        },       
      });
    }
  );
  