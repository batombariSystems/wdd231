const menuButton = document.querySelector("#menuToggle");
const navigation = document.querySelector("#primaryNav");

if (menuButton && navigation) {

    menuButton.addEventListener("click", function () {

        const isOpen = navigation.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", isOpen);

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuButton.textContent = isOpen ? "✕" : "☰";

    });

}

