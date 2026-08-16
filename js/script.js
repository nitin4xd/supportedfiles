/* =====================================
   ADMIN USER PANEL - MAIN JAVASCRIPT
===================================== */

let logsRequestId = 0;
/* =========================
   INITIAL DATABASE
========================= */

function initializeSystem(){

    let users = localStorage.getItem("users");

    if(!users){

        const defaultUsers = [
            {
                id: 1,
                username: "admin",
                password: "admin123",
                role: "admin",
                created: new Date().toLocaleString(),
                lastLogin: "Never",
                active: true
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
   PASSWORD SHOW / HIDE
========================= */

function togglePassword(){

    const pass =
        document.getElementById("password");

    if(!pass) return;

    if(pass.type === "password"){
        pass.type = "text";
    }
    else{
        pass.type = "password";
    }
}


/* =========================
   LOGIN SYSTEM
========================= */

const loginForm =
    document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            const username =
                document
                .getElementById("username")
                .value
                .trim();

            const password =
                document
                .getElementById("password")
                .value
                .trim();

            const message =
                document.getElementById("message");

            if(!username || !password){

                message.innerHTML =
                    "Username and Password required";

                message.style.color = "yellow";

                return;
            }

            try{

                const response =
                    await fetch(
                        "login.php",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },

                            body:
                                "username=" +
                                encodeURIComponent(username) +
                                "&password=" +
                                encodeURIComponent(password)
                        }
                    );

                const result =
                    await response.json();

                if(!result.success){

                    message.innerHTML =
                        result.message ||
                        "Invalid Username or Password";

                    message.style.color =
                        "yellow";

                    return;
                }

                const user = {

                    id: result.id,

                    username:
                        result.username,

                    role:
                        result.role,

                    active: true
                };

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(user)
                );

                await addLog(
                    user.username +
                    " logged in"
                );

                if(user.role === "admin"){

                    window.location =
                        "admin.html";

                }
                else{

                    window.location =
                        "user.html";
                }

            }
            catch(error){

                console.error(error);

                message.innerHTML =
                    "Server connection error";

                message.style.color =
                    "red";
            }
        }
    );
}


/* =========================
   LOGOUT
========================= */

async function logout(){

    try{

        await fetch(
            "logout.php",
            {
                method: "POST"
            }
        );

    }
    catch(error){

        console.error(error);
    }

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "index.html";
}


/* =========================
   ADMIN CHECK
========================= */

function checkAdmin(){

    const user =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    if(
        !user ||
        user.role !== "admin"
    ){

        window.location =
            "index.html";
    }
}


/* =========================
   USER CHECK
========================= */

function checkUser(){

    const user =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    if(!user){

        window.location =
            "index.html";
    }
}


/* =========================
   DASHBOARD STATS
========================= */

function dashboardStats(){

    const users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    const total =
        document.getElementById(
            "totalUsers"
        );

    if(total){

        total.innerHTML =
            users.filter(
                u => u.role === "user"
            ).length;
    }

    const admin =
        document.getElementById(
            "totalAdmin"
        );

    if(admin){

        admin.innerHTML =
            users.filter(
                u => u.role === "admin"
            ).length;
    }
}


/* =========================
   LOAD USERS
========================= */

