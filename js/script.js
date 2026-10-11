/* =========================================
COLLEGE PLACEMENT PORTAL
MAIN JAVASCRIPT
========================================= */

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.querySelector(".nav-links");

if (menuToggle) {

```
menuToggle.addEventListener("click", function () {

    navLinks.classList.toggle("mobile-active");

});
```

}
