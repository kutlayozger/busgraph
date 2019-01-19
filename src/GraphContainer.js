(function () {
    function GraphContainer(aServer, filter) {
        if (aServer !== undefined) { aServer = 'localhost'; }
        this.server = aServer;
        if (filter === undefined) { filter = ""; }
        this.filter = filter;
        this.bkgmode = "black";
        this.lastX = 25;
        this.lines = [];
        this.height = brh - 80;
    }

    GraphContainer.prototype.remove = function () {
        var i;
        for (i = this.lines.length - 1; i >= 0; i--) {
            this.lines[i].remove();
        }
        this.lines = [];
    };

    GraphContainer.prototype.inFilter = function (item) {
        if (this.filter === "") { return true; }
        if (("," + this.filter + ",").indexOf("," + item.GuzergahNo + ",") >= 0) {
            return true;
        }
        return false;
    };

    GraphContainer.prototype.Add = function (lineNo, stopCount, middleStop, lineName, duraklar) {
        if (!this.inFilter({ GuzergahNo: lineNo })) { return; }
        var line = new GraphLine(lineNo, stopCount, middleStop, lineName);
        line.Duraklar = duraklar;
        line.Container = this;
        line.x = this.lastX;
        line.paper = this.paper;
        line.height = this.height;
        this.lastX = this.lastX + 50;
        this.lines.push(line);
        line.draw();
        line.getBuses();
    };

    GraphContainer.prototype.LoadLines = function () {
        var that = this, cnt, i;
        $.get("dispatch.aspx?islem=dataSender&sid=" + getQueryVariable("sid") + "&tip=guzergahliste&data=",
             function (data) {
                if (data.list !== undefined) {
                    if (that.filter === "") {
                        cnt = data.list.length;
                    } else {
                        cnt = 0;
                        for (i = 0; i < data.list.length; ++i) {
                            if (that.inFilter(data.list[i])) {
                                cnt += 1;
                            }
                        }
                    }

                    that.paper = Raphael(0, 0, cnt * 50 + 80, brh - 80);
                    var item;
                    for (i = 0; i < data.list.length; i = i + 1) {
                        item = data.list[i];
                        if (that.inFilter(item)) {
                            that.Add(item.GuzergahNo, item.DurakSay, item.DurakOrta, item.GuzergahAdi, item.Duraklar);
                        }
                    }
                }
            });
    };

    GraphContainer.prototype.findLine = function (lineNo) {
        var i;
        for (i = 0; i < this.lines.length; i = i + 1) {
            if (this.lines[i].lineNo === lineNo) { return this.lines[i]; }
        }
        return null;
    };

    module.exports = GraphContainer;
}());