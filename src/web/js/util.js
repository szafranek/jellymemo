var Util;
(function() {
    "use strict";
    Util = {
        touchEvent: (window.ontouchstart === undefined) ? "mouseup" : "touchstart",
        touchEventEnd: (window.ontouchstart === undefined) ? "mousedown" : "touchend",
        addEventListener: function(collection, type, listener, useCapture) {
            for (var i = 0, length = collection.length; i < length; i++) {
                collection[i].addEventListener(type, listener, useCapture);
            }
        }
    };

}());
