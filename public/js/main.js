angular.module('invoicing', [])

// The default logo for the invoice
.constant('DEFAULT_LOGO', 'images/metaware_logo.png')

// The invoice displayed when the user first uses the app
.constant('DEFAULT_INVOICE', {
  subTotal:0,
  totalAfterDiscount:0,
  totalTax:0,
  grandTotal:0,
  tax :{
    sgst: 14,
    cgst: 14,
    igst: 0
  },
  discount: 0.00,
  pf: 0,
  invoice_number: 0,
  customer_info: {
    name: '',
    web_link: '',
    address1: '',
    address2: '',
    postal: '',
    gstin: 0,
    ponumber: 0,
    whetherReverseTax: false
  },
  company_info: {
    name: 'Imeprial Paints',
    web_link: 'Manufacturer of Industrial & Decorative Paints, Varnishes & Thinner',
    address1: 'L-322/16-3, 40 Shed Area, GIDC, Vapi - 396195',
    address2: 'Ph: 0260-2451674 Email: imperial.paints@yahoo.co.in',
    postal: 'GSTIN No: 24ABZPC8546P1ZQ'
  },
  items:[
    
  ],
  invoice_date: moment().format("DD/MM/YYYY"),
  dispatch_mode: "",
  vehicle_number: "",
  dispatch_time: "",
  dispatch_date: ""
})

// Service for accessing local storage
.service('LocalStorage', [function() {

  var Service = {};

  // Returns true if there is a logo stored
  var hasLogo = function() {
    return !!localStorage['logo'];
  };

  // Returns a stored logo (false if none is stored)
  Service.getLogo = function() {
    if (hasLogo()) {
      return localStorage['logo'];
    } else {
      return false;
    }
  };

  Service.setLogo = function(logo) {
    localStorage['logo'] = logo;
  };

  // Checks to see if an invoice is stored
  var hasInvoice = function() {
    return !(localStorage['invoice'] == '' || localStorage['invoice'] == null);
  };

  // Returns a stored invoice (false if none is stored)
  Service.getInvoice = function() {
    if (hasInvoice()) {
      return JSON.parse(localStorage['invoice']);
    } else {
      return false;
    }
  };

  Service.setInvoice = function(invoice) {
    localStorage['invoice'] = JSON.stringify(invoice);
  };

  // Clears a stored logo
  Service.clearLogo = function() {
    localStorage['logo'] = '';
  };

  // Clears a stored invoice
  Service.clearinvoice = function() {
    localStorage['invoice'] = '';
  };

  // Clears all local storage
  Service.clear = function() {
    localStorage['invoice'] = '';
    Service.clearLogo();
  };

  return Service;

}])

.service('Currency', [function(){

  var service = {};

  service.all = function() {
    return [
      {
        name: 'British Pound (£)',
        symbol: '£'
      },
      {
        name: 'Canadian Dollar ($)',
        symbol: 'CAD $ '
      },
      {
        name: 'Euro (€)',
        symbol: '€'
      },
      {
        name: 'Indian Rupee (₹)',
        symbol: '₹'
      },
      {
        name: 'Norwegian krone (kr)',
        symbol: 'kr '
      },
      {
        name: 'US Dollar ($)',
        symbol: '$'
      }
    ]
  }

  return service;
  
}])

