/*!
    * Start Bootstrap - Grayscale v6.0.2 (https://startbootstrap.com/themes/grayscale)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
    */

(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length
                ? target
                : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate(
                    {
                        scrollTop: target.offset().top - 70,
                    },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 100,
    });

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);



})(jQuery); // End of use strict


const nav = (page, params = {}) => {
    let paramList = [];
    for (let key in params) {
        paramList.push(key + "=" + params[key]);
    }
    let paramString = "?" + paramList.join("&");
    window.location.replace(page === '' ? '/' : '/' + page + '.html' +paramString);
}

let urlHost = "http://localhost:8081";
let urlImage = "http://localhost:8082";
let urlComment = "http://localhost:8083";

async function changePassword() {
    let curr = document.getElementById('currentPassword').value;
    let newPassword = document.getElementById('newChangePassword').value;
    let confirmNewPassword = document.getElementById('confirmNewChangePassword').value;
    if (newPassword !== confirmNewPassword) {
        document.getElementById('newChangePassword').value = "";
        document.getElementById('confirmNewChangePassword').value = "";
        alert("Passwords do not match!");
        return;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 201) {
                nav("dashboard")
                alert("Password Changed Successfully")
            } else if (xhttp.status === 409) {
                alert(xhttp.responseText);
                document.getElementById('currentPassword').value = "";
            }
        }
    };

    let hashedPassword = await sha256(curr);
    let hashedNewPassword = await sha256(newPassword);
    let url = urlHost + "/change/?";
    url += "newpassword=" + hashedNewPassword + "&" +"password=" + hashedPassword;

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}
async function signup() {
    //Username, Password, First Name, Last Name, Email -> sign in via Email/User
    let username = document.getElementById('userName').value;
    let email = document.getElementById('inputEmail').value;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if(!validateEmail(email)) {
        alert("Invalid Email!");
        return;
    }

    if(!validateUsername(username) || username.length > 32) {
        alert("Username may only contain letters a - z, A - Z and numbers 0 - 9 and be under 32 characters");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 201) {
                // displayLogin();
                showLoginForm();
                alert("Account Created successfully!");
            } else if (xhttp.status === 409) {
                alert(xhttp.responseText);
            }
        }
    };

    let hashedPassword = await sha256(password);

    let url = urlHost + "/signup/?";
    url += "username=" + username + "&";
    url += "email=" + email + "&";
    url += "first_name=" + firstName + "&";
    url += "last_name=" + lastName + "&";
    url += "password=" + hashedPassword;


    xhttp.open("GET", url);
    xhttp.send();
}

async function login() {
    //Username, Password, First Name, Last Name, Email -> sign in via Email/User
    let usernameEmail = document.getElementById('userNameLogin').value;
    let passwordLogin = document.getElementById('passwordLogin').value;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                document.cookie = "auth-token=" + xhttp.responseText.split(":")[1]
                nav("dashboard")
            } else if (xhttp.status === 401) {
                alert("Login Failed");
                document.getElementById('passwordLogin').value = "";
            }
        }
    };

    let hashedPassword = await sha256(passwordLogin);
    let url = urlHost + "/login/?";
    url += "usernameEmail=" + usernameEmail + "&";
    url += "password=" + hashedPassword;

    xhttp.open("GET", url);
    xhttp.send();
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

function validateUsername(username) {
    const re = /^[a-zA-Z0-9]+$/;
    return re.test(username.toLowerCase());
}

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    return  hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}


function displayLoginOrSignUp() {
    let url = new URL(window.location);
    let mode = url.searchParams.get("mode");
    if (mode === "signup") {
        showSignupForm()
        showSignupForm()
    } else if (mode=== "login") {
        showLoginForm()
    }
}

let userId = -1;

