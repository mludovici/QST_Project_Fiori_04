sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("qst4.controller.ProductDetail", {
      _oParent: null,
      _nNumber: null,
      _nPrice: null,
      init: function (oParent) {
        this._oParent = oParent;
      },
      insertDetailList: function () {
        var oFragController = sap.ui.controller("qst4.controller.ProductList");
        oFragController.init(this._oParent);
        var oFragment = sap.ui.xmlfragment("detailListFragment", "qst4.view.ProductList", oFragController);
        var oLayout = this._oParent.getView().byId("detailFragment--detailLayout");
        oLayout.insertContent(oFragment, 99);
      },
      formatDate: function (sDate) {
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          format: "yMMMMd"
        });
        return oDateFormat.format(sDate);
      },
      onOrderNumberChanged: function (oEvent) {
        var nValue = Number(oEvent.getParameter("selectedItem").getText());
        this._nNumber = nValue;
        var oText = this._oParent.getView().byId("detailFragment--preis");
        var sItemPath = this._oParent.getView().byId("detail").getBindingContext().sPath;

        var oModel = this._oParent.getOwnerComponent().getModel();
        oModel.read(sItemPath + "/Price", {
          success: function (oData) {
            var nPrice = Number(oData.Price);
            this._nPrice = nPrice;
            oText.setText("Aktueller Preis: " + Number(nValue) * nPrice + "€");
          }
        });
      }

    });
  }
);
