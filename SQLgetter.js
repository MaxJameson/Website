// calls a php script to fetch images from a database
async function getPoints() {
    await fetch('getPhotos.php').then((res) => res.json())
    .then(response => {
        photos = response;
    }).catch(error => console.log(error)) 
    
    // returns an object containing records
    return photos;
}