function generateNavBar() {
    let main = document.getElementById("mainNavContainer");
    let htmlText = "<div class='collapse navbar-collapse' id='navbarResponsive'> <ul class='navbar-nav ml-auto'>"

    htmlText += generateNavItem('gallery');

    htmlText += generateNavItem('about');
    htmlText += generateNavItem('contact');
    if(document.cookie === undefined || document.cookie.length === 0) {
        htmlText += generateNavItem('login');
    }
    if(!(document.cookie === undefined || document.cookie.length === 0)) {
        htmlText += generateNavItem('dashboard');
    }
    htmlText += "</ul> </div>";
    main.innerHTML += htmlText;
}

function generateNavItem(name) {
    let displayName = capitalizeFirstLetter(name);
    return "<li class='nav-item'><a class='nav-link js-scroll-trigger' style=\"cursor: pointer;\" onclick=\"nav('"+ name +"')\"> "+ displayName +"</a></li>";
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function logout() {
    document.cookie = "auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    nav("login")
}

function fullImage(i) {
    resetSliders();
    document.getElementById("btn-download-greyscale").style["display"] = 'none';
    let src = document.getElementById("image" + i).src;
    globalI = i;
    displayOn = true;
    if(document.getElementById("btn-download") !=null ){
        document.getElementById("btn-download").classList.toggle("downloaded", false);
    }
    if (document.getElementById("display-created-at") != null) {
        document.getElementById("display-created-at").style["display"] = "none";
        document.getElementById("cal-created").classList.toggle("far");
        document.getElementById("cal-created").style["color"] = 'black';
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                document.getElementById("full").src = xhttp.responseText;
                document.getElementById("full").srcBackup = xhttp.responseText;
                document.getElementById("full").style["display"] = 'initial';
                document.getElementById("opacity-overlay").style["display"] = 'initial';
                document.getElementById("opacity-overlay-screen").style["display"] = 'initial';
                document.body.style["overflow"] = 'hidden';
                if (document.getElementById("download-full") != null) {
                    document.getElementById("download-full").href = xhttp.responseText;
                }
                currLink = xhttp.responseText;
            } else if (xhttp.status === 404) {
                alert("Image Not Available");
            }
        }
    };

    let url = urlImage + "/display/?";
    url += "src=" + src

    xhttp.open("GET", url);
    xhttp.send();
}

function hideFull() {
    document.getElementById("opacity-overlay").style["display"] = 'none';
    document.getElementById("opacity-overlay-screen").style["display"] = 'none';
    document.body.style["overflow"] = 'auto';

    document.getElementById("btn1").style["display"] = 'initial';
    document.getElementById("btn2").style["display"] = 'initial';
    document.getElementById("btn-sort-likes").style["display"] = 'initial';
    document.getElementById("btn-sort-faves").style["display"] = 'initial';
    document.getElementById("btn-sort-date").style["display"] = 'initial';
}

function deleteImage() {
    let src = document.getElementById("full").src;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                nav("gallery");
                alert("Delete Successful")
            } else if (xhttp.status === 401) {
                alert("Error: Unable to Delete!");
            }
        }
    };
    let url = urlImage + "/delete/?";
    url += "src=" + src

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

function checkOnSignup() {
    if (document.getElementById('password').value ===
        document.getElementById('confirmPassword').value) {
        document.getElementById('message-match').style["color"] = "rgba(0,0,0,0) "
        document.getElementById('message').innerHTML = ' Passwords Do Not Match';
    } else {
        document.getElementById('message-match').style["color"] = "rgba(255,90,90,1) "
        document.getElementById('message-match').innerHTML = 'Passwords Do Not Match';
    }
}
function checkOnEmail() {
    if (validateEmail(document.getElementById('inputEmail').value) || document.getElementById('inputEmail').value ==="") {
        document.getElementById('message-match').style["color"] = "rgba(0,0,0,0) "
        document.getElementById('message').innerHTML = ' Email Not Valid';
    } else {
        document.getElementById('message-match').style["color"] = "rgba(255,90,90,1) "
        document.getElementById('message-match').innerHTML = 'Email Not Valid';
    }
}
// Script for animation


