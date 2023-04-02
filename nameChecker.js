// checks name of photo is valid
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
        photos = response;
    }).catch(error => console.log(error)) 

    // returns query reponse
    return Object.keys(photos).length;

}