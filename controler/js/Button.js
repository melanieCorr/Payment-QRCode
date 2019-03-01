/**
	* @nocollapse
**/

class Button {

	/**
		* @constructor
		* @param {function} fonc: name of a function
	**/
 	constructor(fonc){
 		var btnSell = document.getElementById('sell');
 		var btnBuy = document.getElementById('buy');
 		
 		this.btnSell = btnSell;
 		this.btnBuy = btnBuy;

 		this.addListeners();
 		this.btnSell.addEventListener("click", fonc);
 		this.btnBuy.addEventListener("click", fonc);
 	}

 	/**
		* @method addListeners: Buton operation with addEventListener
 	**/
 	addListeners(){
 		this.btnSell.addEventListener("click", function(){
 			window.location.href = "/Sell";
 		});
 		this.btnBuy.addEventListener("click", function(){
 			window.location.href = "/Buy";
 		});
 	}
}

var sell = new Button();
var buy = new Button();
