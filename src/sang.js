(function() {
'use strict';

var enterFunction = function(cssFactory) {
    return function(element, done) {
        var elm = $(element),
            css = cssFactory(element);
        elm.css(css.hidden);
        elm.animate(css.visible, done);
    };
};
var leaveFunction = function(cssFactory) {
    return function(element, done) {
        var elm = $(element),
            css = cssFactory(element);
        elm.css(css.visible);
        elm.animate(css.hidden, done);
    };
};

var addClassFunction = function(cssFactory) {
    // When adding class use a wrapper to reset css
    // otherwise, some attributes can be lost when using
    // height for instance.
    var doneWrapper = function(done, elm, css) {
        return function() {
            elm.css(css.visible);
            done();
        };
    };
    return function(element, className, done) {
        if (className == 'ng-hide') {
            var elm = $(element),
                css = cssFactory(element);
            elm.css(css.visible);
            $(element).animate(css.hidden, doneWrapper(done, elm, css));
        } else {
            done();
        }
    };
};
var removeClassFunction = function(cssFactory) {
    return function(element, className, done) {
        if(className == 'ng-hide') {
            element.removeClass('ng-hide'); // Remove ng-hide ASAP
            var elm = $(element),
                css = cssFactory(element);
            elm.css(css.hidden);
            elm.animate(css.visible, done);
        } else {
            done();
        }
    };
};

var animationFunction = function(cssFactory) {
    return {
        enter: enterFunction(cssFactory),
        leave: leaveFunction(cssFactory),

        addClass: addClassFunction(cssFactory),
        removeClass: removeClassFunction(cssFactory)
    };
};

angular.module('sang', ['ngAnimate'])
.animation('.sg-fade', function() {
    return animationFunction(function(element) {
        return {
            hidden: {opacity: 0},
            visible: {opacity: 1}
        };
    });
})

.animation('.sg-slide-bottom', function() {
    return animationFunction(function(element) {
        var offset = window.innerHeight - element[0].offsetHeight + element[0].offsetTop;
        return {
            hidden: {position: 'relative', 'top': offset+'px'},
            visible: {position: 'relative', 'top': '0px'}
        };
    });
})

.animation('.sg-slide-top', function() {
    return animationFunction(function(element) {
        var offset = element[0].offsetHeight + element[0].offsetTop;
        return {
            hidden: {position: 'relative', 'top': '-'+offset+'px'},
            visible: {position: 'relative', 'top': '0px'}
        };
    });
})

.animation('.sg-slide-left', function() {
    return animationFunction(function(element) {
        var offset = element[0].offsetWidth + element[0].offsetLeft;
        return {
            hidden: {position: 'relative', 'left': '-'+offset+'px'},
            visible: {position: 'relative', 'left': '0px'}
        };
    });
})

.animation('.sg-slide-right', function() {
    return animationFunction(function(element) {
        var offset = window.innerWidth + element[0].offsetWidth - element[0].offsetLeft;
        return {
            hidden: {position: 'relative', 'left': offset+'px'},
            visible: {position: 'relative', 'left': '0px'}
        };
    });
})

.animation('.sg-uncover-horizontal', function() {
    return animationFunction(function(element) {
        var height = element.height();
        return {
            hidden: {overflow: 'hidden', width: '0%', 'max-height': height},
            visible: {overflow: 'hidden', width: '100%', 'max-height': height}
        };
    });
})

.animation('.sg-uncover-vertical', function() {
    return animationFunction(function(element) {
        var height = element.height();
        return {
            hidden: {overflow: 'hidden', 'max-height': 0},
            visible: {overflow: 'hidden', 'max-height': height}
        };
    });
})
;
})();
