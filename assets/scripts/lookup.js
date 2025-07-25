var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

var msLookupLocal = {
    "pn": "Tomodachi Life",
    "pid": "871968",
    "ws": "Home/Games/Nintendo 3DS",
    "pt": "Microsite",
    "url": {
        "DE_AT": "https://web.archive.org/web/20240819161237/http://www.nintendo.at/Spiele/Nintendo-3DS/Tomodachi-Life-871968.html",
        "DE_CH": "https://web.archive.org/web/20240819161237/http://www.nintendo.ch/de/Spiele/Nintendo-3DS/Tomodachi-Life-871968.html",
        "DE_DE": "https://web.archive.org/web/20240819161237/http://www.nintendo.de/Spiele/Nintendo-3DS/Tomodachi-Life-871968.html",
        "EN_GB": "https://web.archive.org/web/20240819161237/http://www.nintendo.co.uk/Games/Nintendo-3DS/Tomodachi-Life-871968.html",
        "EN_ZA": "https://web.archive.org/web/20240819161237/http://www.nintendo.co.za/Games/Nintendo-3DS/Tomodachi-Life-871968.html",
        "ES_ES": "https://web.archive.org/web/20240819161237/http://www.nintendo.es/Juegos/Nintendo-3DS/Tomodachi-Life-871968.html",
        "FR_BE": "https://web.archive.org/web/20240819161237/http://www.nintendo.be/fr/Jeux/Nintendo-3DS/Tomodachi-Life-871968.html",
        "FR_FR": "https://web.archive.org/web/20240819161237/http://www.nintendo.fr/Jeux/Nintendo-3DS/Tomodachi-Life-871968.html",
        "FR_CH": "https://web.archive.org/web/20240819161237/http://www.nintendo.ch/fr/Jeux/Nintendo-3DS/Tomodachi-Life-871968.html",
        "IT_IT": "https://web.archive.org/web/20240819161237/http://www.nintendo.it/Giochi/Nintendo-3DS/Tomodachi-Life-871968.html",
        "IT_CH": "https://web.archive.org/web/20240819161237/http://www.nintendo.ch/it/Giochi/Nintendo-3DS/Tomodachi-Life-871968.html",
        "NL_BE": "https://web.archive.org/web/20240819161237/http://www.nintendo.be/nl/Spellen/Nintendo-3DS/Tomodachi-Life-871968.html",
        "NL_NL": "https://web.archive.org/web/20240819161237/http://www.nintendo.nl/Spellen/Nintendo-3DS/Tomodachi-Life-871968.html",
        "PT_PT": "https://web.archive.org/web/20240819161237/http://www.nintendo.pt/Jogos/Nintendo-3DS/Tomodachi-Life-871968.html",
        "RU_RU": "https://web.archive.org/web/20240819161237/http://www.nintendo.ru/-/Nintendo-3DS/Tomodachi-Life-871968.html"
    },
    "config": {
        "pagetype": 2,
        "modClickSearch": 0,
        "modClick": 0,
        "modView": 0
    }
};

var trackedElements = {
    
    permanent : {
        
    },

    static : {
        //".slider .ol li": function (e){ return e.parent().parent().find("ul li.active h2").text(); },
        ".logo-3ds" : "Nintendo 3DS",
        ".logo-2ds" : "Nintendo 2DS",
        ".store-link" : "Nintendo UK Online Store",

        ".agerating" : "Age rating",
        ".eshop" : "Nintendo eShop",
    },

    live: {
        // "#popup .close, #popup-overlay" : "Close popup"
    },

    sectionNames: {
        /*"home" : "Home",
        "meetyoshiIntro" : "Meet Yoshi/Intro",
        "meetyoshiHelpfulhero" : "Meet Yoshi/A Helpful Hero",
        "meetyoshiEggmunition" : "Meet Yoshi/Eggmunition",
        "meetyoshiTransformations" : "Meet Yoshi/Transformations",
        "meetyoshiPowerups" : "Meet Yoshi/Power-Ups",
        "newislandWelcome" : "The New Island/Welcome To Egg Island",
        "newislandExplore" : "The New Island/Explore The Island",
        "newislandEnemies" : "The New Island/Know Your Enemies",
        "newislandGoods" : "The New Island/Get The Goods",
        "twoplayer" : "Two-Player Fun",
        "galleryextrasScreenshots" : "Gallery & Extras/Screenshots",
        "galleryextrasVideos" : "Gallery & Extras/Videos",
        "galleryextrasExtras" : "Gallery & Extras/Extras"*/
    }

};

function getTrackingTag(e, key, value) {
    if (value === true) return e.text(); 
    else if (typeof value == 'string' || value instanceof String) return value;
    else return value(e);
}

$(function(){
    
    //Permanent (Header, Footer, Mainmenu)
    $.each(trackedElements.permanent, function(key, value){
        $(key).click(function(){
            zog.manual.send({pos: getTrackingTag(this, key, value) }, this);
        });
    });

    //Static (Links, Popuplinks, Slider)
    $.each(trackedElements.static, function(key, value){
        $(key).click(function(){
            // var curSection = sk.detect.getHash();
            // curSection = trackedElements.sectionNames[curSection];

            // var tPos = curSection + "/" + getTrackingTag($(this), key, value);
            var tPos = getTrackingTag($(this), key, value);
            zog.manual.send({pos: tPos }, this);
            //debug.info(tPos);
        });
    });

    $.each(trackedElements.live, function(key, value){
        $('body').on('click', key, function(){
            // var curSection = sk.detect.getHash();
            // curSection = trackedElements.sectionNames[curSection];

            //var tPos = curSection + "/" + getTrackingTag($(this), key, value);
            var tPos = getTrackingTag($(this), key, value);
            zog.manual.send({pos: tPos }, this);
        });
    });
    
});



}
/*
     FILE ARCHIVED ON 16:12:37 Aug 19, 2024 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 11:17:50 Apr 05, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.471
  exclusion.robots: 0.017
  exclusion.robots.policy: 0.008
  esindex: 0.01
  cdx.remote: 17.072
  LoadShardBlock: 155.238 (3)
  PetaboxLoader3.datanode: 153.487 (4)
  PetaboxLoader3.resolve: 194.665 (2)
  load_resource: 227.573
*/