function removeAnimation() {
    let element = document.getElementById('gallery');
    element.classList.remove('has-animation');
    element.classList.remove('animate-in');
    element.classList.remove('animation-ltr');
}

//parent-node-2 is login
//parent-2 is inside



//parent-node is signup
// parent-one is inside
let showingLogin = false;

function showLoginForm() {
    if (showingLogin) {

        return
    }
    showingLogin = !showingLogin;
    document.getElementById('icon-display').style["display"] = "none";

    let parent = document.getElementById('parent-node-2');
    Array.from(parent.classList).find((element) => {
        if(element !== "slide-up") {
            parent.classList.add('slide-up')
        }else{
            document.getElementById('parent-one').classList.add('slide-up')
            parent.classList.remove('slide-up')
        }
    });
}

function showSignupForm() {
    if (!showingLogin) {
        return
    }
    showingLogin = !showingLogin;
    document.getElementById('icon-display').style["display"] = "initial";

    let parent = document.getElementById('parent-one');
    Array.from(document.getElementById('parent-one').classList).find((element) => {
        if(element !== "slide-up") {
            parent.classList.add('slide-up')
        }else{
            document.getElementById('parent-node-2').classList.add('slide-up')
            parent.classList.remove('slide-up')
        }
    });
}
//account Page JS

function check() {
    if (document.getElementById('newChangePassword').value ===
        document.getElementById('confirmNewChangePassword').value) {
        document.getElementById('message').style["color"] = "rgba(0,0,0,0) "
        // document.getElementById('message').innerHTML = ' Passwords Not Matching';
    } else {
        document.getElementById('message').style["color"] = "rgba(255,90,90,1) "
        document.getElementById('message').innerHTML = 'Passwords Do Not Match';
    }
}


function writeWelcome() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 401) {
                logout()
            } else if (xhttp.status === 200) {
                document.getElementById("user-placeholder").innerHTML = "Hello " + xhttp.responseText;
            }
        }
    };

    let url = urlHost;

    url += "/username/";

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

function writeJoined() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 401) {
                logout()
            } else if (xhttp.status === 200) {
                document.getElementById("joined-placeholder").innerHTML = "Joined on " + xhttp.responseText.split(" ")[0];
            }
        }
    };

    let url = urlHost;

    url += "/created/";

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

function writeCount() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 401) {
                logout()
            } else if (xhttp.status === 200) {
                document.getElementById("pic-count").innerHTML =  xhttp.responseText;
            }
        }
    };

    let url = urlImage;

    url += "/count/";

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

function writeInfo() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 401) {
                logout()
            } else if (xhttp.status === 200) {
                let username = xhttp.responseText.split(" ")[0].toLowerCase();
                let email = xhttp.responseText.split(" ")[1].toLowerCase();
                let firstName = xhttp.responseText.split(" ")[2].toLowerCase();
                let lastName = xhttp.responseText.split(" ")[3].toLowerCase();

                document.getElementById("username-display").innerHTML =  username;
                document.getElementById("email-display").innerHTML =  email;
                document.getElementById("first-name-display").innerHTML = capitalizeFirstLetter(firstName);
                document.getElementById("last-name-display").innerHTML =  capitalizeFirstLetter(lastName);

                let accountType = "user";
                if (xhttp.responseText.split(" ")[4] === "1") {
                    accountType = "admin"
                }
                document.getElementById("account-type-display").innerHTML =  accountType;
            }
        }
    };

    let url = urlHost;

    url += "/account/";

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

function writeLikesInfo() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 401) {
                logout();
            } else if (xhttp.status === 200) {
                let likesSent = xhttp.responseText.split(" ")[0].toLowerCase();
                let likesReceived = xhttp.responseText.split(" ")[1].toLowerCase();
                document.getElementById("like-count-total").innerHTML =  likesSent;
                document.getElementById("liked-count-total").innerHTML =  likesReceived;
            }
        }
    };

    let url = urlImage;

    url += "/likesInfo/";

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

