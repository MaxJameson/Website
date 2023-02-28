// stores the relavent objects from the webpage
const myForm = document.getElementById("myForm");
const inputFields = document.querySelectorAll('input');

// stores the name of the current page
url = document.URL;
file = url.substring(url.lastIndexOf('/')+1);
console.log(url);

myForm.addEventListener("submit", e => {

    //prevents the button from carrying out it's usual function
    e.preventDefault();
    
    if (file == "createaccount.html"){

        // creates an account
        createAccount();

    }
    else if( file == "signin.html"){

        // signs a user in
        signIn();

    }
});


// signs user in
async function signIn(){

    // gets user input
    const userName = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    // creates form for post
    const loginForm = new FormData();
    loginForm.append('userName',userName);
    loginForm.append('pass',pass);
    
    // posts data to be checked by the sql database
    await fetch('SQLlogin.php',{
        method: "post",
        body: loginForm
    }).then((res) => res.json())
    .then(response => {
        details = response;
    }).catch(error => console.log(error))
    
    // checks returned data to see if the user can be logged in
    if (Object.keys(details).length == 0){

        alert("Incorrect username or password, please try again");

        // clears input fields
        const inputFields = document.querySelectorAll('input');
        inputFields.forEach(input => input.value = '');
    }
    else{

        // logs the user in and stores information in session storageto be used on the profile page
        sessionStorage.setItem("user", userName);
        sessionStorage.setItem("userID", details[0]["UserID"]);
        sessionStorage.setItem("profilePic", details[0]["ProfilePicture"]);
        sessionStorage.setItem("bio", details[0]["Bio"]);
        console.log(sessionStorage.getItem("profilePic"));

        // moves user to profile page
        document.location.href = "profile.html";
    }


}

// creates an account for the user
async function createAccount(){

    // gets user input
    const userName = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const bio = document.getElementById("bio").value;
    const image = document.getElementById("file");

    // checks inputs agains a series of coniditions
    conditionsPromise = await checkCreation(userName, pass, bio, image.value);

    // checks if any conditions have been met
    if (conditionsPromise != ""){

        alert(conditionsPromise);
    }
    else{
        
        // converts the file name to image name defined by the user
        split = image.files[0].name.split('.');
        console.log("2");
        exec = split.pop();
        newName = userName + '.' + exec;
        const renamed = new File([image.files[0]], newName);
        
        // store php post method and creates form for the data for profile picture
        const endpoint = "uploader.php";
        const formData = new FormData();
        
        // adds profile picture to form
        formData.append("images", renamed);
        formData.append("path", "profilePictures/");
            
        // uses fetch api to upload the picture to local storage using php
        fetch(endpoint, {
            method: "post",
            body: formData
        }).catch(console.error);

        // formats storage path
        path = "profilePictures/" + newName;

        // runs function to submit new account to the database
        accountUploader(userName, pass, bio, path);

        // provides feedback for the user
        alert("Account created, welcome to bitmap");

        // stores account information in session storage
        sessionStorage.setItem("user", userName);
        sessionStorage.setItem("profilePic", path);
        sessionStorage.setItem("bio", bio);
        document.location.href = "profile.html";

        // !! move to homepage or profile page

    }

}


// checks name of userName is valid
async function checkName(name, tbl) {

    // creates form for post
    const nameForm = new FormData();
    nameForm.append('Name',name);
    nameForm.append('table',tbl);

    // posts data to be checked by the sql database
    await fetch('nameChecker.php',{
        method: "post",
        body: nameForm
    }).then((res) => res.json())
    .then(response => {
        rep = response;
    }).catch(error => console.log(error)) 

    // returns query reponse
    return Object.keys(rep).length;

}

async function checkCreation (userName, pass, bio, image){

    // stores list of errors
    conditions = []

    // checks if the photo has a name
    if(userName == ""){
        conditions.push("Please choose your user name.\n");
    }
    else{
        
        // checks if the username already exists
        nameExists = await checkName(userName, 2);
        if (nameExists > 0){
            conditions.push("Username Already Taken, Sorry.\n");
        }
    }

    // checks if the photo has a name
    if(pass == ""){
        conditions.push("Please add a password.\n");
    }

    // checks if the photo has a name
    if(bio == ""){
        conditions.push("Please add a bio.\n");
    }  

    // checks if the file is of the correct extenstion
    var re = /(\.jpg|\.jpeg|\.png|\.JPG|\.JPEG|\.PNG)$/i;
    if(image == "")
    {
        conditions.push("Please add a photo.\n");
    }
    else if (!re.exec(image)) {
        conditions.push("File extension not supported!\nsupported file formats are: JPG, JPEG, PNG.\n");
    }

    // stores string of errors
    var conOutput = "";
        
    // loops through array of errors and adds them to a string
    for (i in conditions){
        conOutput = conOutput + conditions[i];
    }
    return conOutput;
}

function accountUploader(userName, password, bio, path){
    // stores current date
    date = new Date().toJSON().slice(0, 10);    
    
    // stores php files name
    const endpoint = "SQLcreateProfile.php";


    
    // appends required data to a form
    const sqlForm = new FormData();
    sqlForm.append('userName',userName);
    sqlForm.append('password',password);
    sqlForm.append('bio',bio);
    sqlForm.append('profilePic',path);
    sqlForm.append('date',date);

    
    // uses fetch api to submit a php post request for the account information
    fetch(endpoint, {
        method: "post",
        body: sqlForm
    }).then(function(response){
        console.log(response);
        return response.text();
    }).then(function(text){
        console.log(text);
        sessionStorage.setItem("userID", text.slice(-2));
    }).catch(function(error){
        console.error(error);
    })   
}