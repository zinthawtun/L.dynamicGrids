//producing leaflet map
const myMap = (function () {

    // variable object style
    const varMap = {
        attribute_id: this.attribute_id,
        lat: this.lat, lon: this.lon,
        zoom: this.zoom
    }

    function Produce(varMap) {
        return new L.Map(varMap.attribute_id, {center: [varMap.lat, varMap.lon], zoom: varMap.zoom});
    }

    // Exposed public
    return {
        produce: Produce,
    }
})();

//adding leaflet original grid
LeafletGrid = L.GridLayer.extend({
    createTile: function (coords) {
        let tile = document.createElement('grid_tile');
        tile.innerHTML = ["x" + coords.x, "y" + coords.y, coords.z].join(', ');
        tile.style.outline = '1px solid navy';
        var size = this.getTileSize();
        console.log(coords.x);
        return tile;
    }
});

OriginalGrid = function (opts) {
    return new LeafletGrid(opts);
};

//adding tile layer
const myTile = (function () {

    //variable object style
    // const varMapLink = {name: this.name, link: this.link, server_url: this.server_url, maxZoom: this.maxZoom};

    function add_Layer(varMapLink) {

        mapLink = '<a href="' + varMapLink.link + '">' + varMapLink.name + '</a>';
        return L.tileLayer(
            varMapLink.server_url, {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: varMapLink.maxZoom,
            });
    }

    // Exposed public
    return {
        makeLayer: add_Layer
    }
})();

//adding SVG layer
const mySVG = (function () {

    const items = {attribute_id: this.attribute_id, layer: this.layer, new_attribute: this.new_attribute};

    function add_svg() {
        return L.svg();
    }

    function select_svg(items) {
        return d3.select(items.attribute_id).select(items.layer).append(items.new_attribute);
    }

    // Exposed public
    return {
        makeLayer: add_svg,
        selectLayer: select_svg
    }
})();


//adding glyphs
const myGlyphs = (function () {

    const Circles = (function () {

        function add(attr_name, data) {
            return d3.select(attr_name).selectAll('circles')
                .data(data)
                .enter().append("circle")
                .style("fill", "orange")
                .style("fill-opacity", 0.7)
                .attr("r", 5);
        }

        function update(attr_name) {

            return attr_name.attr("transform",
                function (d) {

                    return "translate(" +
                        map.latLngToLayerPoint(d.LatLng).x + "," +
                        map.latLngToLayerPoint(d.LatLng).y + ")";

                }
            )

        }

        // Exposed public
        return {
            add: add,
            update: update
        }
    })();

    const simpleClusterMarkers = (function () {

        let item = {latlon: this.latlon, title:this.titele};

        function add(item) {
            return L.marker(item.latlon, {title: item.title});
        }


        // Exposed public
        return {
            add: add
        }
    })();

    const Chloropleth = (function () {



        function add(item) {
            return ;
        }


        // Exposed public
        return {
            add: add
        }
    })();

// Exposed public
    return {
        addCircles: Circles.add,
        updateCircles: Circles.update,
        addClusterMarkers: simpleClusterMarkers.add
    }
})();

function createPie(e) {
    let dataCol = e.dataCol,
        strokeW = e.strokeW ? e.strokeW : 1,
        dataset = e.dataset,
        w = e.w ? e.w : 50,
        h = e.h ? e.h : 50,
        r = w / 2,
        pieClass = e.pieClass ? e.PieClass : 'clusterPie',
        position = (r + strokeW);


    let pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d;
        });

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(r);


    let svg = document.createElementNS(d3.namespaces, 'svg');


    var pre = d3.select(svg)
        .attr('class', pieClass)
        .attr('width', w)
        .attr('height', h);

    let points = pre.selectAll("g")
        .data(dataCol)
        .enter()
        .append("g")
        .attr("class", pieClass);

    let pies = points.selectAll(pieClass)
        .data(pie(dataset))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + position + ',' + position + ')');

    pies.append("path")
        .attr('d', arc)
        .attr("fill", function (d, i) {
            return color[i + 1];
        });

    return serializeXmlNode(svg);

}

/*Helper function*/
function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer !== "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml !== "undefined") {
        return xmlNode.xml;
    }
    return "";
}


// import dynamicgrid from './dynamicGrid';
//
// let L.dynamicgrid() = dynamicgrid;
