// Edited by PicelBoi, removed Nintendo's tracking and stuff.

var _____WB$wombat$assign$function_____ = function (name) {
  return (
    (self._wb_wombat &&
      self._wb_wombat.local_init &&
      self._wb_wombat.local_init(name)) ||
    self[name]
  );
};
if (!self.__WB_pmw) {
  self.__WB_pmw = function (obj) {
    this.__WB_source = obj;
    return this;
  };
}
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

  /*! Nintendo-Clone-Web 2014-06-05 */
  (function ($) {
    "use strict";

    /**
     * Measures a potentially hidden element by cloning the element, appending
     * it to a visible, but off-screen div, then measuring it.
     * @param  {object} $element jQuery object or DOM selection
     * @param  {string} selector Optional selector of the element you want dimensions of
     * @return {object}          object with width/height of element.
     */
    $.fn.measure = function (selector) {
      var $element = this; // for sanity

      // clone so as to not mess with original.
      $element = $element.clone();

      // create shadow element for measuring.
      var $temp = $("<div>"),
        dimensions = {};

      $temp.css({
        display: "block",
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        visibility: "hidden",
      });

      // insert element into shadow container, put that into DOM
      $temp.append($element);
      $("body").append($temp);

      // measure, cache, cleanup, return.
      if (selector) {
        dimensions.width = $element.find(selector).outerWidth();
        dimensions.height = $element.find(selector).outerHeight();
      } else {
        dimensions.width = $element.outerWidth();
        dimensions.height = $element.outerHeight();
      }

      $temp.remove();

      return dimensions;
    };
  })(jQuery);

  (function (global, $) {
    "use strict";

    var Yam,
      defaults = {
        // css class for display: none, or whatever you consider 'hidden'
        curtain: false,
        bodyShowCSSClass: "yam-open",
        curtainCSSClass: "yam-curtain",
        hideCSSClass: "hide",
        showCSSClass: "show",
        CSSClass: "yam",
        closeButtonCSSClass: "yam__close",
        contentCSSClass: "yam__content",
        centerModal: false, // assume CSS will handle this.
      },
      idCount = 0;

    function getUniqueID() {
      return (idCount += 1);
    }

    /**
     * Yet another modal constructor.
     * @constructor
     * @param {object} el DOM selection of element.
     * @param {object} options Custom settings for this Yam instance.
     */
    Yam = function (el, options) {
      this.$el = el instanceof jQuery ? el : $(el);
      this.settings = $.extend({}, defaults, options);
      this.id = getUniqueID();
      this.state = {
        sequence: [],
      };
      this._initModal();
    };

    //--------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------

    /**
     * Initializes the modal
     * @return {undefined}
     */
    Yam.prototype._initModal = function () {
      var modalTemplate =
          "" +
          '<div class="' +
          this.settings.CSSClass +
          " " +
          this.settings.hideCSSClass +
          '">' +
          '   <div class="' +
          this.settings.contentCSSClass +
          '">' +
          "   </div>" +
          "</div>",
        $modal = (this.$modal = $(modalTemplate));

      this.$el.before($modal);
      $modal.find("." + this.settings.contentCSSClass).append(this.$el);

      if (this.settings.curtain === true) {
        this._initCurtain();
      }
    };

    /**
     * If clicked on modal and not inside modal content, close modal.
     * Instead of binding to `this`, the yam instance must be passed in
     * via e.data.
     * @param  {object} e event object
     * @return {undefined}
     */
    Yam.prototype._eventMouseup = function (e) {
      var self = e.data.self,
        $target = $(e.target);

      if (
        $.contains(self.$el[0], e.target) === false &&
        e.target !== self.$el[0]
      ) {
        self.hide();
      } else if ($target.hasClass(self.settings.closeButtonCSSClass)) {
        self.hide();
      }
    };

    /**
     * If escape button is hit at all, close modal.
     * Instead of binding to `this`, the yam instance must be passed in
     * via e.data.
     * @param  {object} e event object
     * @return {undefined}
     */
    Yam.prototype._eventEscape = function (e) {
      var self = e.data.self;

      if (e.keyCode === 27) {
        self.hide();
      }
    };

    /**
     * Binds events to the modal (usually done when modal opens)
     * @return {undefined}
     */
    Yam.prototype._bindEvents = function () {
      this.$modal.on("mouseup", { self: this }, this._eventMouseup);

      $(window).on("keyup", { self: this }, this._eventEscape);

      this.state.eventsBound = true;
    };

    /**
     * Unbinds events to the modal (done when modal closes)
     * @return {undefined}
     */
    Yam.prototype._unBindEvents = function () {
      this.$modal.off("mouseup", this._eventMouseup);
      $(window).off("keyup", this._eventEscape);
      this.state.eventsBound = false;
    };

    /**
     * Initializes the curtain by adding a curtain div to the body.
     * @return {undefined}
     */
    Yam.prototype._initCurtain = function () {
      var $curtain = (this.$curtain = $(
        '<div class="' +
          this.settings.curtainCSSClass +
          " " +
          this.settings.hideCSSClass +
          '"></div>'
      ));

      $("body").append($curtain);
    };

    Yam.prototype.fireCallback = function (cb) {
      if (typeof cb === "function") {
        cb();
      }
    };

    //--------------------------------------------------------------------------
    // private show/hide methods
    // -------------------------------------------------------------------------

    Yam.prototype._onShow = function (cb) {
      $("body").addClass(this.settings.bodyShowCSSClass);

      this.$modal
        .removeClass(this.settings.hideCSSClass)
        .addClass(this.settings.showCSSClass);

      this._bindEvents();

      this.fireCallback();
    };

    Yam.prototype._onHide = function (cb) {
      this._unBindEvents();
      this.$modal
        .removeClass(this.settings.showCSSClass)
        .addClass(this.settings.hideCSSClass);

      $("body").removeClass(this.settings.bodyShowCSSClass);

      this.fireCallback();
    };

    Yam.prototype._onCurtainShow = function (cb) {
      this.$curtain
        .removeClass(this.settings.hideCSSClass)
        .addClass(this.settings.showCSSClass);

      this.fireCallback(cb);
    };

    Yam.prototype._onCurtainHide = function (cb) {
      if (this.$curtain === undefined) {
        return;
      }

      this.$curtain
        .removeClass(this.settings.showCSSClass)
        .addClass(this.settings.hideCSSClass);

      this.fireCallback(cb);
    };

    //--------------------------------------------------------------------------
    // public methods
    // -------------------------------------------------------------------------

    /**
     * Adds a new method to the Yam object. Reserved methods will be preserved,
     * and fired after the newly added method is called.
     * @param  {string}   methodName The name of the method to add.
     * @param  {Function} fn         The function for that method.
     * @return {undefined}
     */
    Yam.prototype.addMethod = function (methodName, fn) {
      var self = this,
        reservedMethods = ["onShow", "onHide"];

      if (reservedMethods.indexOf(methodName) > -1) {
        this[methodName] = function (cb) {
          var args = Array.prototype.slice.call(arguments);
          fn.apply(self, args);
          self["_" + methodName](); // call original code
        };

        console.log(this[methodName]);
      }
    };

    //--------------------------------------------------------------------------
    // modal show
    // -------------------------------------------------------------------------

    /**
     * The first method in the modal show sequence.
     * @param  {Function} cb Callback function - fires the next function in the
     *                       modal show process.
     * @return {undefined}
     */
    Yam.prototype.onBeforeShow = function (cb) {
      this.done();
    };

    /**
     * The second method in the modal show sequence. In addition to firing
     * the next step callback, it also calls `this._onShow` which binds events
     * and applies CSS changes.
     * @param  {Function} cb Callback function - fires the next function in the
     *                       modal show process.
     * @return {undefined}
     */
    Yam.prototype.onShow = function (cb) {
      this._onShow();
      this.done();
    };

    /**
     * The third and final method in the modal show sequence.
     * @param  {Function} cb Callback function - fires the next function in the
     *                       modal show process.
     * @return {undefined}
     */
    Yam.prototype.onAfterShow = function (cb) {
      this.done();
    };

    //--------------------------------------------------------------------------
    // modal hide
    // -------------------------------------------------------------------------

    /**
     * The first method in the modal hide sequence.
     * @param  {Function} cb The callback - the next function in the modal hide
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onBeforeHide = function (cb) {
      this.done();
    };

    /**
     * The second method in the modal hide sequence. In addition to firing
     * the next step callback, it also calls `this._onHide` which unbinds events
     * and reverts CSS changes made by `this._onShow`.
     * @param  {Function} cb The callback - the next function in the modal hide
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onHide = function (cb) {
      this._onHide();
      this.done();
    };

    /**
     * The thid and final method in the modal hide sequence.
     * @param  {Function} cb The callback - the next function in the modal hide
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onAfterHide = function (cb) {
      this.done();
    };

    //--------------------------------------------------------------------------
    // curtain show
    // -------------------------------------------------------------------------

    /**
     * The first method in the curtain show sequence.
     * @param  {Function} cb The callback - the next function in the modal show
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onBeforeCurtainShow = function (cb) {
      this.done();
    };

    /**
     * The second method in the curtain show sequence. Calls `this._onCurtainShow()`,
     * which applies CSS to show the curtain.
     * @param  {Function} cb The callback - the next function in the modal show
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onCurtainShow = function (cb) {
      this._onCurtainShow();
      this.done();
    };

    /**
     * The third and final method in the curtain show sequence.
     * @param  {Function} cb The callback - the next function in the modal show
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onAfterCurtainShow = function (cb) {
      this.done();
    };

    //--------------------------------------------------------------------------
    // curtain hide
    // -------------------------------------------------------------------------

    /**
     * The first method in the curtain hide sequence.
     * @param  {Function} cb The callback - the next function in the modal show
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onBeforeCurtainHide = function (cb) {
      this.done();
    };

    /**
     * The second method in the curtain hide sequence. Also unbinds events
     * originally bound by `this.onCurtainShow`.
     * @param  {Function} cb The callback - the next function in the modal show
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onCurtainHide = function (cb) {
      this._onCurtainHide();
      this.done();
    };

    /**
     * The third and final method in the curtain show sequence.
     * @param  {Function} cb The callback - the next function in the modal show
     *                       sequence.
     * @return {undefined}
     */
    Yam.prototype.onAfterCurtainHide = function (cb) {
      this.done();
    };

    /**
     * Opens the modal window by calling the open sequence. The order is as
     * follows:
     * 1. onBeforeCurtainShow (if applicable)
     * 2. onCurtainShow (if applicable)
     * 3. onAfterCurtainShow (if applicable)
     * 4. onBeforeShow
     * 5. onShow
     * 6. onAfterShow
     * @param {function} cb Callback function for when show() sequence is done
     * @return {undefined}
     */
    Yam.prototype.show = function (cb) {
      var curtainSequence = [
          "onBeforeCurtainShow",
          "onCurtainShow",
          "onAfterCurtainShow",
        ],
        modalSequence = ["onBeforeShow", "onShow", "onAfterShow"];

      if (this.settings.curtain === true) {
        // curtain first, then modal
        this.state.sequence = this.state.sequence.concat(
          curtainSequence.concat(modalSequence)
        );
      } else {
        // just modal
        this.state.sequence = this.state.sequence.concat(modalSequence);
      }

      // callback for when show is totally done?
      if (typeof cb === "function") {
        this.state.sequence.push(cb);
      }

      this.done(); // kick off the sequence
      return this;
    };

    /**
     * Closes the modal by calling the close sequence which is:
     * 1. onBeforeHide
     * 2. onHide
     * 3. onAfterHide
     * 4. onBeforeCurtainHide
     * 5. onCurtainHide
     * 6. onAfterCurtainHide
     * @param {function} cb Callback function for when hide() sequence is done
     * @return {undefined}
     */
    Yam.prototype.hide = function (cb) {
      var curtainSequence = [
          "onBeforeCurtainHide",
          "onCurtainHide",
          "onAfterCurtainHide",
        ],
        modalSequence = ["onBeforeHide", "onHide", "onAfterHide"];

      if (this.settings.curtain === true) {
        // modal first, then curtain.
        this.state.sequence = this.state.sequence.concat(
          modalSequence.concat(curtainSequence)
        );
      } else {
        // just modal
        this.state.sequence = this.state.sequence.concat(modalSequence);
      }

      // callback for when hide is totally done?
      if (typeof cb === "function") {
        this.state.sequence.push(cb);
      }

      this.done(); // kick off the sequence
      return this;
    };

    /**
     * Fires the next method in the `this.state.sequence` array, and if none
     * exists, fires a callback
     * @param  {Function} cb [description]
     * @return {Function}    [description]
     */
    Yam.prototype.done = function (cb) {
      var method;

      if (this.state.sequence !== undefined && this.state.sequence.length > 0) {
        method = this.state.sequence.splice(0, 1)[0];

        if (typeof method === "string") {
          this[method]();
        } else {
          // assume method is a function, not a method name.
          this.fireCallback(method);
        }
      } else {
        this.fireCallback(cb);
      }
    };

    /**
     * Destroys the modal by removing the curtain and unwrapping the content
     * with the modal boilerplate. Also unbinds events.
     * @return {undefined}
     */
    Yam.prototype.destroy = function () {
      if (this.$curtain) {
        this.$curtain.remove();
      }

      this.close();
      this._unBindEvents();
      this.$modal.before(this.$el);
      this.$modal.remove();
    };

    try {
      if (module || exports) {
        module.exports = Yam;
      }
    } catch (e) {
      global.Yam = Yam;
    }
  })(this, jQuery);

  (function (global) {
    "use strict";

    /**
     * Helper for opening new pages
     * @param  {string} path The url to open
     * @return {undefined} navigates to the desired location.
     */
    function goToPage(path) {
      if (path.indexOf("http") === 0) {
        window.location.href = path;
      } else {
        // assume local
        window.location.pathname = path;
      }
    }

    function slugify(text) {
      return text
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    }

    var lang = $("html").prop("lang"),
      langPath = lang !== "en" ? "/" + lang : "";

    global.tl.utils = {
      goToPage: goToPage,
      slugify: slugify,
      lang: lang,
      langPath: langPath,
    };

    return global.tl.utils;
  })(this);
  (function (global) {
    "use strict";

    var pointerUtils = {
      /**
       * Polyfill for getting the pointer type from a pointer event. Supports
       * jQuery events, and supports IE10 and IE11.
       * @param  {object} e Pointer Event
       * @return {String}   The type of pointer event. Either "mouse", "pen",
       *                    or "touch", as in the spec.
       */
      getPointerType: function (e) {
        var originalEvent = e.originalEvent ? e.originalEvent : e, // support for jQuery events
          pointerType = originalEvent.pointerType;

        if (pointerType === undefined) {
          return undefined;
        }

        if (
          pointerType === originalEvent.MSPOINTER_TYPE_TOUCH ||
          pointerType === "touch"
        ) {
          return "touch";
        }

        if (
          pointerType === originalEvent.MSPOINTER_TYPE_PEN ||
          pointerType === "pen"
        ) {
          return "pen";
        }

        if (
          pointerType === originalEvent.MSPOINTER_TYPE_MOUSE ||
          pointerType === "mouse"
        ) {
          return "mouse";
        }
      },
    };

    global.tl = global.tl || {};
    global.tl.pointerUtils = pointerUtils;
  })(this);
  (function (global) {
    "use strict";

    /**
     * Activates Debugging
     * @return {undefined}
     */
    function activate() {
      $("html").addClass("debug");
      global.tl.clouds.stop();
      global.tl.miiCrowd.debug();
      global.tl.isDebugging = true;
      ls("set", true);
    }

    /**
     * Deactivates debugging
     * @return {undefined}
     */
    function deactivate() {
      $("html").removeClass("debug");
      global.tl.clouds.start();
      global.tl.miiCrowd.debug(false);
      global.tl.isDebugging = false;
      ls("set", false);
    }

    /**
     * try / catch for saving debug setting to localstorage.
     * @param  {string}  method      set or get
     * @param  {Boolean} isDebugging boolean for isDebugging
     * @return {undefined}
     */
    function ls(method, isDebugging) {
      //guardian
      if (typeof global.localStorage !== "object") {
        return;
      }

      try {
        if (method === "set") {
          return localStorage.setItem("isDebugging", isDebugging);
        } else if (method === "get") {
          return localStorage.getItem("isDebugging");
        }
      } catch (e) {
        console.log("something went wrong with localstorage...");
        return undefined;
      }
    }

    global.tl = global.tl || {};
    global.tl.isDebugging = global.tl.isDebugging || false;

    global.tl.debug = function () {
      if (global.tl.isDebugging) {
        deactivate();
      } else {
        activate();
      }
    };

    (function init() {
      var isDebugging = ls("get");

      if (isDebugging === "true") {
        global.tl.isDebugging = true;
        _.defer(activate);
      }
    })();
  })(this);

  (function (global) {
    function markSectionAsInvalid($input) {
      var $sectionHeader = $input
        .parents(".section-body")
        .find(".section-header h3");
      $sectionHeader.addClass("invalid");
    }

    function clearInvalidSection($input) {
      var $sectionHeader = $input
        .parents(".section-body")
        .find(".section-header h3");
      $sectionHeader.removeClass("invalid");
    }

    function clearAllInvalidSections() {
      $(".section-header h3").removeClass("invalid");
    }

    function validateForm() {
      var isFormValid = true;

      // Select Lists
      $("select").each(function () {
        if ($(this).val() === "") {
          // form is invalid
          markSectionAsInvalid($(this));
          isFormValid = false;
        }
      });

      // Radio Buttons
      var radioNames = {};

      $("input[type='radio']").each(function () {
        var name = $(this).attr("name");
        radioNames[name] = true;
      });

      $.each(radioNames, function (key, value) {
        var $radioGroup = $("input[name='" + key + "']");
        var valueSelected = $radioGroup.filter(":checked").length > 0;
        if (!valueSelected) {
          // form is invalid
          markSectionAsInvalid($radioGroup.first());
          isFormValid = false;
        }
      });

      return isFormValid;
    }

    function displayValidationMessage() {
      var $validationMessage = $("#personality-quiz--validation-message");
      $validationMessage.show();
    }

    function displayErrorMessage() {
      var $errorMessage = $("#personality-quiz--error-message");
      $errorMessage.show();
    }

    var $form = $("#form-questionnaire");
    var $formog = $("#form-questionnaire-og");

    $form.submit(function (e) {
      clearAllInvalidSections();
      $("#personality-quiz--validation-message").hide();
      $("#personality-quiz--error-message").hide();

      var isFormValid = validateForm();

      if (isFormValid) {
        global.document.location.href =
          "personality-result/?" + $form.serialize();
      } else {
        displayValidationMessage();
      }
      e.preventDefault();
    });

    $formog.submit(function (e) {
      clearAllInvalidSections();
      $("#personality-quiz--validation-message").hide();
      $("#personality-quiz--error-message").hide();

      var isFormValid = validateForm();

      if (isFormValid) {
        global.document.location.href =
          "personality-result-og/?" + $formog.serialize();
      } else {
        displayValidationMessage();
      }
      e.preventDefault();
    });

    // Support for selection via label click in IE browsers (native in Firefox and Chrome)
    $("#personality-quiz label").click(function () {
      var labelFor = $(this).attr("for");
      $("#" + labelFor).trigger("click");
    });

    // Clear invalid status when answer is selected
    $("#personality-quiz input").click(function () {
      clearInvalidSection($(this));
    });

    $("#personality-quiz select").change(function () {
      clearInvalidSection($(this));
    });

    // Q4-Q7 Adjust spectrum check mark based on selection
    $("#personality-quiz input:radio").on("change", function () {
      var $parent = $(this).parents(".content-wrapper").first();
      var $spectrum = $parent.find(".spectrum");
      if ($spectrum.length > 0) {
        var $radioButtons = $parent.find("input:radio");
        var buttonCount = $radioButtons.length;
        var selectedIndex = $radioButtons.index(this);

        var $bar = $spectrum.find(".bar");
        var $checkMark = $spectrum.find(".check-mark");

        var barWidth = $bar.width();
        var checkWidth = $checkMark.width();

        var offsetLeft = checkWidth;
        var checkPosition =
          ((barWidth - offsetLeft) / (buttonCount - 1)) * selectedIndex +
          offsetLeft;

        $checkMark.css({
          display: "block",
          left: checkPosition + "px",
          marginLeft: "-" + checkWidth + "px",
        });

        var $spectrumText = $parent.find(".spectrum-text");
        $spectrumText.text($(this).data("spectrum-text"));
      }
    });

    // Q6 - Switch out expression images based on gender
    $("#personality-quiz--gender input:radio").on("change", function () {
      var gender = this.value === "m" ? "male" : "female";

      var $expressions = $(
        "#personality-quiz--expressiveness img[data-" + gender + "-image]"
      ).each(function () {
        var $expression = $(this);
        $expression.attr("src", $expression.data(gender + "-image"));
      });
    });

    if (global.Modernizr.touch) {
      //Q8 - Touch - Playback animated gifs on touch
      $("#personality-quiz img[data-animation]").on("click touch", function () {
        var $this = $(this);

        $("#personality-quiz img[data-animation]")
          .not(this)
          .each(function () {
            var $this = $(this);
            $this.attr("src", $this.data("still"));
          });

        if ($this.data("still") === undefined) {
          $this.data("still", $this.attr("src"));
        }
        $this.attr("src", $this.data("animation"));
      });
    } else {
      //Q8 - Desktop - Play all gifs
      $("#personality-quiz img[data-animation]").each(function () {
        var $this = $(this);
        $this.data("still", $this.attr("src"));
        $this.attr("src", $this.data("animation"));
      });
    }

    // Q8 - Reset gif playback on mouse out
    //    $('#personality-quiz img[data-animation]').on('mouseout', function(){
    //      var $this = $(this);
    //      $this.attr('src', $this.data('still'));
    //    });

    function getQueryParams() {
      var params = {};
      var queryString = window.location.search.substring(1);

      var queries = queryString.split("&");

      for (var i = 0, l = queries.length; i < l; i++) {
        var temp = queries[i].split("=");
        params[temp[0]] = temp[1];
      }

      return params;
    }

    function isVowel(char) {
      char = char.toLowerCase();
      return ["a", "e", "i", "o", "u"].indexOf(char) !== -1;
    }

    $(document).ready(function () {
      $.ajaxSetup({ cache: true });
      if ($("#personality-quiz-result").length > 0) {
        var params = getQueryParams();

        var gender = params["tq2"];
        var movement = parseInt(params["tq4"]) - 1;
        var speech = parseInt(params["tq5"]) - 1;
        var expressiveness = parseInt(params["tq6"]) - 1;
        var attitude = parseInt(params["tq7"]) - 1;
        var overall = parseInt(params["tq8"]) - 1;
        var samesex = params["samesex"];

        // calculate personality
        // this sucks!
        // used this https://gamefaqs.gamespot.com/3ds/643013-tomodachi-life/map/11698-personality-calculator
        try {
          exat = expressiveness + attitude;
          mosp = movement + speech;
          var result = 0;
          var personalitylist = [
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
            [4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7],
            [4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7],
            [4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7],
            [4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7],
            [8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11],
            [8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11],
            [8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11],
            [8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11],
            [12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15],
            [12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15],
            [12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15],
            [12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15],
          ];

          /*
          if (exat >= 0 || exat < 3) {
            if (mosp >= 0 || mosp < 3) {
              console.log("1");
              result = 0;
            }
            if (mosp >= 4 || mosp < 7) {
              console.log("2");
              result = 1;
            }
            if (mosp >= 8 || mosp < 11) {
              console.log("3");
              result = 2;
            }
            if (mosp >= 12 || mosp < 16) {
              console.log("4");
              result = 3;
            }
          }
          if (exat >= 4 || exat < 7) {
            if (mosp >= 0 || mosp < 3) {
              console.log("5");
              result = 4;
            }
            if (mosp >= 4 || mosp < 7) {
              console.log("6");
              result = 5;
            }
            if (mosp >= 8 || mosp < 11) {
              console.log("7");
              result = 6;
            }
            if (mosp >= 12 || mosp < 16) {
              console.log("8");
              result = 7;
            }
          }
          if (exat >= 8 || exat < 11) {
            if (mosp >= 0 || mosp < 3) {
              console.log("9");
              result = 8;
            }
            if (mosp >= 4 || mosp < 7) {
              console.log("10");
              result = 9;
            }
            if (mosp >= 8 || mosp < 11) {
              console.log("11");
              result = 10;
            }
            if (mosp >= 12 || mosp < 16) {
              console.log("12");
              result = 11;
            }
          }
          if (exat >= 9 || exat < 16) {
            if (mosp >= 0 || mosp < 3) {
              console.log("13");
              result = 12;
            }
            if (mosp >= 4 || mosp < 7) {
              console.log("14");
              result = 13;
            }
            if (mosp >= 8 || mosp < 11) {
              console.log("15");
              result = 14;
            }
            if (mosp >= 12 || mosp < 16) {
              console.log("16");
              result = 15;
            }
          }
            */
          // ^ This didn't work.
          result = personalitylist[exat][mosp];
        } catch {
          var result = 0;
        }
        var personality = global.personalityQuiz.personalities[result];

        var article = isVowel(personality.group.substring(0, 1)) ? "an" : "a";

        // Header
        var $personalityType = $("<div>")
          .addClass("personality-type")
          .text(personality.group + " " + personality.name);
        $(".page-header h2").append($personalityType);

        $personalityType.before(
          global.personalityQuiz.copy.resultTextTop.replace(
            "[[article]]",
            article
          )
        );
        $personalityType.after(global.personalityQuiz.copy.resultTextBottom);

        var $personalityImg = $("<img>")
          .attr(
            "src",
            "/assets/images/shared/personalityQuiz/results/" +
              gender +
              "/" +
              result +
              "/personality.gif"
          )
          .addClass("type-image");
        $(".type-description")
          .html(personality.description)
          .prepend($personalityImg);

        if (samesex == "y") {
          if (gender == "m") {
            $(".match-match img").attr(
              "src",
              "/assets/images/shared/personalityQuiz/results/f/" +
                "/" +
                result +
                "/match.gif"
            );
          } else if (gender == "f") {
            $(".match-match img").attr(
              "src",
              "/assets/images/shared/personalityQuiz/results/m/" +
                "/" +
                result +
                "/match.gif"
            );
          } else if (gender == "n") {
            $(".match-match img").attr(
              "src",
              "/assets/images/shared/personalityQuiz/results/n/" +
                "/" +
                result +
                "/matchss.gif"
            );
          }
        } else if (samesex == "b") {
          $(".match-match img").attr(
            "src",
            "/assets/images/shared/personalityQuiz/results/" +
              "n" +
              "/" +
              result +
              "/match.gif"
          );
        } else if (samesex == "p") {
          $(".match-match img").attr(
            "src",
            "/assets/images/shared/personalityQuiz/results/" +
              "p" +
              "/" +
              result +
              ".gif"
          );
        } else if (samesex == "ar") {
          $(".match-match img").attr(
            "src",
            "/assets/images/shared/personalityQuiz/results/aroace.svg"
          );
        } else {
          $(".match-match img").attr(
            "src",
            "/assets/images/shared/personalityQuiz/results/" +
              gender +
              "/" +
              result +
              "/match.gif"
          );
        }
        if (samesex == "ar") {
          $(".match-match span").text("No good match.");
        } else {
          $(".match-match span").text(personality.match);
        }

        $(".match-room img").attr(
          "src",
          "/assets/images/shared/personalityQuiz/results/" +
            gender +
            "/" +
            result +
            "/room.png"
        );
        $(".match-room span").text(personality.room);

        $(".match-outfit img").attr(
          "src",
          "/assets/images/shared/personalityQuiz/results/" +
            gender +
            "/" +
            result +
            "/outfit.gif"
        );
        var outfit =
          gender === "n" ? "Varied" : "m" ? personality.maleOutfit : personality.femaleOutfit;
        $(".match-outfit span").text(outfit);
        $("#MovementStat").text(movement + 1);
        $("#SpeechStat").text(speech + 1);
        $("#ExpressivenessStat").text(expressiveness + 1);
        $("#AttitudeStat").text(attitude + 1);
        $("#OverallStat").text(overall + 1);
        console.log(
          "/assets/images/shared/personalityQuiz/tlifebars/" +
            (movement + 1) +
            ".png"
        );
        $("#MovementStatBar").attr(
          "src",
          "/assets/images/shared/personalityQuiz/tlifebars/" +
            (movement + 1) +
            ".png"
        );
        $("#SpeechStatBar").attr(
          "src",
          "/assets/images/shared/personalityQuiz/tlifebars/" +
            (speech + 1) +
            ".png"
        );
        $("#ExpressivenessStatBar").attr(
          "src",
          "/assets/images/shared/personalityQuiz/tlifebars/" +
            (expressiveness + 1) +
            ".png"
        );
        $("#AttitudeStatBar").attr(
          "src",
          "/assets/images/shared/personalityQuiz/tlifebars/" +
            (attitude + 1) +
            ".png"
        );
        $("#OverallStatBar").attr(
          "src",
          "/assets/images/shared/personalityQuiz/tlifebars/" +
            (overall + 1) +
            ".png"
        );
      }
    });
  })(this);

  (function (global) {
    "use strict";

    function trackAction(actionName) {
      var ss = {
          newItem: "7EC5F0E7-E8DB-4F9E-A879-062402287DA2",
          buyNow: "72E314A6-135B-450B-A100-29899BEB8BF3",
          celebrityMii: "636D54CA-7623-461C-83F5-7966C41C9830",
          newsNintendoDirectVideo: "F87199AC-57E5-4730-BF51-2AC9E24CF8C6", // ?? no content for news yet...
          newsInterviewAtIGN: "CA1EF7C8-3F9C-41A5-A6B6-41000DFC1C97", // ?? no content for news yet - not implemented
          takeTheQuiz: "FD4B03EA-1607-4C8A-866B-636F94878AAA",
          whatIsTLVideo: "B9BCF105-B161-4D34-A862-3A9988E545A3",
          homePage: "F8A7DCFB-1187-47D1-95C8-EE9EF32D9D27",
          galleryPage: "7A3D8B51-03F6-49FC-AD66-DE70B4B58D53",
          makingMiisPage: "5454BD7F-48D5-4FC9-BCDC-8526507EA42E",
          sharingMiisPage: "0B013CDA-BF18-4F37-8D7F-23C3BEF6D2A2",
        },
        prd = new Date(),
        pru = Date.UTC(
          prd.getUTCFullYear(),
          prd.getUTCMonth(),
          prd.getUTCDay(),
          prd.getUTCHours(),
          prd.getUTCMinutes(),
          prd.getUTCSeconds(),
          prd.getUTCMilliseconds()
        ),
        pr_eid = pru + Math.random(),
        pr_event = "",
        pr_item = "",
        pr_quantity = "",
        pr_value = "";

      if (ss[actionName]) {
        if (global.tl.isDebugging === true) {
          console.log(
            "PointRoll TrackAction: " + actionName + " (" + ss[actionName] + ")"
          );
        }
        var px = new global.Image(1, 1);
        px.src =
          "https://web.archive.org/web/20140611193015/http://ev.ads.pointroll.com/event/?ss=" +
          ss[actionName] +
          "&av=777&eid=" +
          pr_eid +
          "&ev=" +
          pr_event +
          "&item=" +
          pr_item +
          "&q=" +
          pr_quantity +
          "&val=" +
          pr_value +
          "&r=" +
          Math.random();
      }
    }

    global.tl = global.tl || {};
    global.tl.pointRoll = {
      trackAction: trackAction,
    };
  })(this);

  (function (global) {
    "use strict";

    var breakpoints = ["sm", "md", "mdlg", "lg"];

    /**
     * Preps the breakpoint test.
     * Adds a hidden div with visible-* divs. These are used by `getScreenSizeName`
     * to determine which breakpoint we're in.
     *
     * @return {undefined}
     */
    (function initBreakpointTest() {
      var $container = $(
        '<div id="screenSizeTest" style="position: absolute; top: -9999px; left: -9999px;"></div>'
      );
      _.each(breakpoints, function (point) {
        $container.append(
          '<div class="visible-' +
            point +
            '" data-breakpoint="' +
            point +
            '" style="width: 1px; height: 1px;"></div>'
        );
      });

      $("body").append($container);
    })();

    /**
     * Returns the current screen size by querying which `visible-*` div is
     * actually visible.
     * @return {string} screen size name in the form of "xs", "xssm", "sm", etc.
     */
    function getScreenSizeName() {
      return $("#screenSizeTest div:visible").attr("data-breakpoint");
    }

    /**
     * Using bootstrap terminology, this helper method determines if your screen
     * size is smaller than the breakpoint name you pass in.
     * @param  {string}  targetScreenSizeName The breakpoint name in question
     * @return {Boolean}                      Whether or not the screen is smaller
     *                                        than the breakpoint you passed in.
     */
    function isScreenSmallerThan(targetScreenSizeName) {
      var currentScreenSizeName = getScreenSizeName();

      if (
        targetScreenSizeName === undefined ||
        _.indexOf(breakpoints, targetScreenSizeName) < 0
      ) {
        throw new Error(
          "target screen size name does not exist in breakpoint settings."
        );
      }

      return (
        _.indexOf(breakpoints, currentScreenSizeName) <
        _.indexOf(breakpoints, targetScreenSizeName)
      );
    }

    /**
     * Using bootstrap terminology, this helper method determines if your screen
     * size is larger than the breakpoint name you pass in.
     * @param  {string}  targetScreenSizeName The breakpoint name in question
     * @return {Boolean}                      Whether or not the screen is larger
     *                                        than the breakpoint you passed in.
     */
    function isScreenLargerThan(targetScreenSizeName) {
      var currentScreenSizeName = getScreenSizeName();

      if (
        targetScreenSizeName === undefined ||
        _.indexOf(breakpoints, targetScreenSizeName) < 0
      ) {
        throw new Error(
          "target screen size name does not exist in breakpoint settings."
        );
      }

      return (
        _.indexOf(breakpoints, currentScreenSizeName) >
        _.indexOf(breakpoints, targetScreenSizeName)
      );
    }

    global.tl.screenUtils = {
      getScreenSizeName: getScreenSizeName,
      isScreenSmallerThan: isScreenSmallerThan,
      isScreenLargerThan: isScreenLargerThan,
    };
  })(this);

  (function (global) {
    "use strict";

    if (
      window.sessionStorage &&
      !window.sessionStorage.getItem("loaderShown")
    ) {
      $(window).load(function () {
        var $loader = $("#loader");
        global.TweenLite.to($loader, 0.5, {
          opacity: 0,
          onComplete: function () {
            window.sessionStorage.setItem("loaderShown", true);
            $(window).trigger("imagesLoaded");

            $loader.remove();
            if (global.tl.loadingAnimation) {
              global.tl.loadingAnimation.stop();
            }
          },
        });
      });
    } else {
      $(window).load(function () {
        $(window).trigger("imagesLoaded");
      });
    }
  })(this);

  (function (global, TweenLite) {
    "use strict";

    var PANE = {},
      PANE_IN_SPEED_S = 1,
      PANE_OUT_SPEED_S = 0.6,
      CONTENT_IN_SPEED_S = 0.8,
      CONTENT_OUT_SPEED_S = 0.3;

    /* Set up content pane effects, if one exists */
    $(function () {
      var $contentPane = $(".content-pane");
      if ($contentPane.length === 0) {
        return;
      } /* no pane on page */

      var paneContent = $contentPane.find(".pane-content");
      var paneHeader = $contentPane.find(".pane-header");

      PANE.BackgroundHeight = $(".page-wrapper").height();
      PANE.NintendoNavHeight = window.innerWidth > 880 ? 44 : 88;
      PANE.HeaderOffsetTop = paneHeader.offset().top + PANE.NintendoNavHeight;
      PANE.ContentOffsetTop = paneContent.offset().top + PANE.NintendoNavHeight;
      PANE.BorderWidth = parseInt(paneContent.css("border-top-width"), 10);

      /* Note: We have to animate the full backgroundPosition property, since Firefox doesn't support backgroundPositionY */
      var bgOffsetContainer = PANE.BackgroundHeight + PANE.ContentOffsetTop;
      paneContent.css({
        backgroundPosition: "50% -" + bgOffsetContainer + "px",
      });

      var bgOffsetHeader =
        PANE.BackgroundHeight + PANE.HeaderOffsetTop + PANE.BorderWidth;
      paneHeader.css({ backgroundPosition: "50% -" + bgOffsetHeader + "px" });

      // Touch devices don't get any animation.
      if (!global.Modernizr.touch) {
        var $pane = paneContent.find(".pane");
        $pane.children().css({
          visibility: "hidden",
        });
        $contentPane.css({ top: PANE.BackgroundHeight });

        /* Add the class 'page-transition' to internal links to animate out the pane on click */
        $(".page-transition").on("click", function (e) {
          e.preventDefault();
          var href = $(this).attr("href");
          window.tl.contentPane.animateOut();
          $("#miiCrowd").fadeOut(500);
          setTimeout(function () {
            window.location = href;
          }, PANE_OUT_SPEED_S * 1000);
        });

        animateIn();
      } else {
        $contentPane.css({
          visibility: "visible",
        });
        paneContent.css({
          "background-position": "50% -" + PANE.ContentOffsetTop + "px",
        });
        paneHeader.css({
          "background-position": "50% -" + PANE.HeaderOffsetTop + "px",
        });
      }
    });

    function animateIn(callback) {
      var pane = $(".content-pane");
      pane.css("visibility", "visible");

      TweenLite.to(pane, PANE_IN_SPEED_S, {
        css: { top: 0 },
        onComplete: function () {
          var children = $(this).find(".pane-content .pane").children();
          children.hide().css({
            visibility: "visible",
          });

          children.each(function (index) {
            /* Effect: slide even elements (0 based) into position from the right, odd elements in from the left */
            var startingPosition = index % 2 === 0 ? "200px" : "-200px";
            $(this).css({ position: "relative", left: startingPosition });
            TweenLite.to($(this), CONTENT_IN_SPEED_S, { left: "0px" });

            /* Effect: fade in */
            $(this).fadeIn(CONTENT_IN_SPEED_S * 1000, function () {
              $(window).trigger("animateInComplete.pane");
            });
          });
        },
        onCompleteScope: pane,
      });

      var paneContent = $(".pane-content");
      var paneHeader = $(".pane-header");
      TweenLite.to(paneContent, PANE_IN_SPEED_S, {
        backgroundPosition: "50% -" + PANE.ContentOffsetTop + "px",
      });
      TweenLite.to(paneHeader, PANE_IN_SPEED_S, {
        backgroundPosition: "50% -" + PANE.HeaderOffsetTop + "px",
      });
    }

    function animateOut() {
      var pane = $(".content-pane");

      pane
        .find(".pane-content .pane")
        .children()
        .fadeOut(CONTENT_OUT_SPEED_S * 1000, function () {
          var paneContent = $(".pane-content");
          var paneHeader = $(".pane-header");

          var bgOffsetContainer = PANE.BackgroundHeight + PANE.ContentOffsetTop;
          var bgOffsetHeader =
            PANE.BackgroundHeight + PANE.HeaderOffsetTop + PANE.BorderWidth;

          TweenLite.to(pane, PANE_OUT_SPEED_S, {
            top: PANE.BackgroundHeight,
            onComplete: function () {
              $(this).css("visibility", "hidden");
            },
            onCompleteScope: pane,
          });
          TweenLite.to(paneContent, PANE_OUT_SPEED_S, {
            backgroundPosition: "50% -" + bgOffsetContainer + "px",
          });
          TweenLite.to(paneHeader, PANE_OUT_SPEED_S, {
            backgroundPosition: "50% -" + bgOffsetHeader + "px",
          });
        });
    }

    function resetGlass() {
      var $contentPane = $(".content-pane");
      if ($contentPane.length === 0) {
        return;
      } /* no pane on page */

      var paneContent = $contentPane.find(".pane-content");
      var paneHeader = $contentPane.find(".pane-header");

      PANE.BackgroundHeight = $(".page-wrapper").height();
      PANE.NintendoNavHeight = window.innerWidth > 880 ? 44 : 88;
      PANE.HeaderOffsetTop = paneHeader.offset().top;
      PANE.ContentOffsetTop = paneContent.offset().top;
      PANE.BorderWidth = parseInt(paneContent.css("border-top-width"), 10);

      paneContent.css({
        "background-position": "50% -" + PANE.ContentOffsetTop + "px",
      });
      paneHeader.css({
        "background-position": "50% -" + PANE.HeaderOffsetTop + "px",
      });
    }

    $(window).resize(function () {
      resetGlass();
    });

    if (global.Modernizr.touch) {
      $(window).on("orientationchange", function () {
        resetGlass();
      });
    }

    global.tl.contentPane = {
      animateIn: animateIn,
      animateOut: animateOut,
      resetGlass: resetGlass,
    };
  })(this, TweenLite);

  (function (global) {
    "use strict";

    var TweenLite = global.TweenLite,
      Modal;

    /**
     * Tomodachi life modal base class.
     * @param {object} el      jQuery DOM selection of target
     * @param {object} options settings object
     */
    Modal = function (el, options) {
      options = _.extend(
        {},
        {
          curtain: true,
          autoInsertVideos: false,
          appendToBody: true,
          useIScroll: false, // whether or not to use iScroll if modal is too large.
        },
        options
      );

      global.Yam.call(this, el, options);

      // add a route if opted in.
      if (options.route) {
        this._addRoute(options.route);
      }

      if (options.appendToBody) {
        // move modal div to body
        this._appendToBody();
      }

      this._initVideoPlayers();
    };

    Modal.prototype = Object.create(global.Yam.prototype);

    /*****************************************************************
     * The Sequence
     ******************************************************************/

    /**
     * Preps mii's in modals
     * @return {undefined}
     */
    Modal.prototype.onBeforeShow = function () {
      // Prep mii's in modals
      var $miis = this.$el.find(".mii");

      if ($miis.length > 0) {
        $miis.each(function () {
          $(this).css("opacity", 0).find(".speech-bubble").css("opacity", 0);
        });
      }

      // The body tag will be set to 'overflow: hidden' when the modal is shown. To prevent the page
      // from visibly jumping, pad the html tag and throw up a grey div to take the place of the scrollbar
      var scrollbarWidth = window.innerWidth - $(window).width();
      if (scrollbarWidth > 0) {
        $("html").css({ paddingRight: scrollbarWidth });
        var fakeScrollbar = $('<div class="fake-scroll-bar"></div>').css({
          width: scrollbarWidth,
        });
        $("body").append(fakeScrollbar);
      }

      this.done();
    };

    Modal.prototype.onAfterShow = function () {
      var $el = this.$el,
        self = this,
        $miis = $el.find(".mii"),
        delayTime = 250,
        delayTimeIncrement = 250;

      function iScroll() {
        if (self.settings.useIScroll) {
          self._initIScroll();
        }
      }

      // complex tweening:
      // 1. animate in any miis in the modal, spaced out by 250ms
      // 2. when those miis complete, animate in their speech bubbles.
      function animateMiis() {
        if ($miis.length === 0) {
          iScroll();
          self.done();
          return;
        }

        $miis.each(function () {
          var $this = $(this);

          _.delay(function () {
            var miiTween = new global.TimelineLite(),
              speechTween = new global.TimelineLite();

            miiTween.to($this, 0.3, {
              opacity: 1,
              scale: 1.2,
            });

            miiTween.to($this, 0.2, {
              scale: 1,
              onComplete: function () {
                // animate in speech bubble
                var $bubble = $this.find(".speech-bubble");

                if ($bubble.length === 0) {
                  return;
                }

                global.TweenLite.fromTo(
                  $bubble,
                  0.2,
                  {
                    opacity: 0,
                    marginTop: "30px",
                  },
                  {
                    opacity: 1,
                    marginTop: 0,
                  }
                );
              },
            });

            miiTween.play();
          }, delayTime);

          delayTime += delayTimeIncrement;
        });

        iScroll();

        self.done();
      }

      function animateInModal() {
        var inTween = new global.TimelineLite();

        inTween.to($el, 0, {
          scaleX: 0,
          scaleY: 0,
          opacity: 0,
        });

        inTween.to($el, 0.2, {
          scaleX: 1.1,
          scaleY: 1.1,
          opacity: 1,
        });

        inTween.to($el, 0.2, {
          scaleX: 1,
          scaleY: 1,
          onComplete: function () {
            animateMiis();
          },
        });
      }

      function bindResizeEvents() {
        $(window).resize(function () {
          clearTimeout($.data(self, "resizeTimer"));
          $.data(
            self,
            "resizeTimer",
            setTimeout(function () {
              adjustHeight();
            }, 300)
          );
        });

        if (global.Modernizr.touch) {
          $(window).on("orientationchange", function () {
            adjustHeight();
          });
        }
      }

      function adjustHeight() {
        var minModalTop = 5;
        var maxModalTop = 100;
        var modalHeight = self.$el.height();
        var newModalTop;

        var remaining = window.innerHeight - (modalHeight + minModalTop);
        if (remaining <= 0) {
          newModalTop = minModalTop;
        } else if (remaining > maxModalTop * 2) {
          newModalTop = maxModalTop;
        } else {
          newModalTop = minModalTop + remaining / 2;
        }

        self.$el.css({ marginTop: newModalTop + "px" });

        if (newModalTop < 16) {
          self.$el
            .find(".yam__close")
            .first()
            .css({ top: "-5px", right: "-1px" });
        }
      }

      $el.removeClass("hide");

      adjustHeight();
      bindResizeEvents();

      animateInModal();
      if (this.settings.autoInsertVideos) {
        this.insertVideos();
      }
    };

    Modal.prototype.onBeforeHide = function () {
      var $el = this.$el,
        self = this;

      TweenLite.fromTo(
        $el,
        0.3,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          onComplete: function () {
            $el.addClass("hide");
            self.done();
          },
        }
      );
    };

    Modal.prototype.onAfterHide = function () {
      // remove the fake scrollbar and un-pad the html tag
      $("html").css({ paddingRight: "" });
      $(".fake-scroll-bar").remove();

      this._exitRoute();
      this._resetVideoPlayers();
      this.done();
    };

    /*****************************************************************
     * overridden event bindings
     ******************************************************************/

    /**
     * Changed binding from 'mouseup' to 'click' event because mouseup
     * fires when scrolling the modal via scrollbar.
     */
    Modal.prototype._bindEvents = function () {
      this.$modal.on("click", { self: this }, this._eventMouseup);

      $(window).on("keyup", { self: this }, this._eventEscape);

      this.state.eventsBound = true;
    };

    Modal._unBindEvents = function () {
      this.$modal.off("click", this._eventMouseup);
      $(window).off("keyup", this._eventEscape);
      this.state.eventsBound = false;
    };

    /*****************************************************************
     * private helper methods
     ******************************************************************/

    /**
     * Initializes video players inside the modal. Will check to see if a
     * videoPlayer object exists on $(element).data('video'); If it does, that
     * will be used instead of instantiating a new player.
     * @return {undefined}
     */
    Modal.prototype._initVideoPlayers = function () {
      var self = this,
        $modal = this.$modal;

      this.state.videoPlayers = self.state.videoPlayers || [];

      $modal.find("[data-videoID]").each(function () {
        var $this = $(this);

        if ($this.data("video")) {
          self.state.videoPlayers.push($this.data("video"));
        } else {
          self.state.videoPlayers.push(new global.tl.VideoPlayer($(this)));
        }
      });
    };

    /**
     * Resets any video players in the modal.
     * @return {undefined}
     */
    Modal.prototype._resetVideoPlayers = function () {
      if (this.state.videoPlayers) {
        _.each(this.state.videoPlayers, function (videoPlayer) {
          videoPlayer.reset();
        });
      }
    };

    Modal.prototype.insertVideos = function () {
      var self = this;
      if (this.state.videoPlayers) {
        _.each(this.state.videoPlayers, function (videoPlayer) {
          videoPlayer.insert();
          if (!global.Modernizr.touch) {
            videoPlayer.play();
          }
        });
      }
    };

    /**
     * Adds a new route to Satnav so that the modal is deep-linkable.
     * @param {string} routeName The name of the route.
     */
    Modal.prototype._addRoute = function (routeName) {
      var self = this,
        route = (this.state.route = "modal/" + routeName);

      global.Satnav.navigate({
        path: route,
        directions: function () {
          self.show();
        },
      });

      global.Satnav.navigate({
        path: "/", //,
        // directions: function () {
        //   self.hide();
        // }
      });
    };

    /**
     * Navigates to the designated modal route using Satnav. Caches the
     * original route so that when the modal is closed, _exitRoute can
     * clean up.
     * @return {undefined}
     */
    Modal.prototype._navigateToRoute = function () {
      if (this.state.route === undefined) {
        return;
      }
      this.state.originalRoute = window.location.hash;
      window.location.hash = "#" + this.state.route;
    };

    /**
     * Returns the location hash to its original state, if an original route
     * exists.
     * @return {undefined}
     */
    Modal.prototype._exitRoute = function () {
      var originalRoute = this.state.originalRoute || "/",
        self = this,
        scrollTop = $(window).scrollTop();

      window.location.hash = originalRoute;
      delete this.state.originalRoute;

      $(window).scrollTop(scrollTop);
    };

    /**
     * Turns your modal content into an IScrollable object, if applicable.
     * 1. Checks if your modal contents is taller than the window
     *
     * If yes, then:
     * 1. wraps .modal__content with an iScroll element (<div class="iScroll-wrapper" id="iScroll-123">)
     * 2. Sets height of iScroll wrapper to comfortable height to fit into window
     * 3. Generates new iScroll object on iScroll wrapper, making contents scrollable.
     *
     * If contents is smaller than window:
     * 1. nothing will happen unless:
     * 2. if contents already has iScroll - it will attempt to destroy the
     *    iScroll object.
     * @return {undefined}
     */
    Modal.prototype._initIScroll = function () {
      var self = this,
        contentID,
        $content = this.$modal.find(".modal__content"),
        $iScrollWrapper,
        scroller = this.state.scroller;

      // set and/or get a DOM ID for the modal content.
      if (this.$modal.find(".iScroll-wrapper").length > 0) {
        $iScrollWrapper = this.$modal.find(".iScroll-wrapper");
        contentID = $iScrollWrapper.attr("id");
      } else {
        contentID = _.uniqueId("iScroll-");
        $content.wrap(
          '<div id="' + contentID + '" class="iScroll-wrapper"></div>'
        );
        $iScrollWrapper = this.$modal.find("#" + contentID);
      }

      // resizes content container to fit window
      function resizeContent() {
        $iScrollWrapper.css(
          "height",
          $(window).height() -
            self.$modal.find(".yam__content").position().top -
            74 +
            "px"
        );
      }

      // check if content is larger than window
      function checkWindow() {
        if ($iScrollWrapper.outerHeight() > $(window).height()) {
          // resize content container to fit
          resizeContent();

          // add/update iScroll
          if (scroller) {
            scroller.refresh();
          } else {
            scroller = self.state.scroller = new global.IScroll(
              "#" + contentID
            );
          }
        } else {
          // undo iscroll
          $iScrollWrapper.css("height", "");
          if (scroller) {
            scroller.destroy();
            scroller = self.state.scroller = null;
          }
        }
      }

      checkWindow();
    };

    /**
     * Shows the modal and updates the hash route, if applicable.
     * Note: use this over just using show() to ensure that all modals are
     * deep-linkable.
     * @return {object} the modal instance
     */
    Modal.prototype.routeShow = function () {
      if (this.state.route === undefined) {
        this.show();
      } else {
        this._navigateToRoute();
      }
      return this;
    };

    Modal.prototype._appendToBody = function () {
      this.$modal.appendTo("body");
    };

    // public API
    global.tl = global.tl || {};
    global.tl.Modal = Modal;
  })(this);

  (function (global) {
    "use strict";

    var miiSpeech,
      speechUrl = global.tl.utils.langPath + "/assets/miiSpeech.json",
      speech,
      readyCallbacks = [],
      defaultCategory = "default",
      state = {
        ready: false,
      };

    /**
     * Initializes the miiSpeech component.
     * @return {undefined}
     */
    function init() {
      $.ajax({
        url: speechUrl,
        dataType: "json",
        success: function (data) {
          speech = data;
          state.ready = true;
          ready();
        },
        error: function (data) {
          console.log("Error getting miiSpeech data:");
          console.log(data);
        },
      });
    }

    /**
     * Get a random speech entry. Optionally, pass in a category to sample from.
     * NOTE: Currently the only category available is 'default'. Perhaps in the
     * future we will add more - if/when we do, we'll be able to support it.
     * @param  {string} category The category name to sample from.
     * @return {string}          A mii speech phrase/sentence.
     */
    function getRandomSpeech(category) {
      if (category !== undefined && speech[category] !== undefined) {
        return _.sample(speech[category]);
      } else {
        return _.sample(speech[defaultCategory]);
      }
    }

    /**
     * Hook allowing other components to run functions when this component
     * is ready for action. Stores functions in an array and calls them
     * in order when this component is ready.
     * @param  {Function} fn Callback to run when miiSpeech is ready.
     * @return {undefined}
     */
    function ready(fn) {
      var len, i;

      readyCallbacks = readyCallbacks || [];

      if (fn !== undefined) {
        readyCallbacks.push(fn);
      }

      if (state.ready) {
        for (i = 0, len = readyCallbacks.length; i < len; i += 1) {
          readyCallbacks.splice(0, 1)[0]();
        }
      }
    }

    // initialize
    init();

    // public API
    miiSpeech = {
      ready: ready,
      getRandomSpeech: getRandomSpeech,
    };

    global.tl = global.tl || {};
    global.tl.miiSpeech = miiSpeech;
    return miiSpeech;
  })(this);

  (function (global) {
    "use strict";

    var MiiCycle = function ($target) {
      this.$miis = $target;
      this.miiCount = $target.length;
      this.duration = 8000;
      this.nextMii = 0;

      $target
        .css({
          opacity: 0,
        })
        .removeClass("hide")
        .find(".speech-bubble")
        .css("opacity", 0);

      this.changeMii(this.$miis.eq(this.nextMii));
    };

    /**
     * Manages the transition of one mii to the next one in the cycle. Will
     * run indefinitely.
     * @param  {object} $targetIn  jQuery selection of the target to transition in.
     * @param  {object} $targetOut jQuery selection of target to transition out.
     * @return {undefined}
     */
    MiiCycle.prototype.changeMii = function ($targetIn, $targetOut) {
      var self = this,
        cb = function () {
          self.$activeMii = $targetIn;
          self.nextMii =
            self.nextMii + 1 > self.miiCount - 1 ? 0 : self.nextMii + 1;

          _.delay(function () {
            self.changeMii.call(
              self,
              self.$miis.eq(self.nextMii),
              self.$activeMii
            );
          }, self.duration);
        };

      if ($targetOut) {
        this.animateMiiOut($targetOut);
        this.animateMiiIn($targetIn, cb);
      } else {
        this.animateMiiIn($targetIn, cb);
      }
    };

    /**
     * Animates a mii out and optionally calls a callback when the transition
     * is done.
     * @param  {object}   $targetOut jQuery selection of target
     * @param  {Function} [callback]   callback function to fire.
     * @return {undefined}
     */
    MiiCycle.prototype.animateMiiOut = function ($targetOut, callback) {
      var transitionDuration = 0.5,
        outTweenSettings = {
          opacity: 0,
          x: -150,
        },
        outTween;

      if (typeof callback === "function") {
        outTweenSettings.onComplete = function () {
          callback();
        };
      }

      TweenLite.to($targetOut, transitionDuration, outTweenSettings);
    };

    /**
     * Animates a mii in and optionally calls a callback when the transition
     * is done.
     * @param  {object}   $targetIn jQuery selection of target
     * @param  {Function} [callback]   callback function to fire.
     * @return {undefined}
     */
    MiiCycle.prototype.animateMiiIn = function ($targetIn, callback) {
      var transitionDuration = 0.5,
        $speechBubble = $targetIn.find(".speech-bubble"),
        bubbleTween,
        inTween;

      // animate in the talk bubble separately
      if ($speechBubble.length > 0) {
        $speechBubble.css("opacity", 0);

        bubbleTween = new global.TimelineLite();
        bubbleTween.add(
          global.TweenLite.to($speechBubble, 0, {
            opacity: 0,
          })
        );
        bubbleTween.add(
          global.TweenLite.to($speechBubble, 0.4, {
            opacity: 0,
          })
        );
        bubbleTween.add(
          global.TweenLite.to($speechBubble, 0.2, {
            opacity: 1,
            scaleX: 1.3,
            scaleY: 1.3,
          })
        );
        bubbleTween.add(
          global.TweenLite.to($speechBubble, 0.1, {
            scaleX: 1,
            scaleY: 1,
          })
        );
      }

      TweenLite.fromTo(
        $targetIn,
        transitionDuration,
        {
          x: 150,
          opacity: 1,
        },
        {
          x: 0,
          opacity: 1,
          onComplete: function () {
            if (bubbleTween) {
              bubbleTween.play();
            }
            if (typeof callback === "function") {
              callback();
            }
          },
        }
      );
    };

    global.tl = global.tl || {};
    global.tl.MiiCycle = MiiCycle;
  })(this);

  (function (global) {
    "use strict";

    var state = {
      cloudTweens: [],
    };

    function startClouds() {
      _.each(state.cloudTweens, function (tween) {
        tween.play();
      });
    }

    function stopClouds() {
      _.each(state.cloudTweens, function (tween) {
        tween.stop();
      });
    }

    /**
     * Animates the clouds behind the island.
     * @return {undefined}
     */
    function initClouds() {
      var speedMin = 10,
        speedMax = 15,
        windowWidth = $(window).width();

      $("#clouds .cloud").each(function () {
        var $this = $(this),
          cloudWidth = $this.outerWidth(),
          path = [0 - cloudWidth, windowWidth + cloudWidth],
          startPosition = _.random(path[0], path[1]),
          transitionDuration = windowWidth / _.random(speedMin, speedMax),
          duration1 =
            (Math.abs(startPosition - path[0]) / windowWidth) *
            transitionDuration,
          duration2 =
            (Math.abs(startPosition - path[1]) / windowWidth) *
            transitionDuration,
          tween1 = new global.TimelineMax({
            ease: "Linear.easeNone",
            repeat: -1,
          });

        if (!global.Modernizr.touch) {
          global.TweenLite.fromTo(
            $this,
            0.5,
            {
              opacity: 0,
            },
            {
              opacity: 1,
            }
          );

          tween1
            .fromTo(
              $this,
              duration2,
              {
                left: startPosition,
              },
              {
                left: path[1],
              }
            )
            .set($this, {
              left: path[0],
            })
            .to($this, duration1, {
              left: startPosition,
            });

          state.cloudTweens.push(tween1);
        } else {
          $this.css("left", startPosition);
        }
      });

      global.tl.adapt.respondTo(
        "any",
        function (screenName, currentScreenName) {
          // hide clouds when screen is smaller than mdlg
          if (global.tl.screenUtils.isScreenSmallerThan("mdlg")) {
            stopClouds();
          } else {
            startClouds();
          }
        },
        {
          name: "clouds",
          defer: false,
        }
      );
    }

    global.tl = global.tl || {};
    global.tl.clouds = {
      init: initClouds,
      start: startClouds,
      stop: stopClouds,
    };
  })(this);

  (function (global) {
    "use strict";

    var breakpoints = {
        sm: {},
        md: {},
        mdlg: {},
        lg: {},
        any: {},
      },
      state = {
        currentScreenName: undefined,
      },
      throttledOnResize;

    /**
     * Fires adaptive layout JS for the desired screen size name.
     * @param  {string} screenName The screen size name. Supports 'sm', 'md', 'lg'.
     *                             If not specified, defaults to global.tl.screenUtils.getScreenSizeName().
     * @return {undefined}
     */
    function adapt(screenName) {
      screenName = screenName || global.tl.screenUtils.getScreenSizeName();

      if (state.currentScreenName !== screenName) {
        if (breakpoints[screenName]) {
          _.each(breakpoints[screenName], function (fn) {
            fn(screenName);
          });

          _.each(breakpoints.any, function (fn) {
            fn(screenName, state.currentScreenName);
          });
        }

        state.currentScreenName = screenName;
      }
    }

    /**
     * Adds a function to be fired when the screen resizes to a specific screen
     * size name.
     * @param  {string}   screenName The screen size name to fire your callback on.
     *                               NOTE: `any` will fire function at any change in
     *                               screen breakpoint.
     * @param  {Function} fn         The callback to fire when desired screen size
     *                               is reached.
     * @param  {object}   [options]  Additional options object
     * @param {string} [options.name]  The name of your callback (helpful for debug)
     * @param {boolean} [options.defer = true] Whether or not to defer this callback
     *                  for the the next time the screen changes. If `true`, and
     *                  the current screen size === `screenName`, the function will
     *                  be called immediately. If `false` and current screen size
     *                  === `screenName`, function will be deferred until the next
     *                  time the screen size changes into `screenName` size.
     * @return {undefined}
     */
    function respondTo(screenName, fn, options) {
      // guardian
      if (typeof fn !== "function") {
        console.log("Second argument must be a function");
        return;
      }

      options = options || {};

      var fnName =
        typeof options.name === "string" ? options.name : _.uniqueId("cb-");

      breakpoints[screenName] = breakpoints[screenName] || {};
      breakpoints[screenName][fnName] = fn;

      if (
        (state.currentScreenName === screenName || screenName === "any") &&
        options.defer === false
      ) {
        fn();
      }
    }

    /**
     * Gets the breakpoints object, whichs shows all callbacks that have been defined
     * for each breakpoint.
     * @return {object} The breakpoints (callbacks) object.
     */
    function getCallbacks() {
      return breakpoints;
    }

    // create throttled onResize callback
    throttledOnResize = _.throttle(function () {
      adapt(global.tl.screenUtils.getScreenSizeName());
    }, 200);

    // on window resize, call throttled onResize function.
    $(window).on("resize", function () {
      throttledOnResize();
    });

    // call the resize method once to init.
    throttledOnResize();

    // public API
    global.tl.adapt = {
      adapt: adapt,
      respondTo: respondTo,
      getCallbacks: getCallbacks,
    };
  })(this);

  (function (global) {
    "use strict";

    /* Mii Crowd */
    var MIIS = {
      Single: _.range(1, 30),
      Double: _.range(1, 7),
    };
    var SPEECH_TIMEOUT = 5000;
    var BUBBLE_DISPLAY_TIME = 5000;
    var FADE_IN_TIME = 200;
    var FADE_OUT_TIME = 400;
    var miiCrowdTimeout;

    function generateSpeechBubble() {
      var $paragraph = $("<p>");
      var $speechBubble = $("<div>").addClass("speech-bubble");

      if (_.random(1, 10) === 1) {
        // render an emoticon
        $speechBubble.addClass("emoticon");
        $paragraph.addClass(_.sample(["burger", "heart"]));
      } else {
        /* global MII_SPEECH */
        $paragraph.html(global.tl.miiSpeech.getRandomSpeech()); //_.sample(MII_SPEECH.default)
      }

      $speechBubble.append($paragraph);

      return $speechBubble;
    }

    function shuffleMiis() {
      var $allMiiSlots = $(".mii.shuffle"),
        $singleMiiSlots = $allMiiSlots.filter(":not(.wide)"),
        $doubleMiiSlots = $allMiiSlots.filter(".wide"),
        singleMiis = _.sample(MIIS.Single, $singleMiiSlots.length),
        doubleMiis = _.sample(MIIS.Double, $doubleMiiSlots.length),
        timeout = 0;

      // remove existing miis from slots and hide miis
      $allMiiSlots.each(function () {
        $(this).removeClass(function (index, css) {
          return (css.match(/\bmii-\S+/g) || []).join(" ");
        });
        $(this).hide();
      });

      // shuffle single miis
      $singleMiiSlots.each(function () {
        var miiNumber = singleMiis.splice(0, 1);
        $(this).addClass("mii-" + miiNumber);
        $(this).data("mii", miiNumber.toString());
      });

      // shuffle double miis
      $doubleMiiSlots.each(function () {
        var miiNumber = doubleMiis.splice(0, 1);
        $(this).addClass("mii-" + miiNumber + "-w");
        $(this).data("mii", miiNumber.toString() + "-w");
      });

      // fade in miis over 300ms staggered by 75ms
      setTimeout(function () {
        $allMiiSlots
          .sort(function () {
            return Math.round(Math.random()) - 0.5;
          })
          .each(function () {
            (function (mii) {
              setTimeout(function () {
                $(mii).fadeIn(50);
              }, (timeout += 25));
            })(this);
          });
      }, 1000);
    }

    function triggerSpeech() {
      /* only speak if crowd isn't hidden */
      if ($("#miiCrowd").css("display") !== "none") {
        $("#miiCrowd .mii").random().speak();

        setTimeout(function () {
          $("#miiCrowd .mii").random().speak();
        }, SPEECH_TIMEOUT * 0.33);

        setTimeout(function () {
          $("#miiCrowd .mii").random().speak();
        }, SPEECH_TIMEOUT * 0.66);
      }

      miiCrowdTimeout = setTimeout(function () {
        triggerSpeech();
      }, SPEECH_TIMEOUT);
    }

    // Extend jQuery syntax to randomly select an element (in this case a Mii) from the results of a selector
    $.fn.random = function () {
      return this.eq(Math.floor(Math.random() * this.length));
    };

    // Extend jQuery syntax to trigger a Mii speech bubble
    // TODO: I realize this probably isn't jQuery best practices, but it looks pretty, syntactically  :) -Nick
    $.fn.speak = function (timeout) {
      var $mii = $(this),
        isMii = $mii.hasClass("mii"),
        isSpeaking = $mii.children(".speech-bubble").length > 0,
        $speechBubble = generateSpeechBubble(),
        displayTime = timeout || BUBBLE_DISPLAY_TIME;

      if (!isMii || isSpeaking) {
        return this;
      } // If this isn't a mii element, or it's engaged in speech, do nothing

      // Add the Mii back to the DOM as the last child of the parent
      // This ensures that speech bubbles render stacked along the z-index and not behind another mii.
      $mii.parent().append($mii);

      $mii.empty().append($speechBubble);

      $speechBubble.fadeTo(FADE_IN_TIME, 1, function () {
        var fadeOutAndRemove = function () {
          $speechBubble.fadeTo(FADE_OUT_TIME, 0);
          $speechBubble.remove();
        };
        setTimeout(fadeOutAndRemove, displayTime);
      });

      return this;
    };

    function start() {
      if (miiCrowdTimeout == null) {
        miiCrowdTimeout = setTimeout(function () {
          triggerSpeech();
        }, 1000);
      }
    }

    function stop() {
      if (miiCrowdTimeout != null) {
        window.clearTimeout(miiCrowdTimeout);
        miiCrowdTimeout = null;
      }
    }

    function debug(enable) {
      if (enable === false) {
        $("#miiCrowd .mii").unbind("click");
        start();
      } else {
        stop();
        $("#miiCrowd .mii").on("click", function () {
          var $mii = $(this);
          $mii.empty();
          $mii.speak(9999999);
        });
      }
    }

    // start
    $(document).ready(function () {
      global.tl.miiSpeech.ready(function () {
        shuffleMiis();
        start();
      });
    });

    // public API
    var miiCrowd = {
      debug: debug,
      start: start,
      stop: stop,
    };

    global.tl = global.tl || {};
    global.tl.miiCrowd = miiCrowd;
  })(this);

  (function (global, $) {
    "use strict";

    var tl = global.tl;

    $(window).unload(function () {
      $(window).unbind("unload");
    });

    /**
     * Inserts global elements into the page. Includes the footer, nintendo nav,
     * and social.
     * @return {undefined}
     */
    function globalElements() {
      var lang = $("html").attr("lang"),
        esrbDescription = global.translations.esrbDescription;

      // Insert global nav
      global.GlobalNav.insert({
        target: "#global-header",
        nav: true,
      });

      // Insert footer
      global.Footer.insert({
        target: "#nintendo-footer",
        threeds: false,
        ds: false,
        wii: false,
        nwii: false,
        clubn: true,
        newsletter: true,
        follow: true,
        esrb: "e",
        esrb_descriptor: esrbDescription,
        privacy: true,
      });

      // Insert social links
      global.Social.insert({
        target: "#nintendo-social",
      });
    }

    /**
     * Cleans a pathname for use as a hash
     * @param  {string} path the path name to clean up
     * @return {string}      the cleaned path name
     */
    function getPathName(path) {
      return path.replace(/[:?=\/\.]*/g, "");
    }

    /**
     * Searches DOM for videos that should be displayed in modals and provides
     * a method call to open video in modal.
     * @return {undefined}
     */
    function mediaModals() {
      var templateVideoModal = $("#templateVideoModal").html(),
        templateImageModal = $("#templateImageModal").html(),
        paths = [];

      $("[data-modal=true][data-videoID]").each(function () {
        var $this = $(this),
          modalColor = $this.attr("data-modalColor") || "blue",
          title = $this.attr("data-videoTitle"),
          videoID = $this.attr("data-videoID"),
          previewImageUrl = $this.attr("data-videoPreview"),
          cleanPath = "videos/" + global.tl.utils.slugify(title || videoID),
          path = "modal/" + cleanPath,
          $el,
          videoModal;

        // create a new modal only if we don't already have one
        if (_.indexOf(paths, path) === -1) {
          $el = $(templateVideoModal).clone();

          $el
            .addClass(modalColor)
            .find(".media")
            .attr("data-videoID", videoID)
            .attr("data-videoPreview", previewImageUrl);

          if (title !== "") {
            $el.find(".title").html(title);
          }

          $el.appendTo("body");

          videoModal = new global.tl.Modal($el, {
            route: cleanPath,
            autoInsertVideos: true,
          });

          paths.push(path);
        }

        $(this).data("showModal", function () {
          window.location.hash = "#" + path;
        });
      });

      // screenshots and images
      $("[data-modal=true][data-imageUrl]").each(function () {
        var $this = $(this),
          modalColor = $this.attr("data-modalColor") || "blue",
          title = $this.attr("data-imageTitle"),
          imageUrl = $this.attr("data-imageUrl"),
          description = $this.attr("data-description"),
          cleanedPath = "media/" + getPathName(imageUrl),
          path = "modal/" + cleanedPath,
          paths = [],
          $el,
          imageModal;

        // create a modal only if we don't already have one
        if (_.indexOf(paths, path) === -1) {
          $el = $(templateImageModal).clone();

          $el
            .addClass(modalColor)
            .find(".media")
            .append('<img src="' + imageUrl + '" alt="' + description + '" />');

          if (title !== "") {
            $el.find(".title").html(title);
          }
          if (description !== "") {
            $el.find(".description").html(description).show();
          }

          $el.appendTo("body");

          imageModal = new global.tl.Modal($el, {
            route: cleanedPath,
          });

          paths.push(path);
        }

        $(this).data("showModal", function () {
          window.location.hash = "#" + path;
        });
      });
    }

    /**
     * searches DOM for videos and initializes a video player for each.
     * @return {undefined}
     */
    function videos() {
      $(".video-data[data-videoID]").each(function () {
        var $this = $(this);
        $this.data("video", new global.tl.VideoPlayer($this));
      });
    }

    /**
     * Searches DOM for media items and binds a click event to them to open
     * the modal associated with them.
     * @return {undefined}
     */
    function mediaItems() {
      $(".media-item").each(function () {
        var $this = $(this);

        $this.on("click", function () {
          if ($this.data("showModal") !== undefined) {
            $this.data("showModal")();
          }
        });
      });
    }

    function updateDateSpecificCopy() {
      var RELEASE_DATE = new Date(2014, 5, 6).getTime();
      var now = new Date().getTime();

      var $modal = $(".buy-now-modal");

      if (now >= RELEASE_DATE) {
        // Buy Now copy
        $("#buyNow")
          .removeClass(global.buyNow.preOrder.navSprite)
          .addClass(global.buyNow.release.navSprite)
          .text(global.buyNow.release.navText);
        $("#buy-now--availability-date").hide();

        $(".mobile-buy-now")
          .find("." + global.buyNow.preOrder.navSpriteMobile)
          .removeClass(global.buyNow.preOrder.navSpriteMobile)
          .addClass(global.buyNow.release.navSpriteMobile)
          .text(global.buyNow.release.navText);

        $modal.find(".title").text(global.buyNow.release.modalTitle);
        $modal
          .find(".col--left .description")
          .text(global.buyNow.release.modalLeftDesc);
        $modal.find(".col--left .cta").text(global.buyNow.release.modalLeftCTA);
        $modal
          .find(".col--right .description")
          .text(global.buyNow.release.modalRightDesc);
      }
    }

    /**
     * JS for the main navigation.
     * 1) binds events to open the buy-now modal.
     * 2) binds events to toggle mobile nav.
     * @return {undefined}
     */
    function mainNavigation() {
      var $buyNow = $("#buyNow"),
        buyNowModal = new global.tl.Modal(
          $(".global-nav").find(".buy-now-modal"),
          {
            route: "buy-now",
            appendToBody: true,
          }
        ),
        state = {
          mobileNavActive: false,
        };

      $buyNow.on("click", function (e) {
        e.preventDefault();
        window.location.hash = "#modal/buy-now";
      });

      $(".mobile-top .btn--nav-toggle").on("click", function (e) {
        e.preventDefault();
        var $this = $(this),
          $nav = $(".pages.mobile"),
          navHeight = $nav.outerHeight();

        if (state.mobileNavActive === false) {
          // change button sprite
          $this.removeClass("off").addClass("on");

          // animate in nav
          global.TweenLite.fromTo(
            $nav,
            0.5,
            {
              top: -navHeight,
            },
            {
              top: 40,
            }
          );
        } else {
          $this.removeClass("on").addClass("off");

          // animate in nav
          global.TweenLite.to($nav, 0.5, {
            top: -navHeight,
          });
        }

        // toggle state
        state.mobileNavActive = state.mobileNavActive ? false : true;
      });
    }

    /**
     * Use JS to center tihe #island div correctly.
     * @return {undefined}
     */
    function centerIslandMask() {
      var $cloudContainer = $("#clouds"),
        $islandMask = $("#clouds .global-island-top"),
        cloudContainerWidth = $cloudContainer.width(),
        islandWidth = $islandMask.outerWidth(),
        bodyWidth = $("body").width();

      //    if(bodyWidth % 2 === 0){
      //      $islandMask.css({
      //        'margin-left': '-1px'
      //      });
      //    }
      $islandMask.removeClass("hide");
    }

    /**
     * Randomly selects a phrase from the miiSpeech array for
     * any speech bubbles on the page marked with the .random class
     * @return {undefined}
     */
    function randomizeMiiSpeech() {
      global.tl.miiSpeech.ready(function () {
        $("body")
          .find(".speech-bubble.random p")
          .each(function () {
            $(this).html(global.tl.miiSpeech.getRandomSpeech());
          });
      });
    }

    /**
     * Handle clicks on items tied to pointRoll events.
     * @return {undefined}
     */
    function pointRollLinks() {
      $("[data-pointRoll]").each(function () {
        var $this = $(this),
          actionName = $this.attr("data-pointRoll");

        $this.on("click", function () {
          global.tl.pointRoll.trackAction(actionName);
        });
      });
    }

    /**
     * Track Pages for pointRoll
     * @return {undefined}
     */
    function pointRollPageTracking() {
      var actionName,
        pathName = window.location.pathname;

      if (pathName.indexOf("sharing-miis") > -1) {
        actionName = "sharingMiisPage";
      } else if (pathName.indexOf("making-miis") > -1) {
        actionName = "makingMiisPage";
      } else if (pathName.indexOf("gallery") > -1) {
        actionName = "galleryPage";
      } else if (pathName === "/") {
        actionName = "homePage";
      }

      global.tl.pointRoll.trackAction(actionName);
    }

    // Things to fire off when document is ready.
    $(document).ready(function () {
      // footer, nintendo nav, social
      if (document.body.classList.contains("og")) {
        globalElements();
      }

      updateDateSpecificCopy();

      // videos and modals
      mediaModals();
      videos();
      mediaItems();

      // main navigation
      mainNavigation();

      // mii speech
      randomizeMiiSpeech();

      // clouds
      global.tl.clouds.init();

      // center the island mask
      centerIslandMask();

      // pointRoll
      pointRollPageTracking();
      pointRollLinks();

      // initialize satnav - for hashchange routing
      global.Satnav({
        // html5: true, // use HTML5 pushState
        // force: true, // force change event on same route
        poll: 100, // poll hash every 100ms if polyfilled
      });

      if (global.location.hash !== "" && global.location.hash !== "/") {
        global.Satnav.go();
      }
    });

    $(window).on("resize", function () {
      centerIslandMask();
    });
  })(this, jQuery);

  (function (global) {
    "use strict";

    // NOTE: on mobile view, turn off all click events except for one on main
    // island, which will redirect you to a /mobile/locations/ page.

    // only run on home page.
    if (window.location.pathname !== "/" && window.location.pathname !== "") {
      return;
    }

    var islandID = "island",
      $island = $("#" + islandID),
      state = {
        locations: {
          // locationName: locationObject
        },
      };

    /**
     * IslandLocation constructor.
     * @param {object} $target jQuery DOM selection of location.
     */
    function IslandLocation($target) {
      this.$location = $target;
      this.$marker = $target.find(".marker");
      this.modal = new global.tl.Modal($target.find(".island-modal"), {
        route: $target.attr("data-location"),
        autoInsertVideos: true,
      });
      this._bindEvents();
      this._centerMarker();
    }

    /**
     * Binds events for the island locations
     * @return {undefined}
     */
    IslandLocation.prototype._bindEvents = function () {
      var self = this,
        $location = this.$location;

      $location.on("mouseenter", function () {
        self.showMarker();
      });

      $location.on("mouseleave", function () {
        self.hideMarker();
      });

      $location.on("click", function () {
        self.modal.routeShow();
      });

      this.modal.$modal.on("click", function (e) {
        e.stopPropagation();
      });
    };

    IslandLocation.prototype._centerMarker = function () {
      var $marker = this.$marker,
        width;

      $marker
        .css({
          opacity: 0,
        })
        .removeClass("hide");

      $marker
        .css({
          left: this.$location.outerWidth() / 2 - $marker.outerWidth() / 2,
        })
        .addClass("hide")
        .css({
          opacity: 1,
        });
    };

    /**
     * Shows the marker.
     * @return {undefined}
     */
    IslandLocation.prototype.showMarker = function () {
      var inTween = global.TweenLite.fromTo(
        this.$marker,
        0.5,
        {
          opacity: 0,
          marginTop: 0,
        },
        {
          opacity: 1,
          marginTop: -30,
        }
      );

      this.$marker.removeClass("hide");

      inTween.play();
    };

    /**
     * Hides the marker.
     * @return {undefined}
     */
    IslandLocation.prototype.hideMarker = function () {
      var $marker = this.$marker;

      var outTween = global.TweenLite.fromTo(
        this.$marker,
        0.5,
        {
          opacity: 1,
          marginTop: -30,
        },
        {
          opacity: 0,
          marginTop: 0,
          onComplete: function () {
            $marker.addClass("hide");
          },
        }
      );

      outTween.play();
    };

    /**
     * Changes the marker from the full text label to (...) and shows the marker
     * This is used for touch devices.
     * @return {undefined}
     */
    IslandLocation.prototype.conciseMarker = function () {
      this.$marker.addClass("concise");
      this._centerMarker();
      this.$marker.removeClass("hide");
    };

    /**
     * Changes the marker from concise label to full text label.
     * @return {undefined}
     */
    IslandLocation.prototype.verboseMarker = function () {
      this.$marker.addClass("hide");
      this._centerMarker();
      this.$marker.removeClass("concise");
    };

    /**
     * Use JS to center tihe #island div correctly.
     * @return {undefined}
     */
    function centerIsland() {
      var islandWidth = $island.outerWidth(),
        windowWidth = $(window).width();

      if (islandWidth > windowWidth) {
        $island.css({
          "margin-left": -((islandWidth - windowWidth) / 2) + "px",
        });
      } else {
        $island.css({
          "margin-left": "",
        });
      }

      if (global.tl.screenUtils.isScreenSmallerThan("mdlg")) {
        $island.css("height", $(window).width() * (250 / 380));
      } else {
        $island.css("height", "");
      }
    }

    /**
     * Callback when window is resized. Throttled to once every 200ms.
     * @return {undefined}
     */
    var throttledWindowChecks = _.throttle(function () {
      var sUtils = global.tl.screenUtils,
        screenSize = sUtils.getScreenSizeName();

      centerIsland();

      state.currentScreenSize = screenSize;
    }, 200);

    /**
     * Kicks off island animations/ui when DOM is ready.
     * @return {undefined}
     */
    $(document).ready(function () {
      /**
       * Entire-island events
       * @return {undefined}
       */
      (function bindEvents() {
        $island.on("click", function () {
          if (global.tl.screenUtils.isScreenSmallerThan("mdlg")) {
            global.tl.utils.goToPage("/mobile/locations/");
          }
        });
      })();

      (function initLocations() {
        var interval = 100,
          delayCounter = 0,
          yes = false;

        $island.find(".island__location").each(function () {
          var $this = $(this),
            locationName = $this.attr("data-location");

          state.locations[locationName] = new IslandLocation($this);

          if (global.Modernizr.touch) {
            state.locations[locationName].conciseMarker();
          }
        });

        // Preview all the markers on the island
        if (!global.Modernizr.touch) {
          $(window).on("imagesLoaded", function () {
            _.each(_.shuffle(state.locations), function (location) {
              if (yes === true) {
                _.delay(function () {
                  location.showMarker();
                  _.delay(function () {
                    location.hideMarker();
                  }, 1000);
                }, (delayCounter += interval));
                yes = false;
              } else {
                yes = true;
              }
            });
          });
        }
      })();

      // events / kick off
      $(window).on("resize", throttledWindowChecks);
      centerIsland();
    });
  })(this);

  (function (global) {
    "use strict";

    var $news = $(".news .content"),
      $marquee = $(".news-ticker .marquee"),
      newsData; // retrieved via AJAX

    /**
     * Intro animation:
     * 1. glass pane
     * 2. center cloud
     * 3. left/right clouds
     * 4. news/new item
     * @return {undefined}
     */
    function introAnimation() {
      var tl = new global.TimelineMax();

      // skip all the animations on small screens
      if (global.tl.screenUtils.isScreenSmallerThan("lg")) {
        $(
          ".new-item, .news, .news-ticker, .cloud--center, .cloud--left, .cloud--right"
        ).css("opacity", 1);
        return;
      }

      tl.add(
        global.TweenLite.fromTo(
          $(".cloud--center"),
          1.5,
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            ease: "Elastic.easeOut",
          }
        )
      );

      tl.add(
        global.TweenLite.fromTo(
          $(".cloud--left"),
          1.5,
          {
            opacity: 0,
            y: 100,
            x: -100,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            ease: "Elastic.easeOut",
          }
        ),
        "0.4"
      );

      tl.add(
        global.TweenLite.fromTo(
          $(".cloud--right"),
          1.5,
          {
            opacity: 0,
            y: 100,
            x: 100,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            ease: "Elastic.easeOut",
          }
        ),
        "0.4"
      );

      tl.add(
        global.TweenMax.staggerFromTo(
          $(".new-item, .news, .news-ticker"),
          0.2,
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
          0.2
        ),
        "0.6"
      );

      tl.play();
    }

    /**
     * Initializes the scrolling news marquee.
     * @param  {object} news Parsed JSON object of news itesm
     * @return {undefined}
     */
    function initMarquee(news) {
      var marqueeContent = _.reduce(
          news,
          function (content, news) {
            return (
              content +
              '<div class="marquee-item"><div class="sprite-shared-home home-tlz-sm-talk-bubble separator"></div>' +
              news +
              "</div>"
            );
          },
          ""
        ),
        $marqueeContent = $(marqueeContent),
        $marqueeDupe = $marqueeContent.clone(),
        $marqueeContainer = $('<div id="marqueeContainer"></div>'),
        contentWidth = 0,
        transitionDuration,
        tween;

      // 10 seconds of duration for every 1000px of content width
      function getTransitionDuration(width) {
        return (width / 1000) * 10;
      }

      $marqueeContainer.html($marqueeContent).append($marqueeDupe);

      $marquee.html($marqueeContainer);

      $marquee.find(".marquee-item").each(function () {
        contentWidth += $(this).measure().width + 30;
      });

      $marqueeContainer.css("width", contentWidth);

      // adaptive layout - run marquee on large screens, but destroy tween on
      // small screens.
      global.tl.adapt.respondTo(
        "lg",
        function () {
          tween = new global.TweenMax(
            $marqueeContainer,
            getTransitionDuration(contentWidth),
            {
              x: -(contentWidth / 2) - 1,
              repeat: -1, // infinite repeat
              ease: "Linear.easeNone",
            }
          );
        },
        {
          name: "marquee",
          defer: false,
        }
      );

      // adaptive layout - anything smaller than lg, remove marquee.
      global.tl.adapt.respondTo(
        "any",
        function () {
          if (global.tl.screenUtils.isScreenSmallerThan("lg")) {
            global.TweenMax.killTweensOf($marqueeContainer);
          }
        },
        {
          name: "marquee",
        }
      );
    }

    /**
     * Gets news content by retrieving the news.json file.
     * @return {undefined}
     */
    function getNewsContent() {
      $.ajax({
        url: global.tl.utils.langPath + "/news.json",
        dataType: "json",
        success: function (data) {
          initNewsSlider(data.featured);
          initMarquee(data.ticker);
        },
        error: function (data) {
          console.warn("error getting news!");
        },
      });
    }

    /**
     * Initializes the news slider.
     * @param  {object} newsItems parsed JSON object of news items.
     * @return {undefined}
     */
    function initNewsSlider(newsItems) {
      var mySwiper,
        // for some reason assemble can't handle this template in a <script type="text/template"> tag...
        template = _.template(
          "" +
            '<div class="news-item swiper-slide">' +
            ' <div class="news-item__container">' +
            '   <a href="<%= item.url %>" target="_blank">' +
            '     <img class="image" src="<%= item.imageUrl %>" alt="<%= item.imageAlt %>">' +
            '     <p class="description">' +
            "       <%= item.description %>" +
            "     </p>" +
            "   </a>" +
            "   <% if (item.modal) { %>" +
            '   <div class="modal news-modal hide blue">' +
            '     <div class="yam__close sprite-shared-global global-modal-close-button"></div>' +
            '     <div class="modal__top">' +
            '       <h2 class="title"><%= window.translations.newsModalTitle %></h2>' +
            "     </div>" +
            '     <div class="modal__content-container">' +
            '       <div class="modal__content">' +
            '         <h2 class="news-modal__title"><%= item.modal.title %></h2>' +
            "         <% if (item.modal.imageUrl) { %>" +
            '         <img class="news-modal__image" src="<%= item.modal.imageUrl%>">' +
            "         <% } %>" +
            '         <p class="news-modal__description"><%= item.modal.description %></p>' +
            '         <div class="news-modal__description-backdrop"></div>' +
            "       </div>" +
            "     </div>" +
            '     <div class="modal__offset-mii mii medium mii-librarian">' +
            '         <div class="speech-bubble large">' +
            "           <p><%= item.modal.defaultMiiText %></p>" +
            "         </div>" +
            "       </div>" +
            '     <div class="modal__offset-section"></div>' +
            "   </div>" +
            "   <% } %>" + //close modal `if`.
            " </div>" +
            "</div>"
        ),
        newsItemMarkup = "";

      // create a news item for every news item in the JSON
      _.each(newsItems, function (item) {
        newsItemMarkup += template({
          item: item,
        });
      });

      $news.find(".swiper-wrapper").html(newsItemMarkup);

      // bind events to the next/prev buttons
      if (newsItems.length > 3) {
        $(".news__btn--prev")
          .removeClass("hide")
          .on("click", function () {
            if (typeof mySwiper === "object") {
              mySwiper.swipePrev();
            }
          });

        $(".news__btn--next")
          .removeClass("hide")
          .on("click", function () {
            if (typeof mySwiper === "object") {
              mySwiper.swipeNext();
            }
          });
      }

      // adaptive layout - ensure swiper is active on large screens.
      global.tl.adapt.respondTo(
        "lg",
        function () {
          if (
            typeof mySwiper === "object" &&
            typeof mySwiper.destroy === "function"
          ) {
            try {
              mySwiper.destroy(true);
            } catch (e) {
              console.log(
                "WARN: Still not sure why mySwiper.destroy() is failing..."
              );
            }
          }

          mySwiper = $news.find(".swiper-container").swiper({
            mode: "horizontal",
            loop: true,
            slidesPerView: 3,
            resizeReInit: true,
            autoResize: true,
            //cssWidthAndHeight: true
          });
        },
        {
          name: "homeNewsSwiper",
          defer: false,
        }
      );

      // adaptive layout - destroy swiper on smaller screens.
      global.tl.adapt.respondTo(
        "any",
        function () {
          if (global.tl.screenUtils.isScreenSmallerThan("lg")) {
            if (
              typeof mySwiper === "object" &&
              typeof mySwiper.destroy === "function"
            ) {
              try {
                mySwiper.destroy(true);
              } catch (e) {
                console.log(
                  "WARN: Still not sure why mySwiper.destroy() is failing..."
                );
              }
            }

            mySwiper = $news.find(".swiper-container").swiper({
              mode: "vertical",
              loop: true,
              slidesPerView: 3,
              resizeReInit: true,
              autoResize: true,
              //cssWidthAndHeight: true
            });
            mySwiper.resizeFix();
            mySwiper.swipeTo(0);
          }
        },
        {
          name: "homeNewsSwiper",
          defer: false,
        }
      );

      // A bit convoluted...
      // 1. find any .news-modal modals.
      // 2. Copy them into the <body> (because the swiper carousel is overflow:hidden)
      // 3. generate custom route for modal using slugified news title (if exists)
      // 4. Create tl.modal
      // 5. Bind all <a>'s in news item to open custom modal.
      $news.find(".news-item").each(function () {
        var $this = $(this),
          titleText,
          modal,
          $modal,
          modalRoute;

        if ($this.find(".news-modal").length > 0) {
          $modal = $this.find(".news-modal").appendTo("body");
          titleText = $modal.find(".news-modal__title").text();
          modalRoute =
            "news/" +
            (titleText.length > 0
              ? global.tl.utils.slugify(titleText)
              : _.uniqueId());
          modal = new global.tl.Modal($modal, {
            route: modalRoute,
          });

          $this.find("a").on("click", function (e) {
            e.preventDefault();
            window.location.hash = "#modal/" + modalRoute;
          });
        }
      });
    }

    // only run when DOM is ready.
    $(document).ready(function () {
      if ($news.length > 0 || $marquee.length > 0) {
        getNewsContent();
      }
    });

    /**
     * When the pane has animated in, begin the home page animations.
     * @return {undefined}
     */
    $(window).on("animateInComplete.pane", function () {
      introAnimation();
    });
  })(this);
  (function (global) {
    "use strict";

    //----------------------------------------------------------------------------
    // Clouds
    //----------------------------------------------------------------------------
    if ($(".cloud--left").length > 0) {
      new global.tl.MiiCycle($(".cloud--left .mii"));
    }

    if ($(".cloud--right").length > 0) {
      // delay right cloud by 1 second so both clouds aren't in sync.
      _.delay(function () {
        new global.tl.MiiCycle($(".cloud--right .mii"));
      }, 1000);
    }

    //----------------------------------------------------------------------------
    // New Item
    //----------------------------------------------------------------------------

    (function newItem() {
      var $newItem = $(".new-item"),
        $newItemModal = $newItem.find(".new-item-modal").appendTo("body"), // move modal to body
        newItemModal = new global.tl.Modal($newItemModal, {
          route: "new-item",
        });

      $newItem.find(".image, .btn").on("click", function () {
        window.location.hash = "modal/new-item";
      });
    })();
  })(this);

  (function (global) {
    "use strict";

    var START_TIME = 3;
    var DIALOG = [
      {
        text: "Welcome to Tomodachi Life! Explore the island by clicking each location.",
        target: ".intro-mii--right",
        timeline: START_TIME,
      },
      {
        text: "And don’t forget to check out the special celebrity Miis you can import into your island. They got some pretty big stars…like me.",
        target: ".intro-mii--right",
        timeline: (START_TIME += 6),
      },
      {
        text: "Ahem.",
        target: ".intro-mii--left",
        timeline: (START_TIME += 8),
      },
      {
        text: "Oh hey, Christina Aguilera! Didn't see you there. Nice hat.",
        target: ".intro-mii--right",
        timeline: (START_TIME += 3),
      },
      {
        text: "…",
        target: ".intro-mii--left",
        timeline: (START_TIME += 6),
      },
      {
        text: "Think I could pull off a hat like that?",
        target: ".intro-mii--right",
        timeline: (START_TIME += 3),
      },
      {
        fin: true,
        timeline: (START_TIME += 6),
      },
    ];

    function displayDialog(index) {
      if (index > -1 && index < DIALOG.length) {
        if (!DIALOG[index].fin) {
          var $target = $(DIALOG[index].target);
          var $bubble = $target.find(".speech-bubble");

          if (!$bubble.hasClass("active")) {
            // if this isn't the active bubble, fade out the other bubble
            $("#introAnimation")
              .find(".speech-bubble.active")
              .removeClass("active")
              .fadeOut(300);
          }

          $bubble.addClass("active").text(DIALOG[index].text);

          if ($bubble.css("display") === "none") {
            $bubble.fadeIn(300);
          }
        } else {
          window.sessionStorage.setItem("introShown", true);
          $("#introAnimation")
            .find(".speech-bubble")
            .fadeOut(300, function () {
              $("#introAnimation").fadeOut(1000);
              $(".cloud--left .speech-bubble").show();
            });
        }
      }
    }

    function queueDialog() {
      for (var x = 0; x < DIALOG.length; x++) {
        _.delay(displayDialog, DIALOG[x].timeline * 1000, x);
      }
    }

    if (
      global.tl.isDebugging ||
      (window.sessionStorage && !window.sessionStorage.getItem("introShown"))
    ) {
      $(window).on("imagesLoaded", function () {
        var intro = $("#introAnimation");
        if (intro.length > 0) {
          if (global.tl.screenUtils.isScreenLargerThan("md")) {
            $(".cloud--left .speech-bubble").hide();
            $("#introAnimation").fadeIn(1500);
            queueDialog();
          }

          global.tl.adapt.respondTo(
            "any",
            function () {
              if (global.tl.screenUtils.isScreenSmallerThan("mdlg")) {
                $("#introAnimation").hide();
              }
            },
            {
              name: "introAnimation",
            }
          );

          $("#intro-close").on("click", function () {
            $("#introAnimation").fadeOut(500);
            $(".cloud--left .speech-bubble").show();
            window.sessionStorage.setItem("introShown", true);
          });
        }
      });
    }
  })(this);
}
/*
     FILE ARCHIVED ON 19:30:15 Jun 11, 2014 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:09:16 Mar 30, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.509
  exclusion.robots: 0.021
  exclusion.robots.policy: 0.01
  esindex: 0.012
  cdx.remote: 36.228
  LoadShardBlock: 2515.999 (3)
  PetaboxLoader3.datanode: 115.392 (4)
  PetaboxLoader3.resolve: 2502.359 (2)
  load_resource: 118.283
*/
