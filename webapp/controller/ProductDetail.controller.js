sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("qst4.controller.ProductDetail", {
      _oParent: null,
      init: function (oParent) {
        this._oParent = oParent;
      },
      insertDetailList: function () {
        var oFragController = sap.ui.controller("qst4.controller.ProductList");
        oFragController.init(this._oParent, false);
        var oFragment = sap.ui.xmlfragment("detailListFragment", "qst4.view.ProductList", oFragController);
        var oLayout = this._oParent.getView().byId("detailFragment--detailLayout");
        oLayout.insertContent(oFragment, 99);
      },
      formatDate: function (sDate) {
        console.log("mein Datum", sDate);
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          format: "yMMMd"
        });

        return oDateFormat.format(sDate);
      }

    });
  }
);