async function loadUsers(){

    const table =
        document.getElementById(
            "userTable"
        );

    if(!table) return;

    try{

        const response =
            await fetch(
                "load-users.php"
            );

        const result =
            await response.json();

        if(!result.success){

            alert(
                "Users load नहीं हो पाए"
            );

            return;
        }

        table.innerHTML = "";

        const totalUsers =
            document.getElementById(
                "totalUsers"
            );

        if(totalUsers){

            totalUsers.innerText =
                result.users.length;
        }

        let activeCount = 0;
        let inactiveCount = 0;
        let neverLoginCount = 0;

        result.users.forEach(
            user => {

                if(user.active){

                    activeCount++;

                }
                else{

                    inactiveCount++;
                }

                if(
                    !user.lastLogin ||
                    user.lastLogin === "Never"
                ){

                    neverLoginCount++;
                }
            }
        );

        const activeUsers =
            document.getElementById(
                "activeUsers"
            );

        if(activeUsers){

            activeUsers.innerText =
                activeCount;
        }

        const inactiveUsers =
            document.getElementById(
                "inactiveUsers"
            );

        if(inactiveUsers){

            inactiveUsers.innerText =
                inactiveCount;
        }

        const neverLoggedIn =
            document.getElementById(
                "neverLoggedIn"
            );

        if(neverLoggedIn){

            neverLoggedIn.innerText =
                neverLoginCount;
        }

        result.users.forEach(
            user => {

                table.innerHTML += `

                    <tr>

                        <td>
                            ${user.username}
                        </td>

                        <td>
                            ${user.created}
                        </td>

                        <td>
                            ${user.lastLogin}
                        </td>

                        <td>

                            <button
                                class="btn btn-success"
                                onclick="changePassword('${user.username}')">

                                Password

                            </button>

                            <button
                                class="btn ${
                                    user.active
                                    ? "btn-warning"
                                    : "btn-success"
                                }"
                                onclick="toggleUser('${user.username}')">

                                ${
                                    user.active
                                    ? "Deactivate"
                                    : "Activate"
                                }

                            </button>

                            <button
                                class="btn btn-danger"
                                onclick="deleteUser('${user.username}')">

                                Delete

                            </button>

                        </td>

                    </tr>

                `;
            }
        );

    }
    catch(error){

        console.error(error);

        alert(
            "Server connection error"
        );
    }
}


/* =========================
   CREATE USER
========================= */

async function createUser(){

    const username =
        document
        .getElementById("newUsername")
        .value
        .trim();

    const password =
        document
        .getElementById("newPassword")
        .value
        .trim();

    if(!username || !password){

        alert(
            "Fill all details"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "create-user.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        "username=" +
                        encodeURIComponent(username) +
                        "&password=" +
                        encodeURIComponent(password)
                }
            );

        const result =
            await response.json();

        if(!result.success){

            alert(
                result.message
            );

            return;
        }

        await addLog(
            "Created user : " +
            username
        );

        document.getElementById(
            "newUsername"
        ).value = "";

        document.getElementById(
            "newPassword"
        ).value = "";

        await loadUsers();

        await loadLogs(1);

        await loadRecentLogs();

        alert(
            "User Created"
        );

    }
    catch(error){

        console.error(error);

        alert(
            "Server connection error"
        );
    }
}


/* =========================
   DELETE USER
========================= */

async function deleteUser(username){

    if(
        !confirm(
            "क्या आप " +
            username +
            " को delete करना चाहते हैं?"
        )
    ){

        return;
    }

    try{

        const formData =
            new FormData();

        formData.append(
            "username",
            username
        );

        const response =
            await fetch(
                "delete-user.php",
                {
                    method: "POST",
                    body: formData
                }
            );

        const result =
            await response.json();

        if(result.success){

            await addLog(
                "Deleted user : " +
                username
            );

            await loadLogs(1);

            await loadUsers();

            await loadRecentLogs();

            alert(
                "User deleted successfully"
            );

        }
        else{

            alert(
                result.message ||
                "User delete नहीं हुआ"
            );
        }

    }
    catch(error){

        console.error(error);

        alert(
            "Server connection error"
        );
    }
}


/* =========================
   CHANGE USER PASSWORD
========================= */

async function changePassword(username){

    const pass =
        prompt(
            "Enter new password"
        );

    if(!pass) return;

    try{

        const response =
            await fetch(
                "change-user-password.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        "username=" +
                        encodeURIComponent(username) +
                        "&newPassword=" +
                        encodeURIComponent(pass)
                }
            );

        const result =
            await response.json();

        if(!result.success){

            alert(
                result.message
            );

            return;
        }

        await addLog(
            "Password changed : " +
            username
        );

        await loadLogs(1);

        alert(
            "Password Updated"
        );

    }
    catch(error){

        console.error(error);

        alert(
            "Server connection error"
        );
    }
}


