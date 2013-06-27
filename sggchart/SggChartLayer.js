dojo.provide("sggchart.SggChartLayer");
dojo.require("dojox.gfx");
dojo.require("esri.geometry");

dojo.declare("sggchart.SggChartLayer", esri.layers.GraphicsLayer, {
    _draw: function(graphic, redraw) {
        if (!this._map) {
            return;
        }
        if (graphic instanceof sggchart.SggPieChart) {
            this._drawChart(graphic);
        }
    },
    hide:function(){
        var length=this.graphics.length;
        var thisgraphics=this.graphics;
        for(var i=0;i<length;i++){
            if(thisgraphics[i].parentDiv){
                dojo.style(thisgraphics[i].parentDiv,{"display":"none"});
            }
        }
    },
    show:function(){
        var length=this.graphics.length;
        var thisgraphics=this.graphics;
        for(var i=0;i<length;i++){
            if(thisgraphics[i].parentDiv){
                dojo.style(thisgraphics[i].parentDiv,{"display":""});
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
    _refresh: function(redraw) {
        var gs = this.graphics,
            il = gs.length,i,
            _draw = this._draw;
        if (!redraw) {
            for (i = 0; i < gs.length; i++) {
                _draw(gs[i], redraw);
                //this.remove(gs[i]);
            }
        } else {
            for (i = 0; i < gs.length;) {
                _draw(gs[i], redraw);
            }
        }
        this.show();
    },
        _drawChart: function(piegraphic) {
            var mapDivContainer = dojo.byId(this._map.id);
            if (!piegraphic.bindGraphic) {
                return;
            }
            //理论上需要利用多边形的重心的
            if (piegraphic.bindGraphic._shape) {
                var svgDojoShape = piegraphic.bindGraphic.getDojoShape();
                var svgx = svgDojoShape.bbox.l;
                var svgy = svgDojoShape.bbox.t;
                piegraphic.divWidth = svgDojoShape.bbox.r - svgx;
                piegraphic.divHeight = svgDojoShape.bbox.b - svgy;
                var svgtransform = svgDojoShape.parent.matrix;
                var piedivx = svgx + svgtransform.dx;
                var piedivy = svgy + svgtransform.dy;
                if (!piegraphic.parentDiv) {
                    var piediv = dojo.doc.createElement("div");
                    dojo.style(piediv, {
                        "left": piedivx + "px",
                        "top": piedivy + "px",
                        "position": "absolute",
                        "width": piegraphic.getDivWidth() + "px",
                        "height": piegraphic.getDivHeight() + "px",
                        "margin": "0px",
                        "padding": "0px",
                        "z-index": "10000"
                    });
                    debugger;
                    dojo.doc.body.appendChild(piediv);
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
                        "z-index": "10000"
                    });
                }


                //var mapGraphic= esri.geometry.toMapGeometry(this._map.extent,this._map.width,this._map.height,piegraphic.bindGraphic.geometry.getExtent);
            } else if (!piegraphic.bindGraphic._shape && piegraphic.parentDiv) {
                dojo.doc.body.removeChild(piegraphic.parentDiv);
                this.remove(piegraphic);
            }
        }
    });