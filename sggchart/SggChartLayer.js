dojo.provide("sggchart.SggChartLayer");
dojo.require("dojox.gfx");
dojo.require("esri.geometry");
dojo.require("dojo.Stateful");

dojo.declare("sggchart.SggChartLayer", esri.layers.GraphicsLayer, {
    divid: null,
    bindGraphicLayer:null,
    constructor:function(params){
        dojo.mixin(this,params);
    },
    setDivId: function(id) {
        this.divid = id;
    },
    _draw: function(graphic, redraw, zoomFlag) {
        var that=this;
        if (!this._map) {
            return;
        }

        if (graphic instanceof sggchart.SggPieChart) {
            //if (!zoomFlag) {
                this._drawChart(graphic, zoomFlag);
           // } else {
            //    dojo.connect(that.bindGraphicLayer,"onUpdateEnd",dojo.hitch(that,that._drawChart,graphic, zoomFlag)
          //  }
        }
    },
    hide: function() {
        var length = this.graphics.length;
        var thisgraphics = this.graphics;
        for (var i = 0; i < length; i++) {
            if (thisgraphics[i].parentDiv) {
                dojo.style(thisgraphics[i].parentDiv, {
                    "display": "none"
                });
            }
        }
    },
    show: function() {
        var length = this.graphics.length;
        var thisgraphics = this.graphics;
        for (var i = 0; i < length; i++) {
            if (thisgraphics[i].parentDiv) {
                dojo.style(thisgraphics[i].parentDiv, {
                    "display": ""
                });
            }
        }
    },
    _onPanStartHandler: function() {
        this.hide();
    },
    _onPanEndHandler: function() {

        this._refresh(false);
        //this._visibilityChangeHandler(this.visible);

        // if (this.graphics.length) {
        //   this.onUpdate();
        // }
    },
    _refresh: function(redraw, zoomFlag) {
        var gs = this.graphics,
            il = gs.length,
            i,
            _draw = this._draw;
        if (!redraw) {
            for (i = 0; i < gs.length; i++) {
                _draw(gs[i], redraw, zoomFlag);
                //this.remove(gs[i]);
            }
        } else {
            for (i = 0; i < gs.length; i++) {
                _draw(gs[i], redraw, zoomFlag);
            }
        }
        this.show();
    },
    _onExtentChangeHandler: function(extent, delta, levelChange, lod) {
        if (levelChange) {
            //summary: Redraw graphics on extent change
            // var _mvr = this._map.__visibleRect,
            //     group = this._div;
            // this._init = true;

            this._refresh(true, levelChange);

            // group.setTransform(dojox.gfx.matrix.translate({
            //     x: _mvr.x,
            //     y: _mvr.y
            // }));

            // if (this._renderProto && group.surface.pendingRender) { // canvas
            //     this._dirty = true;
            // } else {
            //     if (this.visible) {
            //         esri.show(group.getEventSource());
            //     }
            // }
        }
    },
    _drawChart: function(piegraphic, zoomFlag) {
        //var bindGraphic = piegraphic.piegraphic.bindGraphic;
        if (!piegraphic.bindGraphic) {
            return;
        }
        if (zoomFlag) {
            dojo.byId(this.divid).removeChild(piegraphic.parentDiv);
            //dojo.connect()
            //this.remove(piegraphic);
        }
        //var graphicDojoShapeStateful=new dojo.Stateful();
        //graphicDojoShapeStateful.watch
        //理论上需要利用多边形的重心的
        if (piegraphic.bindGraphic.visible && piegraphic.bindGraphic._extent && (offsets = this._intersects(this._map, piegraphic.bindGraphic._extent, piegraphic.bindGraphic.geometry._originOnly))) {
            if (piegraphic.bindGraphic._shape) {
                var svgDojoShape = piegraphic.bindGraphic.getDojoShape();
                var svgx = svgDojoShape.bbox.l;
                var svgy = svgDojoShape.bbox.t;
                piegraphic.divWidth = svgDojoShape.bbox.r - svgx;
                piegraphic.divHeight = svgDojoShape.bbox.b - svgy;
                var svgtransform = svgDojoShape.parent.matrix;
                var piedivx = svgx + svgtransform.dx;
                var piedivy = svgy + svgtransform.dy;
                if (!piegraphic.parentDiv||zoomFlag) {
                    var piediv = dojo.doc.createElement("div");
                    dojo.style(piediv, {
                        "left": piedivx + "px",
                        "top": piedivy + "px",
                        "position": "absolute",
                        "width": piegraphic.getDivWidth() + "px",
                        "height": piegraphic.getDivHeight() + "px",
                        "margin": "0px",
                        "padding": "0px",
                        "z-index": "100"
                    });
                    debugger;
                    dojo.byId(this.divid).appendChild(piediv);
                    piegraphic._draw(piediv);
                    piegraphic.parentDiv = piediv;
                } else if (piegraphic.parentDiv) {
                    dojo.style(piegraphic.parentDiv, {
                        "left": piedivx + "px",
                        "top": piedivy + "px",
                        "position": "absolute",
                        "width": piegraphic.getDivWidth() + "px",
                        "height": piegraphic.getDivHeight() + "px",
                        "margin": "0px",
                        "padding": "0px",
                        "z-index": "100"
                    });
                }
            }


            //var mapGraphic= esri.geometry.toMapGeometry(this._map.extent,this._map.width,this._map.height,piegraphic.bindGraphic.geometry.getExtent);
            //} else if (!piegraphic.bindGraphic._shape && piegraphic.parentDiv) {
        } else {
            dojo.byId(this.divid).removeChild(piegraphic.parentDiv);
            piegraphic.parentDiv=null;
            //this.remove(piegraphic);
        }


    }
});