/* =========================
   SEARCH USER
========================= */

function searchUser(){

    const input =
        document.getElementById(
            "search"
        );

    if(!input) return;

    const value =
        input.value
        .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#userTable tr"
        );

    rows.forEach(
        row => {

            row.style.display =
                row.innerText
                .toLowerCase()
                .includes(value)
                ? ""
                : "none";
        }
    );
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
   ACTIVITY LOG SAVE
========================= */

async function addLog(text){

    try{

        const response =
            await fetch(
                "add-log.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            activity: text
                        })
                }
            );

        const result =
            await response.json();

        if(!result.success){

            console.error(
                "Activity log save failed:",
                result.message
            );
        }

    }
    catch(error){

        console.error(
            "Activity log error:",
            error
        );
    }
}


/* =========================
   USER PROFILE
========================= */

async function loadProfile(){

    try{

        const response =
            await fetch(
                "user-profile.php"
            );

        const result =
            await response.json();

        if(!result.success){

            alert(
                "Profile data नहीं मिली"
            );

            return;
        }

        const profileName =
            document.getElementById(
                "profileName"
            );

        if(profileName){

            profileName.innerHTML =
                result.username;
        }

        const usernameView =
            document.getElementById(
                "usernameView"
            );

        if(usernameView){

            usernameView.innerHTML =
                result.username;
        }

        const lastLogin =
            document.getElementById(
                "lastLogin"
            );

        if(lastLogin){

            lastLogin.innerHTML =
                result.lastLogin ||
                "Not available";
        }

        const createdDate =
            document.getElementById(
                "createdDate"
            );

        if(createdDate){

            createdDate.innerHTML =
                result.created ||
                "Not available";
        }

    }
    catch(error){

        console.error(error);

        alert(
            "Profile loading error"
        );
    }
}


/* =========================
   CHANGE ADMIN PASSWORD
========================= */

async function changeAdminPassword(){

    const oldPass =
        document
        .getElementById(
            "oldAdminPassword"
        )
        .value
        .trim();

    const newPass =
        document
        .getElementById(
            "newAdminPassword"
        )
        .value
        .trim();

    const confirmPass =
        document
        .getElementById(
            "confirmAdminPassword"
        )
        .value
        .trim();

    if(
        !oldPass ||
        !newPass ||
        !confirmPass
    ){

        alert(
            "Please fill all fields"
        );

        return;
    }

    if(newPass !== confirmPass){

        alert(
            "New password and confirm password do not match"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "change-password.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        "oldPassword=" +
                        encodeURIComponent(oldPass) +
                        "&newPassword=" +
                        encodeURIComponent(newPass)
                }
            );

        const result =
            await response.json();

        if(!result.success){

            alert(
                result.message
            );

            return;
        }

        await addLog(
            "Admin password changed"
        );

        await loadLogs(1);

        alert(
            "Admin password updated successfully"
        );

        document.getElementById(
            "oldAdminPassword"
        ).value = "";

        document.getElementById(
            "newAdminPassword"
        ).value = "";

        document.getElementById(
            "confirmAdminPassword"
        ).value = "";

    }
    catch(error){

        console.error(error);

        alert(
            "Server connection error"
        );
    }
}


/* =========================
   TOGGLE USER
========================= */

async function toggleUser(username){

    if(
        !confirm(
            "क्या आप " +
            username +
            " का status बदलना चाहते हैं?"
        )
    ){

        return;
    }

    try{

        const formData =
            new FormData();

        formData.append(
            "username",
            username
        );

        const response =
            await fetch(
                "toggle-user.php",
                {
                    method: "POST",
                    body: formData
                }
            );

        const result =
            await response.json();

        if(result.success){

            await addLog(
                result.message +
                " : " +
                username
            );

            await loadLogs(1);

            await loadUsers();

            await loadRecentLogs();

            alert(
                result.message
            );

        }
        else{

            alert(
                result.message ||
                "Status update नहीं हुआ"
            );
        }

    }
    catch(error){

        console.error(error);

        alert(
            "Server connection error"
        );
    }
}


