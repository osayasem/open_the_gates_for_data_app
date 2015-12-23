window.onload = loadMaps;

function loadMaps(){
	
	// api via ajax call	
	$.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBksc-rWJpuf88ntod5gJtcbVMEseENySE", function(data) {
		
		// get latitude and longitude from current location
		var latitude  = data.location.lat;
		var longitude = data.location.lng;
		var myLatLng = data["location"];
		
		// show google maps and center at current position
		var map = window.map = new google.maps.Map(document.getElementById('nearby'), {
			center: myLatLng,
			zoom: 16
		});
		google.maps.visualRefresh = true;
		google.maps.event.trigger(map, 'resize');
		
		// choose location, radius & type for google place API
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: 'Your current position'
		});
		
		// add places on map
		var request = {
			location: myLatLng,
			radius: '1000',
			types: ['store']
		};
		
		// show google places
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, function(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				var place = results[i];
				var marker2 = new google.maps.Marker({
				map: map,
				position: place.geometry.location
				});
			}
			}
		});
		
		// get landcode from current position and load the data from current position
		var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude+","+longitude + "&key=AIzaSyBksc-rWJpuf88ntod5gJtcbVMEseENySE&location_type=GEOMETRIC_CENTER"; //current position
		$.get(url, function(data2) { 
				var landcode = data2.results[0].address_components[4].short_name;
				var country = data2.results[0].address_components[4].long_name;
				country = country.toUpperCase();
				var city = data2.results[0].address_components[1].short_name;
				document.getElementById("place").innerHTML = city + " (" + country + ")";
				landcode = landcode.toLowerCase();
				loadDataFromLandcode(landcode); // do everything when landcode is loaded					
		});				
	});			
}
function loadDataFromLandcode(landcode){ 
	init(landcode);
	loadForrest();
  	loadForrestProcent();
  	loadCo2();
  	loadDiesel();
  	loadGasoline();
	loadCountries();
	loadWeather(landcode);
}

function init(landcode) {
	
	// generate data set urls from landcode with standard value the current location
	this.WBFORRESTAREAAPIURL = "http://api.worldbank.org/countries/" + landcode + "/indicators/AG.LND.TOTL.K2?per_page=400&date=2011&format=jsonP&prefix=jsonp_callback";
	this.WBFORRESTPROCENTAPIURL = "http://api.worldbank.org/countries/" + landcode + "/indicators/AG.LND.AGRI.ZS?per_page=40&date=2000:2013&format=jsonP&prefix=jsonp_callback";
	this.WBCOAPIURL = "http://api.worldbank.org/countries/" + landcode + "/indicators/EN.ATM.CO2E.KT?per_page=400&date=2011&format=jsonP&prefix=jsonp_callback";		
	this.WBDIESELAPIURL = "http://api.worldbank.org/countries/" + landcode + "/indicators/EP.PMP.DESL.CD?per_page=10&date=2014&format=jsonP&prefix=jsonp_callback";
	this.WBDGASOLINEAPIURL = "http://api.worldbank.org/countries/" + landcode + "/indicators/EP.PMP.SGAS.CD?per_page=10&date=2014&format=jsonP&prefix=jsonp_callback";
	
	this._hbsCache = {};// Handlebars cache for templates
	this._hbsPartialsCache = {};// Handlebars cache for partials
}

function loadForrest() {
	var url = this.WBFORRESTAREAAPIURL;
	Utils.getJSONPByPromise(url).then(
	 	function(data) {
	 		if(data != null) {
	 			var waarde = data[1][0].value;
	 			waarde = parseInt(data[1][0].value);
	 			waarde = (waarde/1000).toFixed(0);
	 			var string = waarde.toString(); 
	 			document.getElementById("info_forest_km").innerHTML = string + " km&#178";
	 		}	
	 	},
	 	function(status) {
	 		console.log("status");
	 	}
	 );
}

function loadForrestProcent() {
	var url = this.WBFORRESTPROCENTAPIURL;
	Utils.getJSONPByPromise(url).then(
	 	function(data) {
	 		if(data != null) {
	 			var waarde = data[1][0].value;
	 			waarde = parseInt(data[1][0].value);
	 			waarde = waarde.toFixed(0);
	 			var string = waarde.toString();
	 			document.getElementById("info_forest_procent").innerHTML = string + " %";
	 		}	
	 	},
	 	function(status) {
	 		console.log("status");
	 	}
	 );
}	
	