function writeFavoritesInfo() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                console.log(xhttp.responseText)
                document.getElementById("favorite-count-total").innerHTML =  xhttp.responseText.split(" ")[0].toLowerCase();
            }
        }
    };

    let url = urlImage;

    url += "/writeTotalFav/";

    xhttp.open("GET", url);

    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );

    xhttp.send();
}

function openModal() {
    hideAccountButtons();

    document.getElementById('modal-class').classList.add("is-open");
}

function closeModal() {
    document.getElementById('modal-class').classList.remove("is-open");
    showAccountButtons();
}

function openModalPassword() {
    hideAccountButtons();

    document.getElementById('pmodal-class-password').classList.add("is-open");
}

function closeModalPassword() {
    document.getElementById('pmodal-class-password').classList.remove("is-open");
    showAccountButtons();
}

function openModalUpload() {
    hideAccountButtons();

    document.getElementById('umodal-class-upload').classList.add("is-open");
}

function closeModalUpload() {
    document.getElementById('umodal-class-upload').classList.remove("is-open");
    showAccountButtons();
}


function showAccountButtons() {
    document.getElementById('mainNav').style["visibility"] ="visible";
    document.getElementById('dashboard-head').style["visibility"]="visible";
    document.getElementById('dashboard-head-2').style["visibility"]="visible";
    // document.getElementById('container-card').style["display"]="initial";
    document.getElementById('account-card').style["display"]="flex";
    document.getElementById('upload-card').style["display"]="flex";
    document.getElementById('change-password-card').style["display"]="flex";
    document.getElementById('logout-card').style["display"]="flex";
}

function hideAccountButtons() {
    document.getElementById('logout-card').style["display"]="none";
    document.getElementById('change-password-card').style["display"]="none";
    document.getElementById('upload-card').style["display"]="none";
    document.getElementById('account-card').style["display"]="none";
    // document.getElementById('container-card').style["display"]="none";

    document.getElementById('dashboard-head').style["visibility"]="hidden";
    document.getElementById('dashboard-head-2').style["visibility"]="hidden";
    document.getElementById('mainNav').style["visibility"]="hidden";
}


function fileChange() {
    let fileName = document.getElementById("image-upload").value
    if (document.getElementById("wait-on-upload") != null) {
        document.getElementById("wait-on-upload").style["display"] = "block";
    }
    if(fileName.length === 0) {
        document.getElementById("filename").innerText = "Choose File";
        document.getElementById("instructions").style["display"] = "initial";
    } else {
        let filePath = fileName.split("\\");
        filePath = filePath[filePath.length - 1].split("/");
        document.getElementById("filename").innerText = filePath[filePath.length - 1];
        document.getElementById("instructions").style["display"] = "none";
    }
}

function upload() {
    if(document.cookie === undefined || document.cookie.length === 0) {
        nav("login")
        return
    }
    if (document.getElementById("wait-on-upload") != null) {
        document.getElementById("wait-on-upload").style["display"] = "block";

        // DO SOMETHING WITH A PROCESSING !
    }

    let formData = new FormData();
    let file = document.getElementById("image-upload").files[0]
    if(file === undefined) {
        alert("Please choose an image.")
        return
    }
    formData.append("pic", file);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                nav('dashboard');
            } else if (xhttp.status === 409){
                alert("failed to upload")
                nav('dashboard')
            }
        }
    };
    xhttp.open("POST", urlImage + "/upload/");
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send(formData);
}

let currLink = "";

async function sendComment() {
    if(document.cookie === undefined || document.cookie.length === 0) {
        logout();
        return
    }
    let comment = document.getElementById("comment-input").value;
    if(comment.length === 0) {
        return
    }
    let formData = new FormData();
    formData.append("link", "EXIST "+ currLink +" EXIST");
    formData.append("comment", "EXIST " + comment +" EXIST");
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                document.getElementById("comment-input").value ="";
                getComments();
            } else if (xhttp.status === 409){
                alert("failed to comment")
            }
        }
    };

    xhttp.open("POST", urlComment + "/send/");
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send(formData);
}
// gallery stuff


