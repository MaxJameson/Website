

// checks if a user has signed in
if (sessionStorage.getItem("user") == null){

    // changes to the sign in page
    document.location.href = "signin.html";
}
else{
    
    console.log(sessionStorage.getItem("user"));
    // loads profile picture
    pictureBox = document.getElementById("profilePic");
    imagePath = sessionStorage.getItem("profilePic");
    
    var pic = new Image();
    pic.src = imagePath;

    pic.onload = function(){

        document.getElementById("profilePic").width = aspectRatio(pic,70)*5;

    }
    pictureBox.src = sessionStorage.getItem("profilePic");

    // inserts user info onto the page
    document.getElementById("profileName").innerHTML = sessionStorage.getItem("user");
    document.getElementById("bio").innerHTML = sessionStorage.getItem("bio");

}