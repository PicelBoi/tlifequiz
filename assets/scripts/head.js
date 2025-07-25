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

/*! Nintendo-Clone-Web 2014-06-04 */
(function (global) {
    'use strict';
    var Modernizr = global.Modernizr;

    /**
     * ************  Pointer Event API  ******************************
     * ---------------------------------------------------------------
     * IE10/legacy/ms                           | IE11/w3c
     * ------------------------                 | --------------------
     * MSPointerDown event                      | pointerdown event
     * MSPointerUp @event                       | pointerup event
     * MSPointerCancel event                    | pointercancel event
     * MSPointerMove event                      | pointermove event
     * MSPointerOver event                      | pointerover event
     * MSPointerOut event                       | pointerout event
     * MSPointerEnter event                     | pointerenter event
     * MSPointerLeave event                     | pointerleave event
     * MSGotPointerCapture event                | gotpointercapture event
     * MSLostPointerCapture event               | lostpointercapture event
     * -ms-touch-action CSS property            | touch-action CSS property
     * element.style.msTouchAction property     | element.style.touchAction property
     * onmspointer* attributes                  | onpointer* attributes
     * element.msSetPointerCapture() method     | element.setPointerCapture() method
     * element.msReleasePointerCapture() method | element.releasePointerCapture() method
     * msMaxTouchPoints                         | maxTouchPoints
     *
     * ---------------------------------------------------------------
     * NOTE: When listening for pointer events, listen for both the
     * legacy and the w3c variants. (i.e. $foo.on('MSPointerDown pointerdown', fn));
     * 
     */
    

    /**
     * General check for js pointer events. NOTE: this is not the same as the css
     * pointer-event property. 
     * SEE: http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
     */
    Modernizr.addTest('jsPointerEvents', function () {
      return window.MSPointerEvent || window.PointerEvent;
    });

    /**
     * Check specifically for legacy pointer events (IE10 on surface)
     * SEE: http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
     */
    Modernizr.addTest('msPointerEvents', function () {
      return window.MSPointerEvent;
    });

}(this));

(function (global) {
    var ua = window.navigator.userAgent,
        dsHome = '/mobile/ds/',
        isWiiU = ua.indexOf('Nintendo WiiU') > 0,
        isDS = (ua.indexOf('Nintendo 3DS') > 0 ||
               ua.indexOf('Nintendo DS') > 0);

    // redirect DS users to the DS specific home page
    if ( isDS && window.location.pathname !== dsHome) {
      window.location = dsHome;
    }

    // Body classes for device-specific css
    if ( isWiiU ) {
        global.document.getElementsByTagName('html')[0].className+=' wiiU';
    }

    global.tl = global.tl || {};
    
    // public API
    global.tl.mobileDetect = {
        isWiiU: isWiiU,
        isDS: isDS
    };

}(this));

}
/*
     FILE ARCHIVED ON 19:30:15 Jun 11, 2014 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:09:12 Mar 30, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.723
  exclusion.robots: 0.036
  exclusion.robots.policy: 0.021
  esindex: 0.014
  cdx.remote: 5.377
  LoadShardBlock: 176.458 (3)
  PetaboxLoader3.datanode: 169.648 (4)
  load_resource: 69.927
  PetaboxLoader3.resolve: 35.377
*/