/* =================================
   ACTIVITY LOG SYSTEM
================================= */

let currentLogPage = 1;

let totalLogPages = 1;


/* =================================
   FORMAT DATE
================================= */

function formatLogDate(dateTime){

    if(!dateTime){

        return "";
    }

    const parts =
        dateTime.split(" ");

    if(parts.length < 2){

        return dateTime;
    }

    const date =
        parts[0].split("-");

    const time =
        parts[1];

    if(date.length !== 3){

        return dateTime;
    }

    return (
        date[2] +
        "-" +
        date[1] +
        "-" +
        date[0] +
        " " +
        time
    );
}


/* =================================
   LOAD ACTIVITY LOGS
================================= */


async function loadLogs(page = 1) {

    const logsDiv =
        document.getElementById("logs");

    if (!logsDiv) return;


    /* =========================
       INPUTS
    ========================= */

    const dateInput =
        document.getElementById("logDate");

    const searchInput =
        document.getElementById("logSearch");

    const filterInput =
        document.getElementById("logFilter");

    const userInput =
        document.getElementById("logUserFilter");


    /* =========================
       VALUES
    ========================= */

    const selectedDate =
        dateInput
            ? dateInput.value
            : "";

    const selectedUser =
        userInput
            ? userInput.value.trim().toLowerCase()
            : "all";

    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const activityFilter =
        filterInput
            ? filterInput.value.toLowerCase()
            : "all";


    currentLogPage = page;


    try {

        /* =========================
           URL
        ========================= */

        let url =
            "load-logs.php";

        const params =
            new URLSearchParams();


        if (selectedDate !== "") {

            params.append(
                "date",
                selectedDate
            );

        }


        if (
            selectedUser !== "" &&
            selectedUser !== "all"
        ) {

            params.append(
                "username",
                selectedUser
            );

        }


        params.append(
            "page",
            page
        );


        url +=
            "?" +
            params.toString();


        console.log(
            "FINAL LOAD URL:",
            url
        );


        /* =========================
           SERVER REQUEST
        ========================= */

        const response =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            logsDiv.innerHTML =
                "Activity load नहीं हो पाई";

            return;

        }


        /* =========================
           PAGINATION DATA
        ========================= */

        currentLogPage =
            Number(
                result.currentPage
            ) || 1;

        totalLogPages =
            Number(
                result.totalPages
            ) || 1;


        /* =========================
           NO LOGS
        ========================= */

        if (
            !result.logs ||
            result.logs.length === 0
        ) {

            logsDiv.innerHTML =
                "No activity found";


            renderLogPagination(
                currentLogPage,
                totalLogPages
            );


            return;

        }


        /* =========================
           SEARCH + USER + ACTIVITY
        ========================= */

        const filteredLogs =
            result.logs.filter(log => {


                const username =
                    (
                        log.username || ""
                    ).toLowerCase();


                const activity =
                    (
                        log.activity || ""
                    ).toLowerCase();


                const text =
                    username +
                    " " +
                    activity;


                /* SEARCH */

                const searchMatch =
                    text.includes(search);


                /* USER */

                const userMatch =
                    selectedUser === "all" ||
                    selectedUser === "" ||
                    username === selectedUser;


                /* ACTIVITY */

                let filterMatch = true;


                if (
                    activityFilter ===
                    "login"
                ) {

                    filterMatch =
                        activity.includes(
                            "logged in"
                        );

                }


                else if (
                    activityFilter ===
                    "logout"
                ) {

                    filterMatch =
                        activity.includes(
                            "logged out"
                        );

                }


                else if (
                    activityFilter ===
                    "created"
                ) {

                    filterMatch =
                        activity.includes(
                            "created user"
                        );

                }


                else if (
                    activityFilter ===
                    "deleted"
                ) {

                    filterMatch =
                        activity.includes(
                            "deleted user"
                        );

                }


                else if (
                    activityFilter ===
                    "activated"
                ) {

                    filterMatch =
                        activity.includes(
                            "activated"
                        );

                }


                else if (
                    activityFilter ===
                    "deactivated"
                ) {

                    filterMatch =
                        activity.includes(
                            "deactivated"
                        );

                }


                else if (
                    activityFilter ===
                    "password"
                ) {

                    filterMatch =
                        activity.includes(
                            "password"
                        );

                }


                else if (
                    activityFilter ===
                    "backup"
                ) {

                    filterMatch =
                        activity.includes(
                            "backup"
                        );

                }


                return (
                    userMatch &&
                    searchMatch &&
                    filterMatch
                );

            });


        /* =========================
           DISPLAY LOGS
        ========================= */

        if (
            filteredLogs.length === 0
        ) {

            logsDiv.innerHTML =
                "No activity found";

        }

        else {

            logsDiv.innerHTML =
                "";


            filteredLogs.forEach(
                log => {

                    let formattedDate =
                        "";

                    let formattedTime =
                        "";


                    if (log.time) {

                        const parts =
                            log.time.split(" ");


                        if (
                            parts.length >= 2
                        ) {

                            const dateParts =
                                parts[0].split("-");


                            if (
                                dateParts.length === 3
                            ) {

                                formattedDate =
                                    dateParts[2] +
                                    "-" +
                                    dateParts[1] +
                                    "-" +
                                    dateParts[0];

                            }


                            formattedTime =
                                parts[1];

                        }

                    }


                    logsDiv.innerHTML += `

                        <div
                            class="activity-item"
                            style="
                                padding:10px;
                                border-bottom:1px solid #ddd;
                            "
                        >

                            <strong>
                                ${log.username}
                            </strong>

                            - ${log.activity}

                            <br>

                            <small>
                                ${formattedDate}
                                &nbsp;
                                ${formattedTime}
                            </small>

                        </div>

                    `;

                }
            );

        }


        /* =========================
           PAGINATION
        ========================= */

        renderLogPagination(
            currentLogPage,
            totalLogPages
        );


    }

    catch(error) {

        console.error(
            "Activity Log Error:",
            error
        );


        logsDiv.innerHTML =
            "Server connection error";

    }

}


