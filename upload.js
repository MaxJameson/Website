// stores the relavent objects from the webpahe
const myForm = document.getElementById("myForm");
const images = document.getElementById("file");
const inputFields = document.querySelectorAll('input');

// checks if a user has signed in
if (sessionStorage.length != 0){

    // adds a listener to the submit button
    myForm.addEventListener("submit", e => {

    // prevents the button from carrying out it's usual function
    e.preventDefault();

    uploadFile();

    });
}


async function uploadFile(){
    // converts the file name to image name defined bu the user
    const photoName = document.getElementById("photoName").value;

    // stores current date
    date = new Date().toJSON().slice(0, 10);

    // gets the location data of the uploaded photo
    const [lat, long, autoName] = getPlace(); 

    // checks upload conditions and returns errors
    conditionsPromise = await errorCheck(images.value, photoName, lat, long, autoName);
    
    // checks if any errors were found
    if (conditionsPromise != "") {
        alert(conditionsPromise);
    }
    else
    {
        // converts the file name to image name defined bu the user
        split = images.files[0].name.split('.');
        exec = split.pop();
        newName = photoName + '.' + exec;
        const renamed = new File([images.files[0]], newName);

        // store php post method and creates form for the data
        const endpoint = "uploader.php";
        const formData = new FormData();

        // adds uploaded image to form
        formData.append("images", renamed);
        formData.append("path", "uploads/");
    
        // uses fetch api to submit a php post request
        fetch(endpoint, {
            method: "post",
            body: formData
        }).catch(console.error);

        // !! need to add user check when profiles are done
        // uploads image data to database
        sqlUpload(photoName,newName,lat, long,sessionStorage.getItem("userID"), date);
    
        // provides feedback for the user
        alert("Photo submitted!");

        // adds the photo to the map
        makeMarker(lat, long, ("uploads/" + newName), photoName, sessionStorage.getItem("user"), date);

        // centers the map on the new marker
        centerMap(lat,long);

        // clears input fields
        inputFields.forEach(input => input.value = '');

    }
}

// error checking function
async function errorCheck(photo, name, lat, long, nameCheck){
    // stores list of errors
    conditions = []

    // checks if the file is of the correct extenstion
    var re = /(\.jpg|\.jpeg|\.png|\.JPG|\.JPEG|\.PNG)$/i;
    if(photo == "")
    {
        conditions.push("Please add a photo.\n");
    }
    else if (!re.exec(photo)) {
        conditions.push("File extension not supported!\nsupported file formats are: JPG, JPEG, PNG.\n");
    }

    // checks if photo has a location
    if(lat == null || long == null || !document.getElementById("location").value.includes(nameCheck)){
        conditions.push("Please add a valid location to your photo.\n");
    }
    // checks if the photo has a name
    if(name == ""){
        conditions.push("Please add a name to your photo.\n");
    }
    else{

        // checks if the name used for the current photo has already been used
        nameExists = await getName(name, 1);
        if (nameExists > 0){
            conditions.push("Name Already Taken, Sorry.\n");
        }
    }
    if(sessionStorage.getItem("userID") == null){
        conditions.push("Please login to upload a photo");
    }

    // stores string of errors
    var conOutput = "";
        
    // loops through array of errors and adds them to a string
    for (i in conditions){
        conOutput = conOutput + conditions[i];
    }
    return conOutput;
}

// !! need to add user check when profiles are done
// uploads image data to the database
function sqlUpload(name,fileName, lat, long, ID, date){

    // stores php files name
    const endpoint = "SQLphoto.php";

    // formats storage path
    path = "uploads/" + fileName;
    
    // appends required data to a form
    const sqlForm = new FormData();
    sqlForm.append('userID',ID);
    sqlForm.append('name',name);
    sqlForm.append('storage',path);
    sqlForm.append('date',date);
    sqlForm.append('lat',lat);
    sqlForm.append('long',long);
    
    // uses fetch api to submit a php post request
    fetch(endpoint, {
        method: "post",
        body: sqlForm
    }).then(function(response){
        return response.text();
    }).then(function(text){
        console.log(text);
    }).catch(function(error){
        console.error(error);
    })

}
