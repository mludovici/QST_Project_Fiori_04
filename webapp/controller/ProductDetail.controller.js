sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment"
    ],
    function(Controller, Fragment) {
      "use strict";
  
      return Controller.extend("qst4.controller.ProductDetail", {
        _oParent: null,
        _nNumber: null,
        _nPrice: null,
        _oDialog: null,
        _sCurrentPath:null,
        init: function(oParent) {
            this._oParent = oParent;
        },
        insertDetailList: function() {
          var oFragController = sap.ui.controller("qst4.controller.ProductList");
          oFragController.init(this._oParent);
          var oFragment = sap.ui.xmlfragment("detailListFragment", "qst4.view.ProductList", oFragController);
          var oLayout = this._oParent.getView().byId("detailFragment--detailLayout");
          oLayout.insertContent(oFragment, 99);
        },
        formatDate: function(sDate) {
          var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            format: "yMMMMd"
          });          
          return oDateFormat.format(sDate);
        },
        onOrderNumberChanged: function(oEvent) {
          var nValue = Number(oEvent.getParameter("selectedItem").getText());
          this._nNumber = nValue;
          var oText = this._oParent.getView().byId("detailFragment--preis");
          this._sCurrentPath = this._oParent.getView().byId("detail").getBindingContext().sPath;          

          var oModel = this._oParent.getOwnerComponent().getModel();
          oModel.read(this._sCurrentPath + "/Price", {
            success: function (oData) {
              var nPrice = Number(oData.Price);
              this._nPrice = nPrice;
              oText.setText("Aktueller Preis: "+ Number(nValue) * nPrice +"€");
            }
          });
        }, 
        onOrder: function () {
          if(!this._oDialog)
          {
              Fragment.load({
                  id: "dialog",
                  name: "qst4.view.OrderDialog", 
                  type: "XML",
                  controller: this}).then(function(oDialog){
                      this._oDialog = oDialog;    
                      this._oDialog.open();
                      console.log("Pfad: ", this._sCurrentPath);
                      this._oDialog.bindElement({path: this._sCurrentPath}); // /Products(0)
                  }.bind(this));
          } else {
              this._oDialog.open();
          }
        },
        onDialogClose: function(oEvent) {
            this._oDialog.close();
        }
      });
    }
  );
  