/* =================================
   PAGINATION
================================= */

function renderLogPagination(
    currentPage,
    totalPages
){

    let pagination =
        document.getElementById(
            "logPagination"
        );


    /*
       Pagination container बनाओ
    */

    if(!pagination){

        pagination =
            document.createElement(
                "div"
            );

        pagination.id =
            "logPagination";

        pagination.style.marginTop =
            "15px";

        pagination.style.display =
            "flex";

        pagination.style.gap =
            "8px";

        pagination.style.alignItems =
            "center";

        const logsDiv =
            document.getElementById(
                "logs"
            );

        if(
            logsDiv &&
            logsDiv.parentNode
        ){

            logsDiv.parentNode.appendChild(
                pagination
            );
        }
    }


    pagination.innerHTML =
        "";


    /*
       अगर सिर्फ एक page है
       तो buttons hide रखें
    */

    if(totalPages <= 1){

        return;
    }


    /*
       PREVIOUS
    */

    const previous =
        document.createElement(
            "button"
        );

    previous.className =
        "btn";

    previous.innerText =
        "Previous";

    previous.disabled =
        currentPage <= 1;

    previous.onclick =
        function(){

            if(
                currentPage > 1
            ){

                loadLogs(
                    currentPage - 1
                );
            }
        };


    pagination.appendChild(
        previous
    );


    /*
       PAGE NUMBER
    */

    const pageInfo =
        document.createElement(
            "span"
        );

    pageInfo.innerText =
        " Page " +
        currentPage +
        " of " +
        totalPages +
        " ";


    pagination.appendChild(
        pageInfo
    );


    /*
       NEXT
    */

    const next =
        document.createElement(
            "button"
        );

    next.className =
        "btn";

    next.innerText =
        "Next";

    next.disabled =
        currentPage >=
        totalPages;

    next.onclick =
        function(){

            if(
                currentPage <
                totalPages
            ){

                loadLogs(
                    currentPage + 1
                );
            }
        };


    pagination.appendChild(
        next
    );
}


