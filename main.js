// Input Coordinates: from Henley in Arden
// St Nicholas Church, Prince Harry Car Park, Three Tuns Pub
const coordinates = [
  [52.292423759518,    -1.7771281740213771],
  [52.290405834703805, -1.7788362821085266],
  [52.29365946152288,  -1.7793097996454652]
];

// Style for our Feature Markers
let styleMarker = new ol.style.Style({
  image: new ol.style.Icon({
    scale: .7, anchor: [0.5, 1],
    src: 'marker.png'
  })
});

// Convert our input coordinates into Mercator Coordinates - required for OpenLayers
let mercatorCoordinates = [];
coordinates.forEach( coord => mercatorCoordinates.push( ol.proj.fromLonLat(coord.reverse()) ))

// Create our Feature Markers
let featureMarkers = [];
mercatorCoordinates.forEach( mercatorCoord => addMarker(mercatorCoord) );

// Create source of Features for the Vector Layer, add our Feature Markers
let sourceVector = new ol.source.Vector({
  features: featureMarkers
})

// Create Vector Layer
let vector = new ol.layer.Vector({
  source: sourceVector,
  style: [styleMarker]
});

// Create Map with our Vector Layer
const map = new ol.Map({
	target: 'map',
  layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), vector],
  view: new ol.View({ center: mercatorCoordinates[0], zoom: 16 })
});

// Add drag and drop translations for our Feature Markers
featureMarkers.forEach( fm => addDragAndDrop(fm) );

// Drag and drop function - to drag and drop a Feature Marker
map.on('pointermove', function(e) {
  if (e.dragging) return;
  const hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// Click function - to create a new Feature Marker at the cursor position
map.on('singleclick', function(e) {
  const featureMarker = addMarker(map.getCoordinateFromPixel(e.pixel));
  sourceVector.addFeature(featureMarker);
  addDragAndDrop(featureMarker);
});

// Function to add a Feature Marker
function addMarker(mercatorCoord) {
  const marker = new ol.Feature( new ol.geom.Point(mercatorCoord) )
  featureMarkers.push( marker )
  return marker;
}

// Function to add a drag and drop translation for a Feature Marker
function addDragAndDrop(featureMarker) {
  map.addInteraction( new ol.interaction.Translate({ features: new ol.Collection([featureMarker]) }) )
}