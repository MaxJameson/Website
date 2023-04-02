// stores array of markers
let mappedMarkers = [];

// stores array of locations
let markerLocations = [];

// stores the name of the current page
url = document.URL;
file = url.substring(url.lastIndexOf('/')+1);

var htmltest;

// creates markers
function makeMarker(lat, lng, photo, photoName, userName, Date){

  // converts file to an image source
  var image = new Image();
  image.src = photo;

  // store the current location for the image as a google position object
  current = new google.maps.LatLng(lat,lng)

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
    content: ('<h3>'+ photoName +'</h3>' +
              '<button class="infowindow" value="'+userName+'" onclick="viewProfile(this.value)">'+ userName+'</button>' +
              '<p>Posted: '+ Date +'</p>' + 
              '<img src="'+photo+'" width="'+newWidth*4+'" height="'+45*4+'">'),
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
function centerMap(lat, long){

  // sets location of the map to the first marker from the array of markers
  coords = new google.maps.LatLng(lat,long);
  map.panTo(coords);
  
  // allows the map to zoom in on a specific point on profile pages
  if(file != "index.html" && file != "" ){
    map.setZoom(13);
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
    fullscreenControl: false,
    mapTypeControl: false,
  });

  // fetches an object of images heatMapper
  points = await getPoints();

  // creates a marker for each image object
  for (i in points){
    
    // converts the lat and long strings to floats
    lati = parseFloat(points[i]["Lat"]);
    longi = parseFloat(points[i]["Long"]);

    // makes a marker for the current image
    makeMarker(lati,longi,points[i]["StoragePath"],points[i]["PhotoName"],points[i]["UserName"],points[i]["Date"]);

    // stores raw location of a marker
    markerLocations.push(new google.maps.LatLng(lati,longi));

  } 

  // creates cluster manager to cluster marker
  cluster = new MarkerClusterer(map, mappedMarkers);

  // creates auto complete object to take input from location field
  autoComplete = new google.maps.places.Autocomplete(document.getElementById("location"),{fields: ['geometry','name']});

  // loads homepage specific features
  if (file == "index.html" || file == ""){

    // creats heatmap of points
    heatmap = new heatMapper.HeatmapLayer({data: markerLocations, map: map});

    // displays heatmap to prevent overlap with markers
    heatmap.setMap(null);

    // sets filters to correct options
    markerToggle = document.getElementById("markerToggle");
    heatColour = document.getElementById("heatColour")
    markerToggle.addEventListener("click", toggleMarker);
    document.getElementById("heatColour").style.backgroundColor= '#808080';
  }

  // centers the map on first marker in array
  centerMap(parseFloat(points[0]["Lat"]),parseFloat(points[0]["Long"]));

};

// switches between heatmap and markers
function toggleMarker(){
  // loops through markers
  for(i in mappedMarkers){

    // enables marker system
    if(mappedMarkers[i].getVisible() == false){
      mappedMarkers[i].setVisible(true);
      cluster.setMap(map);
      heatmap.setMap(null);
      heatColour.style.backgroundColor= '#808080';
      heatColour.style.cursor= 'context-menu';
      heatColour.removeEventListener("click", changeGradient);
      markerToggle.innerText= 'Toggle Heatmap';
    }

    // enables heatmap system
    else{
      mappedMarkers[i].setVisible(false);
      cluster.setMap(null);
      heatmap.setMap(map);
      heatColour.style.backgroundColor= '#303f9f';
      heatColour.style.cursor= 'pointer';
      heatColour.addEventListener("click", changeGradient);
      markerToggle.innerText= 'Toggle Markers';
      
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