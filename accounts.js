// stores the relavent objects from the webpahe
const myForm = document.getElementById("myForm");

// stores the name of the current page
url = document.URL;
file = url.substring(url.lastIndexOf('/')+1);

myForm.addEventListener("submit", e => {

    //prevents the button from carrying out it's usual function
    e.preventDefault();

    if (file == "createaccount.html"){
        createAccount();
    }
    else if( file == "signin.html"){
        signIn();
    }
});


// signs user in
function signIn(){

}

// creates an account for the user
function createAccount(){

}