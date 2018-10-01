var app = angular.module("myModule", ['ui.bootstrap']);

app.directive("filter", function() {

	var finalStr, rezStr = "", rezStr1 = "", rezStr2 = "", str, str1, str2;
	for (var i = 1; i < 5; i++) {
		str = "Aranžmani za " + i + " osobe";
		str2 = "Ponude za " + i + " nocenja";
		switch (i) {
    		case -1:	
				str = "Aranžmani za sve osobe";
				str1 = "Sve cene";
				str2 = "Aranžmani za sve dane";
        		break;
    		case 0:
        		continue;
        		break;
        	case 1:
				str = "Aranžmani za 1 osobu";
				str1 = "Cene do 5.000 RSD";
				str2 = "Ponude za 1 nocenje";
        		break;
			case 2:
				str1 = "Cene od 5.001 do 10.000 RSD";
				break;
			case 3:
				str1 = "Cene od 10.001 RSD";
				break;
		} 
		rezStr = rezStr + "<a href=\"#\" ng-click=\"myController.filterKolicine(" + i +
        		")\"ng-class=\"{\'aktivan\':myController.brojOsoba==" + i + 
        		"}\"class=\"list-group-item\">" + str + 
        		"<span style=\"z-index=2;\" ng-if=\"myController.brojOsoba==" + i +
        		 "\"class=\"glyphicon glyphicon-ok-circle\"></span></a>";
        rezStr2 = rezStr2 + "<a href=\"#\" ng-click=\"myController.filterDana(" + i +
				")\"ng-class=\"{\'aktivan\':myController.brojDana==" + i +
				"}\"class=\"list-group-item\">" + str2 + 
				"<span style=\"z-index=2;\" ng-if=\"myController.brojDana==" + i +
        		 "\"class=\"glyphicon glyphicon-ok-circle\"></span></a>";
        if (i == 4) { continue; }
        rezStr1 = rezStr1 + "<a href=\"#\" ng-click=\"myController.filterCena(" + i +
        		")\"ng-class=\"{\'aktivan\':myController.cena==" + i + 
        		"}\"class=\"list-group-item\">" + str1 + 
        		"<span style=\"z-index=2;\" ng-if=\"myController.cena==" + i +
        		 "\"class=\"glyphicon glyphicon-ok-circle\"></span></a>";
    }
    str = "<div class=\"list-group\">";
    str1 = "</div>";
    finalStr = str + rezStr1 + str1 + str + rezStr + str1 + str + rezStr2 + str1;
    return {
       	template : finalStr
    }
});

