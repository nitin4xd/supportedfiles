/* =====================================
   ADMIN USER PANEL - MAIN JAVASCRIPT
===================================== */


/* =========================
   INITIAL DATABASE
========================= */


function initializeSystem(){

    let users = localStorage.getItem("users");


    if(!users){

        const defaultUsers = [

            {
                id:1,
                username:"admin",
                password:"admin123",
                role:"admin",
                created:new Date().toLocaleString(),
                lastLogin:"Never",
                active:true
            }

        ];


        localStorage.setItem(
            "users",
            JSON.stringify(defaultUsers)
        );


    }


    if(!localStorage.getItem("logs")){

        localStorage.setItem(
            "logs",
            JSON.stringify([])
        );

    }

}


initializeSystem();



/* =========================
   PASSWORD SHOW/HIDE
========================= */


function togglePassword(){

    let pass =
    document.getElementById("password");


    if(pass.type==="password"){

        pass.type="text";

    }
    else{

        pass.type="password";

    }

}



/* =========================
   LOGIN SYSTEM
========================= */


let loginForm =
document.getElementById("loginForm");


if(loginForm){


loginForm.addEventListener(
"submit",
function(e){


e.preventDefault();



let username =
document.getElementById("username").value.trim();



let password =
document.getElementById("password").value.trim();



let users =
JSON.parse(localStorage.getItem("users"));



let user =
users.find(
u =>
u.username===username &&
u.password===password
);



let message =
document.getElementById("message");



if(!user){


message.innerHTML =
"Invalid Username or Password";


message.style.color="yellow";


return;


}



user.lastLogin =
new Date().toLocaleString();


user.active=true;



localStorage.setItem(
"users",
JSON.stringify(users)
);



localStorage.setItem(
"currentUser",
JSON.stringify(user)
);



addLog(
user.username+
" logged in"
);



if(user.role==="admin"){


window.location="admin.html";


}
else{


window.location="user.html";


}



});


}





/* =========================
   LOGOUT
========================= */


function logout(){


let user =
JSON.parse(
localStorage.getItem("currentUser")
);



if(user){

addLog(
user.username+
" logged out"
);

}



localStorage.removeItem(
"currentUser"
);



window.location="index.html";


}





/* =========================
   ADMIN CHECK
========================= */


function checkAdmin(){


let user =
JSON.parse(
localStorage.getItem("currentUser")
);



if(!user || user.role!=="admin"){


window.location="index.html";


}



}





/* =========================
   USER CHECK
========================= */


function checkUser(){


let user =
JSON.parse(
localStorage.getItem("currentUser")
);



if(!user){


window.location="index.html";


}



}





/* =========================
   USER COUNT
========================= */


function dashboardStats(){


let users =
JSON.parse(
localStorage.getItem("users")
);



let total =
document.getElementById("totalUsers");



if(total){


total.innerHTML =
users.filter(
u=>u.role==="user"
).length;


}



let admin =
document.getElementById("totalAdmin");


if(admin){


admin.innerHTML =
users.filter(
u=>u.role==="admin"
).length;


}


}





/* =========================
   LOAD USERS
========================= */


function loadUsers(){


let table =
document.getElementById("userTable");


if(!table) return;



let users =
JSON.parse(
localStorage.getItem("users")
);



table.innerHTML="";



users.forEach(user=>{


if(user.role==="admin")
return;



table.innerHTML += `


<tr>

<td>${user.username}</td>

<td>${user.created}</td>

<td>${user.lastLogin}</td>

<td>

<button class="btn btn-success"
onclick="changePassword('${user.username}')">

Password

</button>


<button class="btn btn-danger"
onclick="deleteUser('${user.username}')">

Delete

</button>


</td>


</tr>


`;



});



}





/* =========================
   CREATE USER
========================= */


function createUser(){


let username =
document.getElementById("newUsername").value.trim();



let password =
document.getElementById("newPassword").value.trim();



if(!username || !password){

alert("Fill all details");

return;

}



let users =
JSON.parse(
localStorage.getItem("users")
);



let exists =
users.find(
u=>u.username===username
);



if(exists){

alert("Username already exists");

return;

}



users.push({

id:Date.now(),

username,

password,

role:"user",

created:new Date().toLocaleString(),

lastLogin:"Never",

active:false


});



localStorage.setItem(
"users",
JSON.stringify(users)
);



addLog(
"Created user : "+username
);



loadUsers();



alert(
"User Created"
);



}






/* =========================
   DELETE USER
========================= */


function deleteUser(username){


if(!confirm("Delete user?"))
return;



let users =
JSON.parse(
localStorage.getItem("users")
);



users =
users.filter(
u=>u.username!==username
);



localStorage.setItem(
"users",
JSON.stringify(users)
);



addLog(
"Deleted user : "+username
);



loadUsers();


}





/* =========================
   CHANGE PASSWORD
========================= */


function changePassword(username){


let pass =
prompt(
"Enter new password"
);



if(!pass)
return;



let users =
JSON.parse(
localStorage.getItem("users")
);



users.forEach(user=>{


if(user.username===username){

user.password=pass;

}


});



localStorage.setItem(
"users",
JSON.stringify(users)
);



addLog(
"Password changed : "+username
);



alert(
"Password Updated"
);



}






/* =========================
   SEARCH USER
========================= */


function searchUser(){


let value =
document.getElementById("search").value.toLowerCase();



let rows =
document.querySelectorAll(
"#userTable tr"
);



rows.forEach(row=>{


row.style.display =
row.innerText.toLowerCase()
.includes(value)
?
""
:
"none";

});


}





/* =========================
   DARK MODE
========================= */


function darkMode(){


document.body.classList.toggle(
"dark"
);


}






/* =========================
   LOG SYSTEM
========================= */


function addLog(text){


let logs =
JSON.parse(
localStorage.getItem("logs")
);



logs.push({

text,

time:
new Date().toLocaleString()

});



localStorage.setItem(
"logs",
JSON.stringify(logs)
);



}





/* =========================
   USER PROFILE
========================= */


function loadProfile(){


let user =
JSON.parse(
localStorage.getItem("currentUser")
);



let name =
document.getElementById("profileName");



if(name){

name.innerHTML =
user.username;


}


}

/* =========================
   CHANGE ADMIN PASSWORD
========================= */


function changeAdminPassword(){


let oldPass =
document.getElementById("oldAdminPassword").value.trim();


let newPass =
document.getElementById("newAdminPassword").value.trim();


let confirmPass =
document.getElementById("confirmAdminPassword").value.trim();



if(!oldPass || !newPass || !confirmPass){

    alert("Please fill all fields");
    return;

}



if(newPass !== confirmPass){

    alert("New password and confirm password do not match");
    return;

}



let users =
JSON.parse(localStorage.getItem("users"));



let admin =
users.find(
u => u.username === "admin"
);



if(!admin){

    alert("Admin account not found");
    return;

}



if(admin.password !== oldPass){

    alert("Current password is incorrect");
    return;

}



admin.password = newPass;



localStorage.setItem(
"users",
JSON.stringify(users)
);



addLog(
"Admin password changed"
);



alert(
"Admin password updated successfully"
);



document.getElementById("oldAdminPassword").value="";
document.getElementById("newAdminPassword").value="";
document.getElementById("confirmAdminPassword").value="";


}
