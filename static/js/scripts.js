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


const nav = (page) => window.location.replace(page === '' ? '/' : '/' + page + '.html');

let urlHost = "http://localhost:8081";

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
                alert(xhttp.responseText);
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
                alert(xhttp.responseText);
            } else if (xhttp.status === 401) {
                alert(xhttp.responseText);
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

function displayLogin() {
    document.getElementById("login-on").style["display"] = "initial";
    document.getElementById("signup-on").style["display"] = "none";
    document.getElementById("login-button").style["font-weight"] = "bold";
    document.getElementById("login-button").style["color"] = "#fff";
    document.getElementById("signup-button").style["font-weight"] = "normal";
    document.getElementById("signup-button").style["color"] = "rgba(255, 255, 255, 0.5)";

}

function displaySignUp() {
    document.getElementById("signup-on").style["display"] = "initial";
    document.getElementById("login-on").style["display"] = "none";
    document.getElementById("signup-button").style["font-weight"] = "bold";
    document.getElementById("signup-button").style["color"] = "#fff";
    document.getElementById("login-button").style["font-weight"] = "normal";
    document.getElementById("login-button").style["color"] = "rgba(255, 255, 255, 0.5)";
}