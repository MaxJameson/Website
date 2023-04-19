// stores array of markers
let mappedMarkers = [];

// stores array of locations
let markerLocations = [];

// stores location of all photos
let allLocations = [];

// stores the name of the current page
url = document.URL;
file = url.substring(url.lastIndexOf('/')+1);

// stores clusterer
var Clusterer;

// creates markers
function makeMarker(lat, lng, photo, photoName, userName, Date){

  if(photoName == "");
  // converts file to an image source
  var image = new Image();
  image.src = photo;

  lat = lat.toFixed(6);
  lat = Number(lat);
  
  lng = lng.toFixed(6);
  lng = Number(lng);

  // store the current location for the image as a google position object
  current = new google.maps.LatLng(lat,lng);

  // loops through all markers

  for (i in mappedMarkers){

    // checks if the current marker is in the same position of another marker
    if (mappedMarkers[i].getPosition().equals(current)){

      // moves markers location by a small random amount
      lat += Math.random() * (0.002 - -0.002) + -0.002;
      lng += Math.random() * (0.002 - -0.002) + -0.002;
    }
  }

  // creates a marker using the google maps API
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng},
    map,
    animation: google.maps.Animation.DROP,
    title: photoName,
    visible: false,
  });

  // adds an event listener to detect if the marker is clicked
  marker.addListener("click", () => {
    
    // opens an info window attatched to the marker
    infowindow.open(map,marker);

    // makes the marker bounce if selected
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } 
    else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
   });

  // capitalises the name of the photo
  photoName = photoName.charAt(0).toUpperCase() + photoName.slice(1);

  // calculates the aspect ratio of the image
  newWidth = aspectRatio(image);

  // creates an info window for the marker along with a button to access to posting users profile
  const infowindow = new google.maps.InfoWindow({
    content: ('<button class="infowindow" value="'+userName+'" onclick="viewProfile(this.value)">'+ userName+'</button>' +
              '<h3><a class="infotext">'+ photoName +'</a></h3>' +
              '<h3 class="infotext">Posted: '+ Date +'</h3>' + 
              '<a href="'+photo+'" rel="lightbox"><img class="infoPic" src="'+photo+'" width="'+newWidth*4+'" height="'+45*4+'"></a>'),
  });

  // stops the marker bouncing when deselected
  infowindow.addListener("closeclick", () =>{
    marker.setAnimation(null);
  })
   

  
  // loads the imahe as a marker
  image.onload = function(){
    // calculates the scaled width of the photo
    newWidth = aspectRatio(image);

    // sets marker image
    marker.setIcon({url: photo, scaledSize: new google.maps.Size((newWidth),(45))});
    marker.setVisible(true);
    marker.setAnimation(google.maps.Animation.DROP);
   
  };

  // adds marker to array of markers
  mappedMarkers.push(marker);
};

// stores profile detaials to allow a user to view another users profile
async function viewProfile(name){
  sessionStorage.setItem("viewName", name);

  // creates form for post
  const profileForm = new FormData();
  profileForm.append('userName',name);

  await fetch('SQLfetchProfile.php',{
    method: "post",
    body: profileForm
  }).then((res) => res.json())
  .then(response => {
    details = response;
  }).catch(error => console.log(error))

  sessionStorage.setItem("viewUserID", details[0]["UserID"]);
  sessionStorage.setItem("viewProfilePic", details[0]["ProfilePicture"]);
  sessionStorage.setItem("viewBio", details[0]["Bio"]);
  window.location.replace("profileViewer.html");
}

// centers the map on a specific location
function centerMap(lat, long, uploaded){

  // sets location of the map to the first marker from the array of markers
  coords = new google.maps.LatLng(lat,long);
  map.panTo(coords);
  console.log(uploaded);
  // allows the map to zoom in on a specific point on profile pages
  if((file != "index.html" && file != "")){
    map.setZoom(15);
  }

  if(uploaded == true){
    map.setZoom(15);
  }

}

// creates the map
async function initMap() {
	
  // calls library used to generate heatmaps
  heatMapper = await google.maps.importLibrary("visualization");


  // usues the google maps API to create a map
  map = new google.maps.Map(document.getElementById("map"), {
    mapId: "2f686051150cc298",
    center: { lat: 48.85, lng: 2.35 },
    zoom: 6,
    optimized: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });

  // fetches an object of images heatMapper
  points = await getPoints();


  // checks if the user has uploaded any photos
  if(points.length == 0){
    
    document.getElementById("welcomeText").innerHTML = "You're map has no photos, go down below to upload some!";
  }
  else{

    // runs functions to create a group of markers
    markerManager();

  }

  // creates auto complete object to take input from location field
  autoComplete = new google.maps.places.Autocomplete(document.getElementById("location"),{fields: ['geometry','name']});

  var myoverlay = new google.maps.OverlayView();
  myoverlay.draw = function () {
      this.getPanes().markerLayer.id='markerLayer';
  };
  myoverlay.setMap(map);

};