let showGlobal = true;
let sortLikes = false;
let sortFave = false;
let sortDate = false;


function checkToDisplay() {
    if (!(document.cookie === undefined || document.cookie.length === 0)){
        document.getElementById("display-login-or-signup").style["display"]="none";
        document.getElementById("display-buttons-or-login").style["display"]="flex";
    } else {
        document.getElementById("display-login-or-signup").style["display"]="flex";
        document.getElementById("display-buttons-or-login").style["display"]="none";

        document.getElementById('redirect-login').addEventListener('click', function(){
            nav('login', {"mode" : "login" });
        });
        document.getElementById('redirect-signup').addEventListener('click', function(){
            nav('login', {"mode" : "signup" });
        });
    }
}

function downloadAnimate() {
    let element = document.getElementById("btn-download");
    element.classList.toggle("downloaded");
}

function downloadAnimateGreyscale() {
    let element = document.getElementById("btn-download-greyscale");
    element.classList.toggle("downloaded");
}
function downloadAnimateGreyscale2() {
    let element = document.getElementById("btn-download-greyscale-2");
    element.classList.toggle("downloaded");
}
function downloadAnimateGreyscale3() {
    let element = document.getElementById("btn-download-greyscale-3");
    element.classList.toggle("downloaded");
}
function downloadAnimateGreyscale4() {
    let element = document.getElementById("btn-download-greyscale-4");
    element.classList.toggle("downloaded");
}


function showToggle() {
    if(document.cookie === undefined || document.cookie.length === 0) {
        return
    }
    document.getElementById("filter-bar").style["display"] = "initial";
}

function hidePersonalButtons() {
    if(document.getElementById("personal-buttons-on-image")!=null) {
        document.getElementById("personal-buttons-on-image").style["display"] = "none";
    }
}

function global() {
    document.getElementById("btn1").checked = true;
    document.getElementById("btn2").checked = false;
    document.getElementById("global-text").style["text-decoration"] ="underline";
    document.getElementById("personal-text").style["text-decoration"] ="none";

    document.getElementById("personal-buttons-on-image").style["display"] = "none";
    showGlobal = true;
    getImages(sortLikes, sortFave, sortDate);
}

function personal() {
    document.getElementById("btn1").checked = false;
    document.getElementById("btn2").checked = true;
    document.getElementById("personal-text").style["text-decoration"] ="underline";
    document.getElementById("global-text").style["text-decoration"] ="none";
    document.getElementById("personal-buttons-on-image").style["display"] = "flex";

    showGlobal = false;
    getImages(sortLikes, sortFave, sortDate);
}

function sortByLike() {
    if(document.getElementById("btn-sort-likes").checked) {
        document.getElementById("btn-sort-date").checked = false;
        sortLikes = true;
        sortDate = false;
    } else {
        sortLikes = false;
    }
    getImages(sortLikes, sortFave, sortDate);
}

function sortByFave() {
    sortFave = document.getElementById("btn-sort-faves").checked;
    getImages(sortLikes, sortFave, sortDate);
}

function sortByDate() {
    if(document.getElementById("btn-sort-date").checked) {
        document.getElementById("btn-sort-likes").checked = false;
        sortLikes = false;
        sortDate = true;
    } else {
        sortDate = false;
    }
    getImages(sortLikes, sortFave, sortDate);
}


