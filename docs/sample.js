/*global screen, Raphael, moment, jQuery, window */

(function () {
    var gc;
    var panel = null;
    var brw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var brh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


    function getQueryVariable(variable) {
        var query = window.location.search.substring(1),
            i,
            pair,
            vars = query.split("&");
        for (i = 0; i < vars.length; i = i + 1) {
            pair = vars[i].split("=");
            if (pair[0] === variable) {
                return pair[1];
            }
        }
        return "";
    }

    (function ($) {
        $.QueryString = (function (a) {
            if (a === "") {
                return {};
            }
            var b = {}, i, p;
            for (i = 0; i < a.length; ++i) {
                p = a[i].split('=');
                if (p.length !== 2) {
                    continue;
                }
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            return b;
        }(window.location.search.substr(1).split('&')));
    }(jQuery));



    function redraw() {
        var i;
        try {
            for (i = 0; i < gc.lines.length; i = i + 1) {
                gc.lines[i].getBuses();
            }
        } catch (ignore) {}
        gc.timer = setTimeout(redraw, 30000);
    }


    $(window).on('resize', function () {
        gc.remove();
        brw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        brh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        gc.lines = [];

        var toRemove = gc.paper.set();
        gc.paper.forEach(function (el) {
            toRemove.push(el);
        });
        toRemove.remove();

        gc = new GraphContainer('192.168.1.42', $.QueryString.filter);
        gc.bkgmode = "white"; //"black" 
        $('body').css('background', gc.bkgmode);

        gc.LoadLines();
        //this.timer = setTimeout(redraw, 30000);

    });

    $(function () {
        gc = new GraphContainer('192.168.1.42', $.QueryString.filter);
        gc.bkgmode = "white"; //"black" 
        $('body').css('background', gc.bkgmode);

        gc.LoadLines();
        this.timer = setTimeout(redraw, 30000);
    });
}());