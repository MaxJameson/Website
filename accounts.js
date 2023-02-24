// stores the relavent objects from the webpahe
const myForm = document.getElementById("myForm");

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
    userName = document.getElementById("username").value;
    nameExists = await getName(userName, 2);
    if (nameExists > 0){
        alert("Username Already Taken, Sorry.\n");
    }
    else{
        alert("New user name");
    }
}


// checks name of userName is valid
async function getName(name, tbl) {

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