// Main application controller
.controller('InvoiceCtrl', ['$scope', '$http', 'DEFAULT_INVOICE', 'DEFAULT_LOGO', 'LocalStorage', 'Currency',
  function($scope, $http, DEFAULT_INVOICE, DEFAULT_LOGO, LocalStorage, Currency) {

  // Set defaults
  $scope.currencySymbol = '₹';
  $scope.logoRemoved = false;
  $scope.printMode   = false;

  (function init() {
    // Attempt to load invoice from local storage
    !function() {
      var invoice = LocalStorage.getInvoice();
      $scope.invoice = invoice ? invoice : DEFAULT_INVOICE;
    }();

    // Set logo to the one from local storage or use default
    !function() {
      var logo = LocalStorage.getLogo();
      $scope.logo = logo ? logo : DEFAULT_LOGO;
    }();

    $scope.availableCurrencies = Currency.all();
    $http.get("http://192.168.225.158:8080/count").then( function(response) {
       $scope.invoice.invoice_number = response.data.count;
    });
  })()
  // Adds an item to the invoice's items
  $scope.addItem = function() {
    $scope.invoice.items.push({ qty:0, cost:0, description:"" });
  }

  // Toggle's the logo
  $scope.toggleLogo = function(element) {
    $scope.logoRemoved = !$scope.logoRemoved;
    LocalStorage.clearLogo();
  };

  // Triggers the logo chooser click event
  $scope.editLogo = function() {
    // angular.element('#imgInp').trigger('click');
    document.getElementById('imgInp').click();
  };

  $scope.printInfo = function() {
    window.print();
  };

  $scope.saveInfo = function() {
    var data = LocalStorage.getInvoice();
    console.log(data);
    $http.post("http://192.168.225.158:8080/invoice/"+$scope.invoice.invoice_number, data, {}).then( function(response) {
       //console.log(response);
    });
    //console.log(data);
  };

  // Remotes an item from the invoice
  $scope.removeItem = function(item) {
    $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
  };

  // Calculates the sub total of the invoice
  $scope.invoiceSubTotal = function() {
    var total = 0.00;
    angular.forEach($scope.invoice.items, function(item, key){
      total += (item.qty * item.cost);
    });
    $scope.invoice.subTotal = total;
    return $scope.invoice.subTotal;
  };

  $scope.invoiceSubTotalWithDiscount = function() {
    $scope.invoice.totalAfterDiscount = ($scope.invoiceSubTotal() - $scope.invoice.discount);
    return $scope.invoice.totalAfterDiscount;
  };
  


  $scope.invoiceSubTotalWithSGST = function() {
    return ($scope.invoice.totalAfterDiscount * $scope.invoice.tax.sgst/100);
  };
  $scope.invoiceSubTotalWithCGST = function() {
    return ($scope.invoice.totalAfterDiscount * $scope.invoice.tax.cgst/100);
  };
  $scope.invoiceSubTotalWithIGST = function() {
    return ($scope.invoice.totalAfterDiscount * $scope.invoice.tax.igst/100);
  };
  
  // Calculates the tax of the invoice
  $scope.calculateTax = function() {
    $scope.invoice.totalTax = $scope.invoiceSubTotalWithSGST() + $scope.invoiceSubTotalWithCGST() + $scope.invoiceSubTotalWithIGST();
    return $scope.invoice.totalTax;
  };


  // Calculates the grand total of the invoice
  $scope.calculateGrandTotal = function() {
    $scope.invoice.grandTotal =  $scope.calculateTax() + $scope.invoiceSubTotalWithDiscount() +  parseFloat($scope.invoice.pf);
    saveInvoice();
    return $scope.invoice.grandTotal;
  };

  // Clears the local storage
  $scope.clearLocalStorage = function() {
    var confirmClear = confirm('Are you sure you would like to clear the invoice?');
    if(confirmClear) {
      LocalStorage.clear();
      setInvoice(DEFAULT_INVOICE);
      $http.get("http://192.168.225.158:8080/count").then( function(response) {
       $scope.invoice.invoice_number = response.data.count;
      });
    }
  };

  // Sets the current invoice to the given one
  var setInvoice = function(invoice) {
    $scope.invoice = invoice;
    saveInvoice();
  };

  // Reads a url
  var readUrl = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('company_logo').setAttribute('src', e.target.result);
        LocalStorage.setLogo(e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  };

  // Saves the invoice in local storage
  var saveInvoice = function() {
    LocalStorage.setInvoice($scope.invoice);
  };

  // Runs on document.ready
  angular.element(document).ready(function () {
    // Set focus
    document.getElementById('invoice-number').focus();

    // Changes the logo whenever the input changes
    document.getElementById('imgInp').onchange = function() {
      readUrl(this);
    };
  });

}])
