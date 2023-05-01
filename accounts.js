// stores the relavent objects from the webpage
const myForm = document.getElementById("myForm");
const inputFields = document.querySelectorAll('input');

// stores the name of the current page
url = document.URL;
file = url.substring(url.lastIndexOf('/')+1);

// adds event listener to the uploader form
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

        UserCondition = document.getElementById("userError");
        UserCondition.innerHTML = 'Incorrect username or password, please try again';

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
        sessionStorage.setItem("loggedin", true);

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
    conditionsNotMet = await checkCreation(userName, pass, bio, image.value);

    // checks if any errors were found
    if (!conditionsNotMet){
        // converts the file name to image name defined by the user
        split = image.files[0].name.split('.');
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
        sessionStorage.setItem("loggedin", true);
        document.location.href = "profile.html"; 

    }

}

// checks if account information is valid
async function checkCreation (userName, pass, bio, image){

    // storage error message display blocks
    UserCondition = document.getElementById("userError");
    PassCondition = document.getElementById("passError");
    PassCondition2 = document.getElementById("passError2");
    PassCondition3 = document.getElementById("passError3");
    PassCondition4 = document.getElementById("passError4");
    BioCondition = document.getElementById("bioError");
    PicCondition = document.getElementById("picError");
    UserCondition.innerHTML = '';
    PassCondition.innerHTML = '';
    PassCondition2.innerHTML = '';
    PassCondition3.innerHTML = '';
    PassCondition4.innerHTML = '';
    BioCondition.innerHTML = '';
    PicCondition.innerHTML = '';
    

    //boolean to check if any inputs have errors
    errors = false;

    // checks if the photo has a name
    if(userName == ""){
        errors = true;
        UserCondition.innerHTML = 'Please enter your username';
    }
    else if(userName.length > 18){
        errors = true;
        UserCondition.innerHTML = 'Username too long.';
    }
    else{
        
        // checks if the username already exists
        nameExists = await getName(userName, 2);
        if (nameExists > 0){
            errors = true;
            UserCondition.innerHTML = 'Username Already Taken, Sorry';
        }
    }

    // stores regular expression of test for the password input
    let strength = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})');


    // checks if the photo has a name
    if(pass == ""){
        errors = true;
        PassCondition.innerHTML = 'Please enter a password.';
    }
    else if(pass.length > 30){
        errors = true;
        PassCondition.innerHTML = 'Password too long.';
    }
    // checks password strenght
    else if(!strength.test(pass) && pass != ""){

        // checks individual requirements
        let pLength = new RegExp('(?=.{6,})');
        let pCase = new RegExp('(?=.*[a-z])(?=.*[A-Z])');
        let pDigit = new RegExp('(?=.*[0-9])');
        let pSpecial = new RegExp('(?=.*[^A-Za-z0-9])');

        // checks password lenght
        if(!pLength.test(pass)){
            errors = true;
            PassCondition.innerHTML = 'Password must be a minium of 6 characters long.';
        }


        // checks if password contains upper and lowercase letters
        if(!pCase.test(pass)){
            errors = true;
            PassCondition2.innerHTML = 'Password must at least 1 captial letter and one lower case letter.';
        }
    
        // checks if password contains any numbers
        if(!pDigit.test(pass)){
            errors = true;
            PassCondition3.innerHTML = 'Password must at least 1 number.';
        }

        // checks is pasword contains any symbols
        if(!pSpecial.test(pass)){
            errors = true;
            PassCondition4.innerHTML = 'Password must at least 1 special character (e.g. ?).';
        }
    }


    // checks if the photo has a name
    if(bio == ""){
        errors = true;
        BioCondition.innerHTML = 'Please add a bio.';
    }
    else if(bio.length > 300){
        errors = true;
        BioCondition.innerHTML = 'Bio must be less than 300 characters.';
    }  

    // checks if the file is of the correct extenstion
    var re = /(\.jpg|\.jpeg|\.png|\.JPG|\.JPEG|\.PNG)$/i;
    if(image == "")
    {
        errors = true;
        PicCondition.innerHTML = 'Please add a photo.';
    }
    else if (!re.exec(image)) {
        errors = true;
        PicCondition.innerHTML = 'File extension not supported!\nsupported file formats are: JPG, JPEG, PNG.';
    }

    return errors;
}

//uploads account to database
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