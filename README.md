# L.dynamicGrids 
### version 0.1.0

This a plug-in support library extended from Leaflet (https://leafletjs.com) producing dynamic grids to display data with custom glyphs on a map.
This visualization idea is based on Dr. Aidan Slingsby's work, who is a researcher and lecturer in the giCentre at the City University of London.

##Get Started 

First, you must have leaflet installed and produced the map. Just go to leaflet documentation website and learn how to project a web map. 

Example of producing a map,
```
let map = L.Map(<attribute_id>, {center: [<latitude>, <longitude>], zoom: <zoomlevel>}); 
//learn more from leaflet documentation 
```

After that, you should have a layer of map tile server to display a map on the browser.

###Installation 

Firstly, you must [install Leaflet Library](https://leafletjs.com/download.html). 
After this, you must download L.dynamicGrids from my github repo. 

```
<script src="src/L.dynamicGrid.js"></script>
```

After you have linked with the JS file, you must go to the next step adding marker layer by using
L.marker from leaflet. It is important to put id:<your unique id of dataset> when you would like to create custom glyphs. 
```
let marker = L.marker(d.LatLng, {id: d.OA}); //OA is the unique id of my current dataset
            markerList.push(marker); // push those markers in array
```

You must push those marker layers into an array list.  Then, you can call the API as follow.

```
 //Call dynamic grid API
        let markers = L.dynamicGrid({
            gridSize: 80,
            M_data: markerList, //marker array list 
        }).addTo(map);
```
Next, you must have to call the first dynamic grid cell by first grid adding function.

```
 markers.addGrid();
```

##Options 

| Options | value | Definition |
| ------- | --- | --- |
| gridSize:  | int |You can change the grids size whatever you want when drawing on the map layer. |
| delayRate: | int |You can delay the time producing the grid and glyphs (icons).|
| M_data: | Marker Array list | Add the marker layer to form markers on the map according to position of markers.|
| customIconFun: | function(obj) | This is to create custom glyphs (icons) on the grids. It has object methods to return the markers information and |
| |obj.getMarkerInfo| This function can return cell-id, data-id and centroid of the marker point.|
|style | css-stlye | You can change the style of the grids background color and opacity etc.|

##SVG Icon 

The L.dynamicGrid include pin.svg file. Whenever you would like to change the icon of your marker, you must give that svg image name as pin.svg.
Currently, I am using a free beautiful icon is from [Smashicon](https://www.flaticon.com/authors/smashicons).

##Examples 

Here is the [link](http://www.student.city.ac.uk/~acvt664/L.dynamicGrids/examples/) that I have made examples for usage of my L.dynamicGrid, D3js and Leaflet marker-cluster library plugin.

##Reading the different types of files and Visualization 

You can use D3 to make different custom glyphs on the map. You can use proj4Leaflet for different coordinate reference systems. 

## Acknowledge

* [Dr Aidan Slingsby](https://www.city.ac.uk/people/academics/aidan-slingsby) - Lecturer in Visual and Analytic Computing at City University of London.
* [Leaflet](https://leafletjs.com) - Awesome Web Gis javascript library.
* [Marker-cluster](https://github.com/Leaflet/Leaflet.markercluster) [Virtual Grid](https://github.com/patrickarlt/leaflet-virtual-grid) [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet)
* [D3](https://d3js.org/) - Amazing JavaScript library for data visualisation. 
