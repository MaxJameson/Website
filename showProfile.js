    // loads profile picture
    pictureBox = document.getElementById("profilePic");
    imagePath = sessionStorage.getItem("viewProfilePic");
    
    var pic = new Image();
    pic.src = imagePath;

    pic.onload = function(){

        document.getElementById("profilePic").width = aspectRatio(pic,70)*5;

    }
    pictureBox.src = sessionStorage.getItem("viewProfilePic");

    // inserts user info onto the page
    document.getElementById("profileName").innerHTML = sessionStorage.getItem("viewName");
    document.getElementById("bio").innerHTML = sessionStorage.getItem("viewBio");