function getImages(sLikes = false, sFaves = false, sDate = false) {
    let links = [];
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                links = xhttp.responseText.substring(1, xhttp.responseText.length - 2).split(" ");
                let galleryWrapper = document.getElementById("gallery");
                galleryWrapper.innerHtml =  '';
                while (galleryWrapper.firstChild) {
                    galleryWrapper.removeChild(galleryWrapper.lastChild);
                }
                if(links.length === 1 && links[0]==="" ) {
                    galleryWrapper.innerHTML = "        <div style=\"height: 32vh;\"></div>\n" +
                        "        <div style=\"text-align: center;\">No images are currently available. </div>\n" +
                        "        <div style=\"text-align: center;\"> Upload an image in the <span onclick=\"nav('dashboard')\" class=\"text-primary\" style=\"cursor: pointer; font-weight: bold;\">dashboard</span> to begin.</div>\n" +
                        "        <div style=\"height: 32vh;\"></div>"
                } else {
                    let galleryHTML = "";

                    if(sDate === false && sLikes === false) {
                        links= links.reverse();
                    }
                    if(sDate === true && sFaves === true) {
                        links = links.reverse();
                    }


                    for (let i in links) {
                        if (i % 3 === 0) {
                            galleryHTML += "<div class='row'>";
                        }
                        galleryHTML += "<div id=\"overlay-div" + i + "\" class='col-sm-4 col-md-4 col-lg-4 image-overlay' style='margin: 0; padding-left: 7.5px; padding-right: 7.5px; padding-top 15px; padding-bottom: 15px;' onclick='doThings(" + i + ")'  >"

                        galleryHTML += "<img src =\"" + links[i] + "\"  style='width: 100%;'  id =\"image" + i + "\" onclick='doThings(" + i + ")' />";
                        galleryHTML += "</div>"

                        if (i % 3 === 2) {
                            galleryHTML += "</div>"
                        }
                    }
                    galleryWrapper.innerHTML = galleryHTML;
                    for (let i in links.reverse()) {
                        writeLikes(i)
                    }
                }
            }
        }
    };
    let url = urlImage
    if(document.cookie === undefined || document.cookie.length === 0 || showGlobal) {
        url += "/list/?";
    } else {
        url += "/listUser/?";
    }
    url+= "sLikes=" + sLikes.toString() + "&sFaves="+ sFaves.toString() + "&sDate=" + sDate.toString()
    xhttp.open("GET", url);
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

function doThings(i) {
    fullImage(i);
    writeLikes(i);
    initialVisibility(i);
    initialFavorites(i);
    getComments();
}
function getComments() {
    if (document.cookie === undefined || document.cookie.length === 0) {
        return
    }
    let src = document.getElementById("image" + globalI).src;
    let comments = [];
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                if(document.getElementById("comment-list") === null) {
                    return
                }
                comments = JSON.parse(xhttp.responseText)
                console.log(comments)
                // comments = xhttp.responseText.substring(1,xhttp.responseText.length-2).split(" s*p*l*i*t ");
                let commentWrapper = document.getElementById("comment-list");
                commentWrapper.innerHtml =  '';
                while (commentWrapper.firstChild) {
                    commentWrapper.removeChild(commentWrapper.lastChild);
                }
                if(comments.length === 0) {
                    commentWrapper.innerHTML = " NO COMMENTS AVAILABLE"
                } else {
                    let commentHTML = "";
                    for (let i in comments) {
                        let commentID = comments[i][0];
                        let userID = comments[i][1];
                        let createdAt = comments[i][2];
                        let comment = comments[i][3];
                        let deletable = comments[i][4];

                        while (userID.length < 3) {
                            userID = "0" + userID;
                        }
                        commentHTML += "                        <li id=\"comment-li-" + commentID + "\"" + ">\n" +
                            "                            <div class=\"commenterImage\"> \n" +
                            userID +
                            "                                </div>\n" +
                            "                                <div class=\"commentText\">\n" +
                            "                                <p class=\"\">" + comment + "</p> <span class=\"date sub-text\"> on " + createdAt
                        if (deletable === "true") {
                            commentHTML += "<span style=\"position:relative; top:0px; margin-left: 110px; font-size: 7px !important; cursor: pointer;\" onclick=\"deleteComment(" + commentID + ")\">" +
                                "remove</span>"
                        }
                        commentHTML += "</span>\n" +
                            "                            </div>\n" +
                            "                            </li> "


                    }
                    commentWrapper.innerHTML = commentHTML;
                }
            }
        }
    };
    let url = urlComment
    url += "/listComments/?";

    url+= "src=" + src;
    xhttp.open("GET", url);
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}
function deleteComment(commentID){
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
        return
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                getComments()
            } else if (xhttp.status === 401) {
                alert("Error: Unable to Delete!");
            }
        }
    };

    let url = urlComment + "/delete/?";
    url += "commentID=" + commentID

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

