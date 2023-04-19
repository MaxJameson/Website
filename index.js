// checks if a user has signed in
if (sessionStorage.getItem("user") != null){

    // changes to the sign in page
    document.getElementById("welcomeText").innerHTML = 'Welcome to bitMap ' + sessionStorage.getItem("user") +"!";
}
else{
    // sets page to display user related information
    document.getElementById("uploadBox").innerHTML = '<h3 class="headers">Please <u><a href="signin.html">Sign in </a></u>to upload photos</h3>';
    document.getElementById("profileText").innerHTML = 'Sign In';
}
