// stores the relavent objects from the webpahe
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
        signIn();
        console.log("Hi");
    }
});


// signs user in
function signIn(){

}

// creates an account for the user
async function createAccount(){


    const userName = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const bio = document.getElementById("bio").value;
    const image = document.getElementById("file");

    // checks upload conditions and returns errors
    conditionsPromise = await checkCreation(userName, pass, bio, image.value);
    console.log("HI");

    if (conditionsPromise != ""){
        console.log("1");
        alert(conditionsPromise);
    }
    else{
        
        // converts the file name to image name defined bu the user
        split = image.files[0].name.split('.');
        console.log("2");
        exec = split.pop();
        newName = userName + '.' + exec;
        const renamed = new File([image.files[0]], newName);
        
        // store php post method and creates form for the data
        const endpoint = "uploader.php";
        const formData = new FormData();
        
        // adds uploaded image to form
        formData.append("images", renamed);
        formData.append("path", "profilePictures/");
            
        // uses fetch api to submit a php post request
        fetch(endpoint, {
            method: "post",
            body: formData
        }).catch(console.error);

        accountUploader(userName, pass, bio, newName);

        // provides feedback for the user
        alert("Account created, welcome to bitmap");

        // !! move to homepage or profile page

    }

}


// checks name of userName is valid
async function checkName(name, tbl) {

    // creates form for post
    const nameForm = new FormData();
    nameForm.append('Name',name);
    nameForm.append('table',tbl);

    // posts data to be check by the sql database
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

function accountUploader(userName, password, bio, profilePic){
    // stores current date
    date = new Date().toJSON().slice(0, 10);    
    
    // stores php files name
    const endpoint = "SQLcreateProfile.php";

    // formats storage path
    path = "profilePictires/" + profilePic;
    
    // appends required data to a form
    const sqlForm = new FormData();
    sqlForm.append('userName',userName);
    sqlForm.append('password',password);
    sqlForm.append('bio',bio);
    sqlForm.append('profilePic',path);
    sqlForm.append('date',date);

    
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