// fetches markers and adds them to the map in clusters
function markerManager(){

  // clears any prestored markers
  mappedMarkers = [];
  markerLocations = [];
  allLocations = [];

  // store values used to determine the range of markers that will be generated
  NumMarkers = points.length;
  x = 0;
  const MaxMarkers = 20;

  // Checks how many picture rows have been pulled from the database
  if ((file == "index.html" || file == "") && points.length > MaxMarkers){

    // randomised the array
    points = points.sort((a, b) => 0.5 - Math.random());

    // sets number of markers to display
    NumMarkers = MaxMarkers;
  }
  else if(points.length > MaxMarkers){

    // wills show the 40 most recent posts on a profile
    x = points.length - MaxMarkers;
  }



  // creates a marker for each image object
 while (x < points.length){

  // converts the lat and long strings to floats
  lati = parseFloat(points[x]["Lat"]);
  longi = parseFloat(points[x]["Long"]);

  // only allows a maxium of 40 markers to be displayed at one time
  if (x < NumMarkers){


    // makes a marker for the current image
    makeMarker(lati,longi,points[x]["StoragePath"],points[x]["PhotoName"],points[x]["UserName"],points[x]["Date"]);

    // stores raw location of a marker
    markerLocations.push(new google.maps.LatLng(lati,longi));

  }
  // adds location of all photos in database to an array
  allLocations.push(new google.maps.LatLng(lati,longi));
  x++;

  } 
  // centers the map on a photo
  centerMap(mappedMarkers[mappedMarkers.length - 1].getPosition().lat(),mappedMarkers[mappedMarkers.length - 1].getPosition().lng(), false);


  // creates cluster manager to cluster marker
  Clusterer = new MarkerClusterer(map, mappedMarkers);

    // loads homepage specific heatmap
    if (file == "index.html" || file == ""){

      // sets filters to correct options
      refresh = document.getElementById("refresh");
      surprise = document.getElementById("suprise");
      markerToggle = document.getElementById("markerToggle");
      heatColour = document.getElementById("heatColour");
      markerToggle.addEventListener("click", toggleMarker);
      surprise.addEventListener("click", randomPic);
      refresh.addEventListener("click", refreshMarkers);
      document.getElementById("heatColour").style.backgroundColor= '#808080';      

      // creats heatmap of points
      heatmap = new heatMapper.HeatmapLayer({data: allLocations, map: map});
  
      // displays heatmap to prevent overlap with markers
      heatmap.setMap(null);

    }

}

// refreshes the markers on the page to show new images
function refreshMarkers(){
  location.reload();
}

// adds a new marker to the clusterer
function addToCluster(){
  // clears current clusterer
  for(i in mappedMarkers){
    Clusterer.removeMarker(mappedMarkers[i]);
  }

  // creates cluster manager to cluster marker
  Clusterer = new MarkerClusterer(map, mappedMarkers);
}

// moves map to a random marker
function randomPic(){

  // selects a random marker
  ranMarker = Math.floor(Math.random() * (mappedMarkers.length - 1));

  // gets position of random marker
  lt = mappedMarkers[ranMarker].getPosition().lat();
  lg = mappedMarkers[ranMarker].getPosition().lng();

  // store the current location for the marker as a google position object
  ranLocation = new google.maps.LatLng(lt,lg);
  
  // moves map to marker
  map.panTo(ranLocation);
  map.setZoom(15);
  
}

// switches between heatmap and markers
function toggleMarker(){
  // loops through markers
  for(i in mappedMarkers){

    // enables marker system
    if(mappedMarkers[i].getVisible() == false){
      mappedMarkers[i].setVisible(true);
      Clusterer.setMap(map);
      heatmap.setMap(null);

      // toggles heatmap features
      heatColour.style.backgroundColor= '#808080';
      heatColour.style.cursor= 'context-menu';
      heatColour.removeEventListener("click", changeGradient);
      markerToggle.innerText= 'Toggle Heatmap';

      // toggles map features
      surprise.addEventListener("click", randomPic);
      surprise.style.backgroundColor= '#303f9f';
      surprise.style.cursor= 'pointer';
      refresh.addEventListener("click", refreshMarkers);
      refresh.style.backgroundColor= '#303f9f';
      refresh.style.cursor= 'pointer';
    }

    // enables heatmap system
    else{
      mappedMarkers[i].setVisible(false);
      Clusterer.setMap(null);
      heatmap.setMap(map);

      // toggles heatmap features
      heatColour.style.backgroundColor= '#303f9f';
      heatColour.style.cursor= 'pointer';
      heatColour.addEventListener("click", changeGradient);
      markerToggle.innerText= 'Toggle Markers';

      // toggles map features
      surprise.removeEventListener("click", randomPic);
      surprise.style.backgroundColor= '#808080';
      surprise.style.cursor= 'context-menu';
      refresh.removeEventListener("click", refreshMarkers);
      refresh.style.backgroundColor= '#808080';
      refresh.style.cursor= 'context-menu';
      
    }
  }
};

// changes colour of heatmap
function changeGradient() {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)",
  ];

  // sets heatmap colours
  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
};


function getPlace(){
  // stores the current selected location as an object
  let place = autoComplete.getPlace();

  // checks if a place has been selected
  if (place == undefined){
    return[null, null];
  }
  // grabs the coordinates for the current place
  lat = place.geometry.location.lat();
  long = place.geometry.location.lng();
  return [lat, long, place.name];
}

// rescales the width of the photo
function aspectRatio(image){
  h = image.height;
  w = image.width;
  newWidth = (w / h) * 45;
  return newWidth;
}

// runs the function to create the map
window.initMap = initMap;