/* =================================
   CLEAR SEARCH
================================= */

function clearLogSearch(){

    const searchInput =
        document.getElementById(
            "logSearch"
        );

    if(searchInput){

        searchInput.value =
            "";
    }

    const filterInput =
        document.getElementById(
            "logFilter"
        );

    if(filterInput){

        filterInput.value =
            "all";
    }

    currentLogPage =
        1;

    loadLogs(1);
}


/* =================================
   CLEAR DATE
================================= */


function clearLogDate() {

    const dateInput =
        document.getElementById("logDate");

    if (dateInput) {
        dateInput.value = "";
    }

    currentLogPage = 1;
    totalLogPages = 1;

    loadLogs(1);
}


function filterLogs() {

    currentLogPage = 1;

    loadLogs(1);

}


/* =================================
   CLEAR ALL LOGS
================================= */

async function clearAllLogs(){

    if(
        !confirm(
            "क्या आप सभी Activity Logs delete करना चाहते हैं?"
        )
    ){

        return;
    }

    try{

        const response =
            await fetch(
                "clear-logs.php",
                {
                    method: "POST"
                }
            );

        const result =
            await response.json();

        if(result.success){

            alert(
                "All logs cleared successfully"
            );

            /*
               Date/Search/Filter reset
            */

            const dateInput =
                document.getElementById(
                    "logDate"
                );

            if(dateInput){

                dateInput.value =
                    "";
            }

            const searchInput =
                document.getElementById(
                    "logSearch"
                );

            if(searchInput){

                searchInput.value =
                    "";
            }

            const filterInput =
                document.getElementById(
                    "logFilter"
                );

            if(filterInput){

                filterInput.value =
                    "all";
            }

            currentLogPage =
                1;

            await loadLogs(1);

            await loadRecentLogs();

        }
        else{

            alert(
                result.message ||
                "Logs clear नहीं हुए"
            );
        }

    }
    catch(error){

        console.error(error);

        alert(
            "Server connection error"
        );
    }
}


/* =================================
   RECENT LOGS
================================= */

async function loadRecentLogs(){

    try{

        const response =
            await fetch(
                "load-logs.php"
            );

        const result =
            await response.json();

        const box =
            document.getElementById(
                "recentLogs"
            );

        if(!box) return;

        if(
            !result.success ||
            !result.logs ||
            result.logs.length === 0
        ){

            box.innerHTML =
                "No recent activity";

            return;
        }

        const recent =
            result.logs.slice(
                0,
                5
            );

        box.innerHTML =
            "";

        recent.forEach(
            log => {

                box.innerHTML += `

                    <div
                        class="activity-item"
                        style="
                            padding:10px;
                            border-bottom:1px solid #ddd;
                        ">

                        <strong>
                            ${log.activity}
                        </strong>

                        <br>

                        <small>
                            ${formatLogDate(
                                log.time
                            )}
                        </small>

                    </div>

                `;
            }
        );

    }
    catch(error){

        console.error(
            error
        );
    }
}


async function loadLogUsers() {

    const userFilter =
        document.getElementById("logUserFilter");

    if (!userFilter) return;

    try {

        const response =
            await fetch("get-log-users.php", {
                cache: "no-store"
            });

        if (!response.ok) {
            throw new Error(
                "HTTP Error " + response.status
            );
        }

        const result =
            await response.json();

        if (!result.success) {
            return;
        }

        userFilter.innerHTML = `
            <option value="all">
                All Users
            </option>
        `;

        result.users.forEach(username => {

            const option =
                document.createElement("option");

            option.value = username;
            option.textContent = username;

            userFilter.appendChild(option);

        });

    }
    catch(error) {

        console.error(
            "Log users load error:",
            error
        );

    }

}