let globalI = 0

function initialFavorites(i) {
    let src = document.getElementById("image" + i).src;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                let currVal = xhttp.responseText.split(" ")[0];
                if(document.getElementById("add-favorite") != null) {
                    /// triple equal not working here
                    if (currVal === "true") {
                        document.getElementById("add-favorite").classList.toggle("fas");
                        document.getElementById("add-favorite").style["color"] = "rgba(250,200,0,0.8)";
                    } else {
                        document.getElementById("add-favorite").classList.toggle("far");
                        document.getElementById("add-favorite").style["color"] = "black"
                    }
                }
            } else {
                alert("Error in initial Favorites");
            }
        }
    };

    let url = urlImage;

    url += "/writeFav/?";
    url += "src=" + src;

    xhttp.open("GET", url);
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}


function initialVisibility(i) {
    let src = document.getElementById("image" + i).src;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                let hideStatus = xhttp.responseText.split(" ")[0];
                if(document.getElementById("visibility") != null) {
                    /// triple equal not working here
                    if (hideStatus == 1) {
                        document.getElementById("visibility").classList.toggle("fa-eye-slash");
                        document.getElementById("visibility").style["color"] = "rgba(255,255,255,.5)"
                    } else if(hideStatus == 0) {
                        document.getElementById("visibility").classList.toggle("fa-eye");
                        document.getElementById("visibility").style["color"] = "rgba(255,255,255,1)"
                    }
                }

            } else {
                alert("Error in initial Visibility");
            }
        }
    };

    let url = urlImage;

    url += "/hideStatus/?";
    url += "src=" + src;

    xhttp.open("GET", url);
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}

function hideImage() {
    let src = document.getElementById("full").src;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                // nav("gallery");
                let currentHideStatus = xhttp.responseText[0];
                if(currentHideStatus === "0") {
                    document.getElementById("visibility").classList.toggle("fa-eye");
                    document.getElementById("visibility").style["color"] = "rgba(255,255,255,1)"
                } else if (currentHideStatus === "1") {
                    document.getElementById("visibility").classList.toggle("fa-eye-slash");
                    document.getElementById("visibility").style["color"] = "rgba(255,255,255,0.5)"
                }
            } else if (xhttp.status === 401) {
                alert("Error: Unauthorized Account!");
            } else if (xhttp.status === 412) {
                alert("Unexpected Error: Please Try Again!");
            }
        }
    };
    let url = urlImage + "/hide/?";
    url += "src=" + src;

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}


function likeImage() {
    let src = document.getElementById("full").src;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                //update likes, update like icon
                let totalLikes = xhttp.responseText.split(" ")[1];
                document.getElementById("like-count").innerHTML = " " + totalLikes;
                document.getElementById("overlay-div" + globalI).setAttribute('data-content', "♥ " + totalLikes);
                let toggleVal = xhttp.responseText.split(" ")[0]
                if(toggleVal === "true") {
                    document.getElementById("like-heart").classList.toggle("fas");
                    document.getElementById("like-heart").style["color"] = "rgba(255,0,0,0.8)";
                } else {
                    document.getElementById("like-heart").classList.toggle("far");
                    document.getElementById("like-heart").style["color"] = "black";
                }
            } else if (xhttp.status === 401) {
                alert("Error: Unauthorized Account!");
            }
        }
    };
    let url = urlImage + "/like/?";
    url += "src=" + src;

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );

    xhttp.send();
}


