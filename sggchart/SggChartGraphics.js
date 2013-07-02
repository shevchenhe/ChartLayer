dojo.provide("sggchart.SggChartGraphics");
dojo.require("dojox.charting.Chart");
dojo.require("dojox.charting.plot2d.Pie");
dojo.require("dojox.charting.themes.Claro");
dojo.require("dojox.charting.themes.PlotKit.green");
dojo.require("dojox.charting.themes.Tufte");
dojo.require("dojox.charting.themes.CubanShirts");
dojo.require("dojox.charting.action2d.MoveSlice");
dojo.require("dojox.charting.action2d.Tooltip");
dojo.require("dojox.charting.widget.Legend");
//dojo.require("dojo.Stateful");


dojo.declare("sggchart.SggChartGraphics", esri.Graphic, {
	bindGraphic: null,
	parentDiv: null,
	series: null,
	id: null,
	divHeight: null,
	divWidth: null,
	map: null,
	setId: function(id) {
		this.id = id;
	},
	setSeries: function(series) {
		this.series = series;
	},
	setDivHeight: function(height) {
		this.divHeight = height;
	},
	setDivWidth: function(width) {
		this.divWidth = width;
	},
	getDivHeight: function() {
		return this.divHeight;
	},
	getDivWidth: function() {
		return this.divWidth;
	},
	getSeries: function() {
		return this.series;
	},
	getId: function() {
		return this.id;
	},
	hide: function() {
		if (this.parentDiv) {
			dojo.style(this.parentDiv, "display", "none");
		}
	},
	show: function() {
		if (this.parentDiv) {
			dojo.style(this.parentDiv, "display", "");
		}
	},
	_getMap: function() {
		var gl = this._graphicsLayer;
		return gl._map;
	}
});

dojo.declare("sggchart.SggPieChart", sggchart.SggChartGraphics, {
	watchobject:null,
	constructor: function(graphic) {
		dojo.mixin(this, {
			bindGraphic: graphic
		});
		//var tempwatch=new dojo.Stateful();
		//this.watchobject=tempwatch;
	},

	_draw: function(divContainer) {
		var _chart = new dojox.charting.Chart(divContainer);
		//var r = this.divWidth / 2;
		var r=50;
		var thetheme1=dojox.charting.themes.PlotKit.green;
		thetheme1.chart.fill = "transparent";
		thetheme1.chart.stroke = "transparent";
		thetheme1.plotarea.fill = "transparent";
		
		_chart.setTheme(thetheme1).
		addPlot("default", {
			type: dojox.charting.plot2d.Pie,
			radius: r
		}).
		addSeries(this.getId(), this.getSeries());
		new dojox.charting.action2d.Tooltip(_chart, "default");
		new dojox.charting.action2d.MoveSlice(_chart, "default");
		_chart.render();
		this.chart = _chart;
	}
});

/*dojo.declare("SggBarChart",SggChartGraphics,{
    _draw:function(divContainer){
        var _chart=new dojox.charting.Chart(divContainer);

    }
})*/