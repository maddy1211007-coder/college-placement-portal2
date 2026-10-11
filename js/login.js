document.addEventListener("DOMContentLoaded", function () {

```
const studentBtn = document.getElementById("studentBtn");
const professorBtn = document.getElementById("professorBtn");

const userIdLabel = document.getElementById("userIdLabel");
const userIdInput = document.getElementById("userId");

const loginButtonText =
    document.getElementById("loginButtonText");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginForm =
    document.getElementById("loginForm");


// =====================================
// STUDENT
// =====================================

studentBtn.onclick = function () {

    studentBtn.classList.add("active");
    professorBtn.classList.remove("active");

    userIdLabel.innerText = "Register Number";

    userIdInput.placeholder =
        "Enter your register number";

    loginButtonText.innerText =
        "Login as Student";
};


// =====================================
// PROFESSOR
// =====================================

professorBtn.onclick = function () {

    professorBtn.classList.add("active");
    studentBtn.classList.remove("active");

    userIdLabel.innerText = "Faculty ID";

    userIdInput.placeholder =
        "Enter your faculty ID";

    loginButtonText.innerText =
        "Login as Professor";
};


// =====================================
// SHOW / HIDE PASSWORD
// =====================================

togglePassword.onclick = function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerText = "Hide";

    } else {

        passwordInput.type = "password";

        togglePassword.innerText = "Show";
    }
};


// =====================================
// LOGIN
// =====================================

loginForm.onsubmit = function (event) {

    event.preventDefault();


    // Check which portal is active

    if (professorBtn.classList.contains("active")) {

        window.location.href =
            "professor-dashboard.html";

    } else {

        window.location.href =
            "student-dashboard.html";
    }

};
```

});
