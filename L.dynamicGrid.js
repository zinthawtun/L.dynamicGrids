/*This is the js class extended form leaflet FeatureGroup class
* This supports to produce dynamic grid with custom glyphs
* This idea came from my MSc Software Engineering project's supervisor Dr Aidan Slingsby at City University London
* I would like to thanks leaflet its extended plugins*/


DynamicGrid = L.DynamicGrid = L.FeatureGroup.extend({

    options: {
        gridSize: 80,         //This is the default grid size
        delayRate: 0,         //This can make delay the grid producing rate
        M_data: null,         //Income data
        customIconFun: null,  //Function for custom icon creation
        style: {              //This is the default css style options
            color: '#000',
            fillColor: "#fff",
            weight: 1,
            fillOpacity: 0.1,
        }
    },
    //initialize the class
    initialize: function(options){
        L.Util.setOptions(this, options);
        L.FeatureGroup.prototype.initialize.call(this, [], options);

    },
    //This function produce the first grid cells on the map
    addGrid: function(){
        this._drawGrids(map.getBounds(),this.options.M_data);
    },

    //events for zoom and pan
    onAdd: function(map){
        L.FeatureGroup.prototype.onAdd.call(this, map);
        this._map = map;


        map.on("moveend", this._moveEvent, this);
        map.on("zoomend", this._zoomEvent, this);


    },
    onRemove: function(map){
        L.FeatureGroup.prototype.onRemove.call(this, map);

        map.off("movend", this._moveEvent, this);
        map.off("zoomend", this._zoomEvent, this);


    },
    //every time you move, you have to recreate the grid and glyphs to fit with the map
    _moveEvent: function(e){
        this.clearLayers();
        this._drawGrids(e.target.getBounds()); //to get target boundary

    },
    _zoomEvent: function(e){
        this.clearLayers();
        this._drawGrids(e.target.getBounds()); //to get target boundary

    },

    //draw the grid and produce the glyphs

    _drawGrids: function(bounds, markers){
        this._originalB = this._map.project(bounds.getNorthWest()); //to start from left corner
        this._gridSize = this.options.gridSize;
        this._setRow_Column();
        this._loadedCells = [];
        this.clearLayers();
        this._produceGridCells(bounds);
        this._produceGlyphs(bounds, markers);
    },

    //this function produce grid cells
    _produceGridCells: function(bounds) {
        let cells = this._cellBoundary(bounds);
        this.fire("newGridCells", cells);
        for (let i = cells.length - 1; i >= 0; i--) {
            let cell = cells[i];
            if(this._loadedCells.indexOf(cell.id) === -1){
                (function(cell, i){                             //produce the rectangle grids
                    setTimeout(this.addLayer.bind(this, L.rectangle(cell.bounds, this.options.style)), this.options.delayRate*i);
                }.bind(this))(cell, i);
                this._loadedCells.push(cell.id);
            }
        };

    },

    //this function produce icons
    _produceGlyphs: function(bounds) {
        let cells = this._cellBoundary(bounds);
        let mBPoints = this._matchBoundPoints(this.options.M_data);
        let cBPoints = this._matchInCellsPoints(cells, mBPoints);
        let cMapReduce = this._mapreduceMarkers(cBPoints);
        for (let i = cMapReduce.length - 1; i >= 0; i--) {
            let c_Markers = cMapReduce[i];
            let MarkerInfo = [];
                (function(c_Markers, i){
                    cBPoints.forEach(function (d) {
                        if(c_Markers.id === d.cellID){
                            MarkerInfo.push(d);
                        }
                    });
                    setTimeout(this.addLayer.bind(this, L.marker(c_Markers.position, {icon: this.createIcon(MarkerInfo)})), this.options.delayRate*i);
                }.bind(this))(c_Markers, i);
            }


    },

    //set the rows and colum by grid size

    _setRow_Column: function(){

        this._rows = Math.ceil(this._map.getSize().x / this._gridSize);
        this._cols = Math.ceil(this._map.getSize().y / this._gridSize);

    },

    //grid cells data

    _cellBoundary: function(bounds){
        let boundSet = this._map.project(bounds.getNorthWest()); //from left corner
        let setX = this._originalB.x - boundSet.x;
        let setY = this._originalB.y - boundSet.y;
        let RowSet = Math.round(setX / this._gridSize);
        let ColSet = Math.round(setY / this._gridSize);
        let cells = [];
        for (let i = 0; i <= this._rows; ++i) {             //calculate row id and col id
            for (let j = 0; j <= this._cols; ++j) {
                let row = i-RowSet;
                let col = j-ColSet;
                let cellBounds = this._gridCellArea(row, col);
                let cellId = row+":"+col;
                let Centroid = cellBounds.getCenter();


                cells.push({
                    id: cellId,
                    bounds: cellBounds,
                    centroid: Centroid
                });

                console.log(cellId);

            }

        }
        return cells;
    },

    //to add the grid cells of rows and column by adding coordinate points from the left corner

    _setPoints:function(row, col){
        let x = this._originalB.x + (row*this._gridSize);
        let y = this._originalB.y + (col*this._gridSize);
        return new L.Point(x, y);
    },

    //this function is to get boundary data of each single grid by edges south west and north east points

    _gridCellArea: function(row, col){
        let south_westPoint = this._setPoints(row, col);
        let north_eastPoint = this._setPoints(row-1, col-1);
        let s_w = this._map.unproject(south_westPoint); //convert coordinates to lat and lon
        let n_e = this._map.unproject(north_eastPoint);
        return new L.LatLngBounds(n_e, s_w); //this leaflet function make the points to boundary set
    },

    //find the points that include in current map boundary

    _matchBoundPoints: function(markers){

        let matchPoints = [];

        markers.forEach(function (d) {
            if(map.getBounds().contains(d._latlng)){
                matchPoints.push([d.options.id, d._latlng]);
            }
        });

        return matchPoints;

    },

    //find the points which are in each grid cells

    _matchInCellsPoints: function(cell, mbPoints){
        let matchPoints = [];
        mbPoints.forEach(function (d) {
            let  matched = cell.find(function(element) {
                return (element.bounds.contains(d[1]));
            });
            matchPoints.push({id: d[0], cellID: matched.id, centroid: matched.centroid});
        });

        return matchPoints;


    },

    //by using MapReduce method, the points in each cell can be counted

    _mapreduceMarkers: function(cBpoints) {

        let mapReduceArr = [];

        let output = cBpoints.reduce( (item, o) => (item[o.cellID] = (item[o.cellID] || 0)+1, item), {} );

        let obj_array = Object.keys(output).map(function(key) {
            return [key, output[key]];
        });


        obj_array.forEach(function (d) {
            let  matched = cBpoints.find(function(element) {
                return (element.cellID === d[0]);
            });
            mapReduceArr.push({id: d[0], count:d[1], position:matched.centroid})
        })

        return mapReduceArr;

    }



});


//include Icon create Function
DynamicGrid.include({


    createIcon: function(markerInfo){

        let Icon;

        //if there is not custom icon create function, the default pin svg image will show

     if (!this.options.customIconFun){
          Icon = L.icon({
             iconUrl: 'pin.svg', // beautiful icon is from Smashicon https://www.flaticon.com/authors/smashicons
             iconSize: [40, 40], // size of the icon
         });
     }else{
         Icon = this.options.customIconFun({

             getMarkerInfo: function () {  //object function to return the points in each grid cell
                 return markerInfo;
             },

         });
     }

     return Icon;
    },

});


//factory pattern for the API call
L.dynamicGrid = function (e) {
    return new L.DynamicGrid(e);
};
