// ========================================
// SELECT HTML ELEMENTS
// ========================================
const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

// ========================================
// GRID AND LIST VIEW
// ========================================
function setView(view) {
    if (!membersContainer || !gridButton || !listButton) return;

    const isGrid = view === "grid";

    membersContainer.classList.toggle("grid-view", isGrid);
    membersContainer.classList.toggle("list-view", !isGrid);

    gridButton.setAttribute("aria-pressed", String(isGrid));
    listButton.setAttribute("aria-pressed", String(!isGrid));
}

gridButton?.addEventListener("click", () => {
    setView("grid");
});

listButton?.addEventListener("click", () => {
    setView("list");
});

// ========================================
// LOAD BUSINESS MEMBERS FROM JSON
// ========================================
async function getMembers() {
    if (!membersContainer) return;

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const members = await response.json();

        if (!Array.isArray(members) || members.length === 0) {
            membersContainer.innerHTML =
                "<p>No business members are currently available.</p>";
            return;
        }

        displayMembers(members);

    } catch (error) {
        membersContainer.innerHTML =
            "<p>Business information could not be loaded. Please try again later.</p>";

        console.error("Error loading members:", error);
    }
}

// ========================================
// DISPLAY BUSINESS MEMBERS
// ========================================
function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("article");
        card.className = "member-card";

        // Business image
        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} business`;
        image.loading = "lazy";
        image.onerror = () => {
            image.alt = "Business image unavailable";
            image.style.display = "none";
        };

        // Business name
        const name = document.createElement("h3");
        name.textContent = member.name;

        // Business category
        const category = document.createElement("p");
        category.className = "member-category";
        category.textContent = member.category;

        // Business address
        const address = document.createElement("p");
        address.textContent = `Address: ${member.address}`;

        // Business phone
        const phone = document.createElement("p");
        phone.textContent = `Phone: ${member.phone}`;

        // Membership level
        const level = document.createElement("p");
        level.className = "membership-level";

        const membership = Number(member.membership);

        level.textContent =
            membership === 3 ? "Gold Member" :
            membership === 2 ? "Silver Member" :
            "Bronze Member";

        // Business description
        const description = document.createElement("p");
        description.className = "member-description";
        description.textContent = member.description;

        // Business website
        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

        // Add content to card
        card.append(
            image,
            name,
            category,
            address,
            phone,
            level,
            description,
            website
        );

        membersContainer.appendChild(card);
    });
}

// ========================================
// MOBILE NAVIGATION
// ========================================
menuButton?.addEventListener("click", () => {
    navigation?.classList.toggle("show");

    const isOpen = navigation?.classList.contains("show") ?? false;

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
});

navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navigation.classList.remove("show");

        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.textContent = "☰";
        }
    });
});

// Close mobile navigation with Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation?.classList.contains("show")) {
        navigation.classList.remove("show");

        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.textContent = "☰";
            menuButton.focus();
        }
    }
});

// ========================================
// FOOTER DATES
// ========================================
const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastmodified");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}

// ========================================
// INITIALIZE DIRECTORY
// ========================================
setView("grid");
getMembers();