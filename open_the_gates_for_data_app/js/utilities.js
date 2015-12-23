// BANNER STAYING TOP

jQuery(document).ready(function(){
   
   var navOffset = jQuery("#staytop").offset().top;
   
   jQuery("#staytop").wrap('<div class="staytop-placeholder" id="test"></div>');
   jQuery(".staytop-placeholder").height(jQuery("#staytop").outerHeight());
   
   jQuery("#staytop").wrapInner('<div class="staytop-inner"></div>');
   
   jQuery(window).scroll(function(){
      var scrollPos = jQuery(window).scrollTop();
      
      if (scrollPos >= navOffset){
          jQuery("#test").addClass("fixed");
          jQuery(".header-wrapper").addClass("invDiv");
      } else {
          jQuery("#test").removeClass("fixed");
          jQuery(".header-wrapper").removeClass("invDiv");
      }
   });
});

// EXTENSIBLE DIVS

var a = true;
var b = true;
var c = true;
var d = true;

function expand1(){ 
    
    if ($(window).width() <= 767) {  
        if(a == true){
            document.getElementById("temperature").style.height = "20vh";
            document.getElementById("btn1").style.backgroundColor = "#CC6666";
            document.getElementById("btn1").style.color = "black";
            a = false;
        } else {
            document.getElementById("temperature").style.height = "0vh";
            document.getElementById("btn1").style.backgroundColor = "#485254";
            document.getElementById("btn1").style.color = "white";
            a = true;
        }
    } else {
        if(a == true){
            document.getElementById("temperature").style.height = "30vh";
            document.getElementById("btn1").style.backgroundColor = "#CC6666";
            document.getElementById("btn1").style.color = "black";
            a = false;
        } else {
            document.getElementById("temperature").style.height = "0vh";
            document.getElementById("btn1").style.backgroundColor = "#485254";
            document.getElementById("btn1").style.color = "white";
            a = true;
        }
    }   
}

function expand2(){ 
    if(b == true){
        document.getElementById("nearby").style.height = "60vh";
        document.getElementById("btn2").style.backgroundColor = "#CC6666";
        document.getElementById("btn2").style.color = "black";
        b = false;
        setTimeout(refreshMaps,301);    
    } else {
        document.getElementById("nearby").style.height = "0vh";
        document.getElementById("btn2").style.backgroundColor = "#485254";
        document.getElementById("btn2").style.color = "white";
        b = true;
    }
}

function expand3(){   
    if ($(window).width() <= 767) {  
        if(c == true){
            document.getElementById("share").style.height = "20vh";
            document.getElementById("btn3").style.backgroundColor = "#CC6666";
            document.getElementById("btn3").style.color = "black";
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            c = false;
    } else {
            document.getElementById("share").style.height = "0vh";
            document.getElementById("btn3").style.backgroundColor = "#485254";
            document.getElementById("btn3").style.color = "white";
            c = true;
    }
    } else {
        if(c == true){
            document.getElementById("share").style.height = "30vh";
            document.getElementById("btn3").style.backgroundColor = "##CC6666;";
            document.getElementById("btn3").style.color = "black";
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            c = false;
        } else {
            document.getElementById("share").style.height = "0vh";
            document.getElementById("btn3").style.backgroundColor = "#485254";
            document.getElementById("btn3").style.color = "white";
            c = true;
        }
    }   
}

function expand4(){   

    if(d == true){
        document.getElementById("moreinfo").style.height = "100%";
        document.getElementById("btnmoreinfo").style.backgroundColor = "#CC6666";
        document.getElementById("btnmoreinfo").innerHTML = "Less info";
        d = false;
        $('html,body').animate({
        scrollTop: $(".top").offset().top},
        'slow');
    } else {
        document.getElementById("moreinfo").style.height = "0px";
        document.getElementById("btnmoreinfo").style.backgroundColor = "#1C2D37";
        document.getElementById("btnmoreinfo").innerHTML = "More info";
        d = true;
        $('html,body').animate({
        scrollTop: $(".grid__wrapper").offset().top},
        'slow');
    }
}

// GOOGLE MAPS

function refreshMaps(){
        google.maps.visualRefresh = true;
		google.maps.event.trigger(window.map, 'resize');
}

// getJSON
var Utils = {
    // Get JSON from localstorage string by his/her namespace
    // Set JSON to localstorage string by his/her namespace
    store: function(namespace, data) {
        if(arguments.length > 1) {
            return localStorage.setItem(namespace, JSON.stringify(data));
        } else {
            var storedData = localStorage.getItem(namespace);
            return (storedData && JSON.parse(storedData)) || null;
        }
    },
    getJSONByPromise: function(url){
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if (xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    resolve(data);
                } else {
                    reject(status);
                }
            };
            xhr.onerror = function() {
                reject(Error("Network Error"));
            };
            xhr.send();
        });
    },
    getParamsFromUrl: function(url) {
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
        while(match = regex.exec(url)) {
            params[match[1]] = match[2];
        }
        return params;
    },
    getJSONPByPromise: function(url) {

        // Unique callback function
        url += new Date().getTime() + '_' + (Math.round(new Date().getTime()/Math.random()));
        
        var script = document.createElement('script');
        script.src = url;
        
        script.onload = function () {
            this.remove();
        };// After scripts is loaded and executed, remoe it from the DOM 
        
        var head = document.getElementsByTagName('head')[0];
        head.insertBefore(script, head.firstChild);// Insert script into the DOM
        
        var params = this.getParamsFromUrl(url);
        var callbackStr = 'json_callback';
        if(params['prefix']) {
            callbackStr = params['prefix'];
        } else if(params['callback']) {
            callbackStr = params['callback'];
        }     
        console.log(callbackStr);   
        return new Promise(function(resolve, reject) {
            window[callbackStr] = function(data) {
                resolve(data);
            }
        });
    },
    guid: function(){
        var i, random;
        var uuid = '';

        for (i = 0; i < 32; i++){
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    },
    pluralize: function (count, word) {
        return count === 1 ? word : word + 's';
    },
    trim: function(str){
        return str.replace(/^\s+|\s+$/gm,'');
    }
}