app.controller("myCtrl", function($scope, $window, $http, $uibModal) {

	var myController = this;
	var vm = this;
	
	vm.message = '';
	myController.searchText = "";

	myController.svi_proizvodi = [];
	myController.proizvodi = [];

	$scope.carts=[];
	$window.message = "";


	vm.cena = 0;
	//   inicijalno ucitavanje//
	

	myController.selektujProizvod = function(proizvod) {
		vm.kategorija = proizvod.kategorija;
		vm.proizvod = proizvod;					      
	};

	myController.init = function() {
		var req = {
			method: "GET",
		  	url: "/smestaj.json"
		}
		$http(req).then(function(resp){
			console.log(resp);
			myController.svi_proizvodi = resp.data;
			myController.kategorija = '-1';
			myController.brojOsoba = -1;
			myController.brojDana = -1;
			myController.cena = -1;
			myController.ocena = -1;
			//for (var i in myController.svi_proizvodi) {
				//var proizvod = myController.svi_proizvodi[i];			  	
			//	myController.proizvodi.push(proizvod);				
			//}
			myController.proizvodi = myController.svi_proizvodi;
			vm.proizvod = null;
		}, function(resp) {
			vm.message = 'error';
		});
	};


	//  sortiranje cene

	myController.cena = -1;
	myController.filterCena = function (el) {
		
		if (vm.cena != el) {
			vm.cena = el;
			var tmp = vm.svi_proizvodi,
			rez = [];
			for (var i in tmp) {
				if 	(((vm.brojDana == tmp[i].brojDana) || (vm.brojDana == -1)) &&
					 ((vm.brojOsoba == tmp[i].brojOsoba) || (vm.brojOsoba == -1)) &&
					 ((vm.ocena == tmp[i].ocena) || (vm.ocena == -1)) &&
					 ((vm.kategorija == tmp[i].kategorija) || (vm.kategorija == '-1')) &&
					(((vm.cena == 1) && (tmp[i].cena > 0) && (tmp[i].cena <= 5000)) ||
					 ((vm.cena == 2) && (tmp[i].cena > 5000) && (tmp[i].cena <= 10000)) ||
					 ((vm.cena == 3) && (tmp[i].cena > 10000))))					
				{
					rez.push(tmp[i]);
				}
			}
			vm.proizvodi = rez;
		}
	};


	//Sortiranje kategorije 

	myController.kategorija = -1;
	myController.filterKategorija = function (kategorija) {
		
		if (vm.kategorija != kategorija) {
			vm.kategorija = kategorija;
			var tmp = vm.svi_proizvodi,
			rez = [];
			for (var i in tmp) {
				if 	(((vm.brojDana == tmp[i].brojDana || vm.brojDana == -1)) &&
					 ((vm.cena == tmp[i].cena || vm.cena == -1)) &&
					 ((vm.ocena == tmp[i].ocena || vm.ocena == -1)) &&
					 ((vm.brojOsoba == tmp[i].brojOsoba || vm.brojOsoba == -1)) &&	
					 (vm.kategorija == tmp[i].kategorija))
				{
					rez.push(tmp[i]);
				}
			}
			vm.proizvodi = rez;
		}
	};
	
	//sortiranje ocene

	myController.brojOsoba = -1;
	myController.filterKolicine = function (el) {
		
		if (vm.brojOsoba != el) {
			vm.brojOsoba = el;
			var tmp = vm.svi_proizvodi,
			rez = [];
			for (var i in tmp) {
				if 	(((vm.brojDana == tmp[i].brojDana) || (vm.brojDana == -1)) &&
					 ((vm.cena == tmp[i].cena) || (vm.cena == -1)) &&
					 ((vm.ocena == tmp[i].ocena) || (vm.ocena == -1)) &&
					 ((vm.kategorija == tmp[i].kategorija) || (vm.kategorija == '-1')) &&
					 (vm.brojOsoba == tmp[i].brojOsoba))
				{
					rez.push(tmp[i]);
				}
			}
			vm.proizvodi = rez;
		}
	};
	
	
	//====== FIlter  Broja Dana===============//

	myController.brojDana = -1;
	
	myController.filterDana = function (el) {
		
		if (vm.brojDana != el) {
			vm.brojDana = el;
			var tmp = vm.svi_proizvodi,
			rez = [];
			for (var i in tmp) {
				if 	(((vm.ocena == tmp[i].ocena) || (vm.ocena == -1)) &&
					 ((vm.cena == tmp[i].cena) || (vm.cena == -1)) &&
					 ((vm.brojOsoba == tmp[i].brojOsoba) || (vm.brojOsoba == -1)) &&
					 ((vm.kategorija == tmp[i].kategorija) || (vm.kategorija == '-1')) &&					 
					 (vm.brojDana == tmp[i].brojDana))
				{
					rez.push(tmp[i]);
				}
			}
			vm.proizvodi = rez;
		}
	};
	
	
	
	
	

	myController.ocena = -1;
	myController.filterOcene = function (el) {
		
		if (vm.ocena != el) {
			vm.ocena = el;
			var tmp = vm.svi_proizvodi,
			rez = [];
			for (var i in tmp) {
				if 	(((vm.brojDana == tmp[i].brojDana) || (vm.brojDana == -1)) &&
					 ((vm.brojOsoba == tmp[i].brojOsoba) || (vm.brojOsoba == -1)) &&
					 ((vm.cena == tmp[i].cena) || (vm.cena == -1)) &&
					 ((vm.kategorija == tmp[i].kategorija) || (vm.kategorija == '-1')) &&
					 (vm.ocena == tmp[i].ocena))
				{
					rez.push(tmp[i]);
				}
			}
			vm.proizvodi = rez;
		}
	};

	myController.listaKategorija = [];
	myController.kategorijeProizvoda = {};

	myController.kategorija = null;
	myController.proizvod = null;

	$scope.alerts = [];

	$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
	};

	// dodavanje u korpu
	

	$scope.add_cart = function(proizvod) {
		if (proizvod.kolicina > 0) {
			$scope.carts.push({id: proizvod.id, naziv: proizvod.naziv, cena: proizvod.cena});
			proizvod.kolicina--;
		}
	};


	$scope.total = 0;

	$scope.setTotals = function(cart) {
		if (cart) {
			$scope.total += cart.cena;
		}
	};

	// uklanjanje iz korpe
	$scope.remove_cart = function(cart) {
		if (cart) {
			$scope.carts.splice($scope.carts.indexOf(cart), 1);
			$scope.total -= cart.cena;						
			for (var i = 0; i < myController.proizvodi.length; i++) { 
				if (myController.proizvodi[i].id == cart.id) {
					myController.proizvodi[i].kolicina++;
				}
			}
		}
	};

				myController.currentPage = 1;
				myController.itemsPerPage = 8;
				myController.totalItems = 25;
				myController.maxSize = 10;
				myController.korisnikPrijavljenUser = false;
				myController.korisnikPrijavljenAdmin = false;
				myController.users = [];

	//prijavljivanje korisnika

	myController.getUsers = function() {
			var request = {
			method: "GET",
			url: "/users.json"
			}
			$http(request).then(function(response){
				for(var i in response.data){
				var user = response.data[i];
				myController.users.push(user);
				};
			}, function(response) {
				myController.message = 'error';
			});
	}; 

	myController.login = function () {
		var modalInstance = $uibModal.open({
    		animation: true,
   			templateUrl: 'myModalContent.html',
   			controller: function($uibModalInstance, parent){
       			var $ctrl = this;

       			myController.getUsers();
    			$ctrl.stanje = 'Login';
    			$ctrl.username = '';
    			$ctrl.password = '';
   	 			$ctrl.poruka = '';

    			$ctrl.login = function(){
    				for (var i in myController.users) {
    					var user = myController.users[i];
    					if ($ctrl.username === user.username) {
      						if ($ctrl.password === user.password) {
        						myController.ulogovanKorisnik = {
         							username: user.username,
          							password: user.password,
			                     	type: user.type,
			                      	name: user.name,
			                      	img: user.img,
			                      	//rezervacije: user.rezervacije
			                    };
        						if (user.type === 'user') {
          							myController.korisnikPrijavljenUser = true;
		                    	} else if (user.type === 'admin') {
		                      		myController.korisnikPrijavljenAdmin = true;
		                    	};
			                    $window.localStorage.setItem('user', $ctrl.username);
			                    $uibModalInstance.close($ctrl.username);
			                    console.log("LOGIN uspesan!");
			                    return vm.message = "Prijavljen je korisnik: " + $ctrl.username;
      						}
    					}
  					}	                			
    			}

        		$ctrl.register = function(){
          			$uibModalInstance.close($ctrl.username);
        		}

       			 $ctrl.cancel = function () {
        		    $uibModalInstance.dismiss('cancel');
        		};
    		},
    		controllerAs: '$ctrl',
    		resolve: {
      			parent: function () {
        			return myController;
      			}
    		}
  		});

  		modalInstance.result.then(function (username) {
    		console.log(username);
			console.log(vm.message);
  		}, function () {
    		console.log('modal-component dismissed at: ' + new Date());
  		});
	};
	

	// odjava

	myController.logout = function() {
  		//$ctrl.password = "";
  		vm.message = "";
  		myController.korisnikPrijavljenUser = false;
    	myController.korisnikPrijavljenAdmin = false;
    	$window.localStorage.removeItem('user');
  		return vm.message = "Niste prijavljeni.";
	};


	// kupovina

	myController.checkout = function() {
		console.log($scope.carts);
		if (myController.korisnikPrijavljenAdmin == true || myController.korisnikPrijavljenUser == true) {
			if ($scope.carts.length > 0) {
				return vm.message = "Vasa kupovina je prosledjena"
			} else {
				return vm.message = "Korpa je prazna"
			}
			//parent.korisnikPrijavljenUser = false;
			//parent.korisnikPrijavljenAdmin = false;
		} else {
			myController.login();
			return vm.message="Morate biti ulogovani da bi izvrsili kupovinu";
		}
	};

	myController.init();
});