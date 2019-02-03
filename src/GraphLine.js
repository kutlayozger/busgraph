(function () {
    var config = require("./GraphConfig");
    function GraphLine(alineNo, astopCount, amiddleStop, alineName) {
        this.lineNo = alineNo;
        this.stopCount = astopCount;
        this.middleStop = amiddleStop;
        this.lineName = alineName;
        this.BaslangicY = config.lineStartY;
        this.x = 0;
        this.color = null;
        this.kalin = config.thickness;
        this.stopRadius = config.stopRadius; //3.5;
        this.baseLineColor = config.baseLineColor;
        this.stopColor = config.stopColor;
        this.hintBkgColor = config.hintBackgroundColor; // "#d0d671"; // '#0f0';
        this.busColor = config.busColor;
        this.busAlrmColor = config.busAlarmColor;
        this.buses = [];
        this.stops = [];
        this.durakCntGraph = [];
    }

    GraphLine.prototype.lineNameOnMouseOver = function () {
        var bbox = this.getBBox(), dy = 23, dx = 0;
        if (bbox.x < 50) { dx = 50; }
        this.yazi = this.line.paper.text(bbox.x + dx, bbox.y + dy, this.hint);
        var bb = this.yazi.getBBox();
        this.bordere = this.line.paper.rect(bb.x - 2, bb.y - 2, bb.width + 4, bb.height + 4, 3);
        this.bordere.attr("fill", this.line.hintBkgColor);
        this.yazi.toFront();
    };

    GraphLine.prototype.lineNameOnMouseClick = function () {
        var ln = this.textContent;
        window.open('logizle.aspx?sid=' + getQueryVariable("sid") + '&Guzergah=' + ln);
    };

    GraphLine.prototype.lineNameOnMouseOut = function () {
        this.yazi.remove();
        this.bordere.remove();
    };

    GraphLine.prototype.stopOnMouseOver = function () {
        var bbox = this.getBBox(), dy = -10;
        if (bbox.y < 20) { dy = 20; }
        this.stop.yazi = this.stop.paper.text(bbox.x + this.stop.yaziEklenti, bbox.y + dy, this.durakadi);

        var bb = this.stop.yazi.getBBox();
        this.stop.bordere = this.stop.paper.rect(bb.x - 2, bb.y - 2, bb.width + 4, bb.height + 4, 3);
        this.stop.bordere.attr("fill", this.stop.hintBkgColor);
        this.stop.yazi.toFront();
    };

    GraphLine.prototype.stopOnMouseOut = function () {
        this.stop.yazi.remove();
        this.stop.bordere.remove();
    };

    GraphLine.prototype.drawStop =  function (num, durakAdi) {
        var sol = this.x - 2, i = num - 1, yon = num <= this.middleStop, yzek = -5, ar = this.ara;
        var mx = this.middleStop;
        if ((this.stopCount - this.middleStop) > mx) { mx = this.stopCount - this.middleStop; }

        if (yon) {
            if (mx > this.middleStop) {
                ar = (mx * this.ara) / this.middleStop;
            }
        } else {
            sol = this.x + this.kalin + 2;
            i = this.stopCount - num;
            yzek = 14;
            if ((this.stopCount - mx) < this.middleStop - 1) {
                ar = this.middleStop * this.ara / (this.stopCount - mx);
            }
        }
        var circle = this.paper.circle(sol, this.BaslangicY + i * ar, this.stopRadius);
        circle.attr("fill", this.stopColor);
        circle.attr("stroke", this.baseLine);
        if (this.Container.bkgmode === "black") {
            circle.attr("stroke", "#fff");
        }
        circle.node.stop = this;
        this.yaziEklenti = yzek;
        if (num % 5 === 0) {
            var txt = this.paper.text(sol - this.stopRadius + yzek, this.BaslangicY + i * ar - this.stopRadius + 3, num);
            if (this.Container.bkgmode === "black") {
                txt.attr("stroke", "#fff");
            }
            this.durakCntGraph.push(txt);
        }
        circle.node.durakadi = durakAdi;
        circle.node.onmouseover = this.stopOnMouseOver;
        circle.node.onmouseout = this.stopOnMouseOut;
        this.stops.push(circle);
    };

    GraphLine.prototype.draw = function () {
        var bsl = this.BaslangicY;
        this.hatnyaz = this.paper.text(this.x, bsl - 40, this.lineNo);
        var bb = this.hatnyaz.getBBox();
        this.bordere = this.paper.rect(bb.x - 2, bb.y - 2, bb.width + 4, bb.height + 4, 3);
        this.bordere.attr("fill", this.color || "#aaa");

        this.sayyaz = this.paper.text(this.x, bsl - 20, '0');
        bb = this.sayyaz.getBBox();
        this.borderse = this.paper.rect(bb.x - 2, bb.y - 2, bb.width + 4, bb.height + 4, 3);
        this.borderse.attr("fill", this.color || "#eee");

        if (this.Container.bkgmode === "black") {
            this.bordere.attr("stroke", "#fff");
        }
        this.hatnyaz.toFront();
        // hatnyaz = paper.text(x, bsl - 10, hatno);

        this.hatnyaz.node.hint = this.lineName;
        this.hatnyaz.node.bsl = bsl;
        this.hatnyaz.node.line = this;
        this.hatnyaz.node.onmouseover = this.lineNameOnMouseOver;
        this.hatnyaz.node.onmouseout = this.lineNameOnMouseOut;
        this.hatnyaz.node.onclick = this.lineNameOnMouseClick;
        var mx = this.middleStop;
        if ((this.stopCount - this.middleStop) > mx) { mx = this.stopCount - this.middleStop; }
        this.ara = (this.height - this.BaslangicY) / mx;
        //var yazimtum = false; // ara >= 13;

        var c = this.paper.rect(this.x, this.BaslangicY, this.kalin, (mx - 1) * this.ara + this.stopRadius);
        c.attr("fill", this.baseLineColor);
        this.hatgraph = c;
        if (this.Container.bkgmode === "black") {
            c.attr("stroke", "#fff");
        }
        var i;
        for (i = 1; i <= this.stopCount; i++) {
            this.drawStop(i, this.Duraklar[i - 1]);
            /*$.get( "dispatch.aspx?islem=dataSender&sid=busobserver&tip=gpdurakadi&data="+this.lineNo+"|"+i,
            function(data) {
                if (data.DurakAdi!=undefined) {
                    that.drawStop(data.DurakSiraNo, data.DurakAdi);
                }
            });*/
        }
    };

    GraphLine.prototype.setBusCount = function (cnt) {
        this.sayyaz.remove();
        this.borderse.remove();
        this.sayyaz = this.paper.text(this.x, this.BaslangicY - 20, cnt);
        var bb = this.sayyaz.getBBox();
        this.borderse = this.paper.rect(bb.x - 2, bb.y - 2, bb.width + 4, bb.height + 4, 3);
        this.borderse.attr("fill", this.color || "#eee");
        this.sayyaz.toFront();
    };

    GraphLine.prototype.drawBus = function (plaka, surucu, duraksirano, zaman) {
        var mx = this.middleStop, i = duraksirano - 1, r = this.stopRadius, fcol = this.busColor;
        if (i < 0) { i = 0; }
        if ((this.stopCount - this.middleStop) > mx) { mx = this.stopCount - this.middleStop; }
        var ara = (this.height - this.BaslangicY) / mx, zmn = moment(zaman, 'DD.MM.YYYY HH:mm:ss');

        if (zmn.add(5, 'm').isBefore(moment())) {
            fcol = this.busAlrmColor;

        }

        var sol = this.x, yon = duraksirano <= this.middleStop, ar = ara, ken = -r * 4; //yzek = - 5,
        if (yon) {
            if (mx > this.middleStop) {
                ar = (mx * ara) / this.middleStop;
            }
        } else {
            sol = this.x + this.kalin;
            i = this.stopCount - duraksirano;
            //yzek = 12;
            ken = r * 2;
            if ((this.stopCount - mx) < this.middleStop - 1) {
                ar = this.middleStop * ara / (this.stopCount - mx);
            }
        }
        var obus = this.paper.rect(sol + ken, this.BaslangicY + i * ar - r, r * 2, r * 2);
        this.buses.push(obus);
        obus.attr("fill", fcol);
        if (this.Container.bkgmode === "black") {
            obus.attr("stroke", "#fff");
        }
        if (panel !== null) {
            panel.toFront();
        }
        obus.node.plk = plaka + "\n" + surucu;
        obus.node.plaka = plaka;
        obus.node.line = this;
        obus.node.onclick = function () {
			if (this.onclick) {
				this.onclick(self, obus);
			} else {
				if (this.onclicklink) {
					window.open(this.onclicklink + '?sid=' + getQueryVariable('sid') + '&plaka=' + this.plaka)
				}
			}
        };
        obus.node.onmouseover = function () {
            var bbox = this.getBBox(), dy = -30, dx = -2;
            if (bbox.y < 50) { dy = 50; }
            if (bbox.x < 50) { dx = dx + 30; }
            this.yazi = this.line.paper.text(bbox.x + dx, bbox.y + dy, this.plk);
            var bb = this.yazi.getBBox();
            this.bordere = this.line.paper.rect(bb.x - 2, bb.y - 5, bb.width + 4, bb.height + 8, 3);
            this.bordere.attr("fill", this.line.hintBkgColor);
            this.yazi.toFront();
        };
        obus.node.onmouseout = function () {
            this.yazi.remove();
            this.bordere.remove();
        };
    };

    GraphLine.prototype.clearBuses = function () {
        var i;
        for (i = 0; i < this.buses.length; i = i + 1) {
            this.buses[i].remove();
        }
        this.buses = [];
    };

    GraphLine.prototype.remove = function () {
        this.clearBuses();
        this.bordere.remove();
        this.borderse.remove();
        this.hatnyaz.remove();
        this.sayyaz.remove();
        this.hatgraph.remove();
        this.removeStops();
    };
    GraphLine.prototype.removeStops = function () {
        var i, l = this.stops.length - 1;
        for (i = l; i >= 0; --i) {
            this.stops[i].remove();
        }
        l = this.durakCntGraph.length - 1;
        for (i = l; i >= 0; --i) {
            this.durakCntGraph[i].remove();
        }
    };
    GraphLine.prototype.getBuses = function () {
        $.get("dispatch.aspx?islem=grafikAnlikBilgi&sid=" + getQueryVariable("sid") + "&zaman=&guzergah=" + this.lineNo, function (data) {
            if (data.liste !== undefined) {
                var line = gc.findLine(data.GuzergahNo);
                if (line !== null) {
                    try {
                        line.clearBuses();
                        var i, item;
                        line.setBusCount(data.liste.length);
                        for (i = 0; i < data.liste.length; i = i + 1) {
                        //otobusciz(115, 80, 30, 67, '306 ae 1358\nALI VELI');*/
                            item = data.liste[i];
                            line.drawBus(item[1], item[2] + '\n' + item[9] + '\n ', item[8], item[5]);
                        }
                    } catch (ignore) {}
                }
            }
        });
    };

    module.exports = GraphLine;
}());