function favoriteImage() {
    let src = document.getElementById("full").src;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                let toggleVal = xhttp.responseText.split(" ")[0];
                if(toggleVal === "true") {
                    document.getElementById("add-favorite").classList.toggle("fas");
                    document.getElementById("add-favorite").style["color"] = "rgba(250,200,0,0.8)";
                } else {
                    document.getElementById("add-favorite").classList.toggle("far");
                    document.getElementById("add-favorite").style["color"] = "black";
                }
            } else if (xhttp.status === 401) {
                alert("Error: Unauthorized Account!");
            }
        }
    };
    let url = urlImage + "/favorite/?";
    url += "src=" + src;

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );

    xhttp.send();
}

function writeLikes(i) {
    let src = document.getElementById("image" + i).src;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                let totalLikes = xhttp.responseText.split(" ")[1];
                let likeElement = document.getElementById("like-count");
                if(likeElement != null) {
                    likeElement.innerHTML = " " + totalLikes;
                }
                if (document.getElementById("overlay-div"+i) != null) {
                    document.getElementById("overlay-div" + i).setAttribute('data-content', "♥ " + totalLikes);
                }
                let initialVal = xhttp.responseText.split(" ")[0]
                if(document.getElementById("like-heart") != null) {
                    if (initialVal === "true") {
                        document.getElementById("like-heart").classList.toggle("fas");
                        document.getElementById("like-heart").style["color"] = "rgba(255,0,0,0.8)";
                    } else {
                        document.getElementById("like-heart").classList.toggle("far");
                        document.getElementById("like-heart").style["color"] = "black";
                    }
                }

            } else {
                alert("Write Likes Failed");
            }
        }
    };

    let url = urlImage;

    url += "/likesCount/?";
    url += "src=" + src;

    xhttp.open("GET", url);
    xhttp.setRequestHeader('Authorization','Bearer ' + document.cookie.split("=")[1] );
    xhttp.send();
}


function addLikesOverlay(i) {
    document.getElementById("image-overlay" + i ).style["display"] = "block";
}
function removeLikesOverlay(i) {
    document.getElementById("image-overlay" + i ).style["display"] = "none";
}

let displayOn = true;
function displayCreatedAt() {
    let src = document.getElementById("full").srcBackup;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                document.getElementById("display-created-at").innerHTML =  xhttp.responseText.split(" ")[0];
                if(displayOn) {
                    document.getElementById("display-created-at").style["display"] = 'flex';
                    document.getElementById("cal-created").classList.toggle("fas");
                    document.getElementById("cal-created").style["color"] = 'rgba(0,150,190,0.8)';
                    displayOn = !displayOn;
                } else {
                    document.getElementById("display-created-at").style["display"] = 'none';
                    document.getElementById("cal-created").classList.toggle("far");
                    document.getElementById("cal-created").style["color"] = 'black';

                    displayOn = !displayOn;
                }
            } else {
                console.log("Error");
            }
        }
    };

    let url = urlImage;

    url += "/date/?";
    url += "src=" + src;

    xhttp.open("GET", url);
    if (document.cookie === undefined || document.cookie.length === 0) {
        logout();
    }
    xhttp.send();
}

function sendEnterComment() {
    if(event.keyCode == 13) {
        sendComment();
        return event.keyCode != 13;
    } else {
        return event.keyCode != 13;
    }
    return event.keyCode != 13;
}


function liveGrey(r, g, b) {
    if (document.cookie === undefined || document.cookie.length === 0) {
         logout();
         return
    }
    let src = document.getElementById("full").srcBackup;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                //DO something while it loads
                let response = xhttp.response;
                document.getElementById("full").src = 'data:image/jpeg;base64,' + response;
                document.getElementById("download-greyscale-1").href = 'data:image/jpeg;base64,' + response;
                document.getElementById("download-greyscale-1").download = globalI+"Greyscale-1.jpg";
                document.getElementById("btn-download-greyscale").style["display"] = 'block';
            } else {
                console.log("Error");
            }
        }
    };

    let url = urlImage;

    url += "/grey/?";
    url += "src=" + src+ "&r=" + r +"&b=" + b+ "&g=" + g;

    xhttp.open("GET", url);
    xhttp.send();
}
