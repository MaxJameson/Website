// calls a php script to fetch images from a database
async function getPoints() {

    

    // stores the name of the current page
    url = document.URL;
    file = url.substring(url.lastIndexOf('/')+1);

    // checks if the user is on their profile page
    if(file == "profile.html"){

        // fetches current profiles photos
        return photoFetch(sessionStorage.getItem("userID"));

    }
    else if(file == "profileViewer.html"){
            // fetches current profiles photos
            return photoFetch(sessionStorage.getItem("viewUserID"));
    }

    return photoFetch(" ");
}

// submits a fetch request for photos from the database
async function photoFetch(id){

    // create a form to store user ID
    const photoForm = new FormData();

    // adds user ID to form
    photoForm.append('id',id)

    // fetches photos
    await fetch('getPhotos.php',{
        method: "post",
        body: photoForm
    }).then((res) => res.json())
    .then(response => {
        photos = response;
    }).catch(error => console.log(error))
        
    // returns an object containing records
    return photos; 
}