function loadCo2() {
	var url = this.WBCOAPIURL;
	Utils.getJSONPByPromise(url).then(
	 	function(data) {
	 		if(data != null) {
	 			var waarde = data[1][0].value;
	 			waarde = parseInt(waarde);
	 			waarde = (waarde/1000).toFixed(1);
	 			var string = waarde.toString();
	 			document.getElementById("info_co2").innerHTML = string + " Kt";
	 		}	
	 	},
	 	function(status) {
	 		console.log("status");
	 	}
	 );
}

function loadDiesel() {
	var url = this.WBDIESELAPIURL;
	Utils.getJSONPByPromise(url).then(
	 	function(data) {
	 		if(data != null) {
	 			var waarde = data[1][0].value;			
				waarde = (waarde * 0.917).toFixed(2);
	 			var string = waarde.toString();
					document.getElementById("info_diesel").innerHTML = string + " €";
	 		}	
	 	},
	 	function(status) {
	 		console.log("status");
	 	}
	 );
}

function loadGasoline() {
	var url = this.WBDGASOLINEAPIURL;
	Utils.getJSONPByPromise(url).then(
	 	function(data) {
	 		if(data != null) {
	 			var waarde = data[1][0].value;
				waarde = (waarde * 0.917).toFixed(2);
				var string = waarde.toString();
	 			document.getElementById("info_gasoline").innerHTML = string + " €";
	 		}	
	 	},
	 	function(status) {
	 		console.log("status");
	 	}
	 );
}



function loadCountries() {

	var dropdownLanden = document.getElementById("landenLijst");
	$.getJSON("js/landen.json", function(data) {

		var countryList = new Array();
		var countryKeyList = new Array();
		
		$.each(data, function(key, value) {
			countryList.push(value);
			countryKeyList.push(key)
		});
		 
		var aantal = countryList.length - 1;
		
		for (var i=0; i<= aantal; i++){
			var option = document.createElement("option");
			option.value = countryKeyList[i];
			option.text = countryList[i];
			dropdownLanden.add(option);

		}	
	});
}

function loadWeather(landcode){
	var url = "http://api.openweathermap.org/data/2.5/forecast?q=" + landcode + "&mode=json&appid=e26365507b8580d83af957e8bf87fac4";
	$.get(url, function(data) { 	
	
		var d = new Date();
		var temp = new Array();
		
		temp[0] = ((data.list[0].main.temp) - 273).toFixed(1);
		temp[1] = ((data.list[6].main.temp) - 273).toFixed(1);
		temp[2] = ((data.list[12].main.temp) - 273).toFixed(1);
		temp[3] = ((data.list[18].main.temp) - 273).toFixed(1);
		temp[4] = ((data.list[24].main.temp) - 273).toFixed(1);
		temp[5] = ((data.list[30].main.temp) - 273).toFixed(1);
		temp[6] = ((data.list[36].main.temp) - 273).toFixed(1);	
		
		document.getElementById("maandag").innerHTML = temp[0] + " °C";
		document.getElementById("dinsdag").innerHTML = temp[1] + " °C";
		document.getElementById("woensdag").innerHTML = temp[2] + " °C";
		document.getElementById("donderdag").innerHTML = temp[3] + " °C";
		document.getElementById("vrijdag").innerHTML = temp[4] + " °C";
		document.getElementById("zaterdag").innerHTML = temp[5] + " °C";
		document.getElementById("zondag").innerHTML = temp[6] + " °C";

		switch (d.getDay()) {
			case 0:
				document.getElementById("zo").className += " active";
				document.getElementById("btn1").innerHTML = temp[6] + " °C";				
				break;
			case 1:
				document.getElementById("ma").className += " active";
				document.getElementById("btn1").innerHTML = temp[0] + " °C";				
				break;
			case 2:
				document.getElementById("di").className += " active";
				document.getElementById("btn1").innerHTML = temp[1] + " °C";				
				break;
			case 3:
				document.getElementById("wo").className += " active";
				document.getElementById("btn1").innerHTML = temp[2] + " °C";				
				break;
			case 4:
				document.getElementById("do").className += " active";
				document.getElementById("btn1").innerHTML = temp[3] + " °C";				
				break;
			case 5:
				document.getElementById("vr").className += " active";
				document.getElementById("btn1").innerHTML = temp[4] + " °C";				
				break;
			case 6:
				document.getElementById("za").className += " active";
				document.getElementById("btn1").innerHTML = temp[5] + " °C";
				break;
		}							
	});
}

function updateContent(){
	var dropdownLanden = document.getElementById("landenLijst");
	var landcode = dropdownLanden.options[dropdownLanden.selectedIndex].value;
	
	loadDataFromLandcode(landcode);
}

