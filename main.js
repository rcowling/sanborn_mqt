require([
"esri/Map",
"esri/views/MapView",
"esri/widgets/Home",
"esri/layers/TileLayer",
"esri/layers/FeatureLayer",
"esri/widgets/Swipe",
"esri/widgets/Expand",
"esri/widgets/Search",
"esri/widgets/BasemapGallery",
"esri/widgets/Locate"
], function(Map, MapView, Home, TileLayer, FeatureLayer, Swipe, Expand, Search, BasemapGallery, Locate) {
        $('#aboutModal').modal('show');
        var poiLayer = new FeatureLayer({
        // URL points to a cached tiled map service hosted on ArcGIS Server
        url: "https://services5.arcgis.com/b7cJ4YYc9GM63RSz/arcgis/rest/services/monuments_mqt_county/FeatureServer/0",      
        });
        var mqtLayer = new TileLayer({
        // URL points to a cached tiled map service hosted on ArcGIS Server
        url: "https://tiles.arcgis.com/tiles/b7cJ4YYc9GM63RSz/arcgis/rest/services/marquette1917/MapServer",      
        });

        var ishLayer = new TileLayer({
        // URL points to a cached tiled map service hosted on ArcGIS Server
        url: "https://tiles.arcgis.com/tiles/b7cJ4YYc9GM63RSz/arcgis/rest/services/ispheming1911/MapServer",      
        });

        var negLayer = new TileLayer({
        // URL points to a cached tiled map service hosted on ArcGIS Server
        url: "https://tiles.arcgis.com/tiles/b7cJ4YYc9GM63RSz/arcgis/rest/services/negaunee1911/MapServer",      
        });

        var repLayer = new TileLayer({
        // URL points to a cached tiled map service hosted on ArcGIS Server
        url: "https://tiles.arcgis.com/tiles/b7cJ4YYc9GM63RSz/arcgis/rest/services/republic1922/MapServer",      
        });

        var michLayer = new TileLayer({
        // URL points to a cached tiled map service hosted on ArcGIS Server
        url: "https://tiles.arcgis.com/tiles/b7cJ4YYc9GM63RSz/arcgis/rest/services/michigamme/MapServer",      
        });
        // Add layer to a new map
        var map = new Map({
          basemap: "satellite",
          layers: [ishLayer, mqtLayer, negLayer, repLayer, michLayer, poiLayer]
        });

        var view = new MapView({
          container: "viewDiv",
          map: map,
          center: [-87.3954, 46.5436],
          zoom: 16
        });  

        poiLayer.renderer = {
          type: "simple",  // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            size: 12,
            color: "#095339",
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 0.5,
              color: "white"
            }
          }
        };   

        // Set the outfields for the POI layer
        poiLayer.outFields = ['Name', 'image', 'Description', 'source'];
        view.on("click", function(event){
          view.hitTest(event, { include: poiLayer})
            .then(function(response){      
               // do something with the result graphic
               var graphic = response.results[0].graphic;
               console.log(graphic.attributes);
                $('#name').html(graphic.attributes.Name);
                $('#source').html("Source: " + graphic.attributes.source);
                $('#desc').html(graphic.attributes.Description);
                document.getElementById("modalimg").src="img/" + graphic.attributes.image; 
               $('#imageModal').modal('show');
            });
        });

      // set the default opacity of the sanborn layers
      ishLayer.opacity = 100;  
      mqtLayer.opacity = 100;
      negLayer.opacity = 100;
      repLayer.opacity = 100;
      michLayer.opacity = 100;

      // set up the opacity slider 
      var slider = document.getElementById("myRange");         

      // Update the current slider value (each time you drag the slider handle)
      slider.oninput = function() {
        // Change the opacity of the tile layer according to the sliders value
        ishLayer.opacity = this.value / 100;
        mqtLayer.opacity = this.value / 100; 
        negLayer.opacity = this.value / 100;      
        repLayer.opacity = this.value / 100;
        michLayer.opacity = this.value / 100;
      }

      var infoBtn = document.createElement('div');
      infoBtn.className = "esri-icon-description esri-widget--button esri-widget esri-interactive";
      infoBtn.title = "About this application";
      infoBtn.addEventListener('click', function(event){
        $('#aboutModal').modal('show');
      });

      // Add the button to the UI
      view.ui.add(infoBtn, "top-left");

      /*var homeBtn = new Home({
            view: view
        });
        view.ui.add(homeBtn, "top-left");*/

         // Create a BasemapGallery widget instance and set
      // its container to a div element
      var basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement("div")
      });

      // Create an Expand instance and set the content
      // property to the DOM node of the basemap gallery widget
      var bgExpand = new Expand({
        view: view,
        content: basemapGallery
      });

      // close the expand whenever a basemap is selected
      basemapGallery.watch("activeBasemap", function() {
        var mobileSize = view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall";

        if (mobileSize) {
          bgExpand.collapse();
        }
      });

      // Add the expand instance to the ui
      view.ui.add(bgExpand, "top-left");       

       // Add element for the 360 photo viewer button using Esri widgets
  var swipe;     
  var swipeBtn = document.createElement('div');
  swipeBtn.className = "esri-icon-dock-left esri-widget--button esri-widget esri-interactive";
  swipeBtn.title = "Compare maps";
  swipeBtn.addEventListener('click', function(event){
    // create a new Swipe widget
      swipe = new Swipe({
        leadingLayers: [ishLayer, mqtLayer, negLayer, repLayer, michLayer, poiLayer],
        type: "scope",
        //trailingLayers: [nearInfrared],
        position: 35, // set position of widget to 35%
        view: view
      });
    view.ui.add(swipe);
    $(".esri-icon-close").show(); 
    $(".esri-icon-dock-left").hide();
  });

  // Add the button to the UI
  view.ui.add(swipeBtn, "top-left");  

  var closeBtn = document.createElement('div');
  closeBtn.className = "esri-icon-close esri-widget--button esri-widget esri-interactive";
  closeBtn.title = "Exit swipe";
  closeBtn.addEventListener('click', function(event){
    swipe.destroy();
    $(".esri-icon-close").hide(); 
    $(".esri-icon-dock-left").show();
  });

  // Add the button to the UI
  view.ui.add(closeBtn, "top-left");  

  $(".esri-icon-close").hide();  

  var locateBtn = new Locate({
          view: view
        });

        // Add the locate widget to the top left corner of the view
        view.ui.add(locateBtn, {
          position: "top-left"
        });

  var searchWidget = new Search({
  view: view
});
// Adds the search widget below other elements in
// the top left corner of the view
view.ui.add(searchWidget, {
  position: "top-right",
  index: 2
});      

  // Code for the location dropdown menu
  $("#location").change(function () {
    // Get the value of the selected item
    var value = this.value;
    if (value == 'mqt') {
      view.goTo({
        center: [-87.3954, 46.5436],
        zoom: 16
      });
    } else if (value == 'ish') {
       view.goTo({
        center: [-87.6652670, 46.4925248],
        zoom: 16
      });            
    } else if (value == 'neg') {
      view.goTo({
        center: [-87.6100150, 46.5008506],
        zoom: 16
      });
    } else if (value == 'rep') {            
      view.goTo({
        center: [-87.9771783, 46.4065989],
        zoom: 17
      }); 
    } else if (value == 'mich') {            
      view.goTo({
        center: [-88.1093581, 46.5355518],
        zoom: 17
      });
    }
  });
});