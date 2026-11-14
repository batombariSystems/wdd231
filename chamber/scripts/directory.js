/ Select HTML elements
const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

// Set the default directory view
function setView(view) {
    const isGrid = view === "grid";

    membersContainer.classList.toggle("grid-view", isGrid);
    membersContainer.classList.toggle("list-view", !isGrid);

    gridButton.setAttribute("aria-pressed", String(isGrid));
    listButton.setAttribute("aria-pressed", String(!isGrid));
}

// Grid view button
gridButton.addEventListener("click", () => {
    setView("grid");
});

// List view button
listButton.addEventListener("click", () => {
    setView("list");
});

// Load business members from JSON
async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load business members.");
        }

        const members = await response.json();

        displayMembers(members);

    } catch (error) {
        membersContainer.innerHTML =
            "<p>Business information could not be loaded. Please try again later.</p>";

        console.error("Error loading members:", error);
    }
}

// Display business members
function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach((member) => {

        const card = document.createElement("article");
        card.classList.add("member-card");

        // Business image
        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} business`;
        image.loading = "lazy";

        // Business name
        const name = document.createElement("h3");
        name.textContent = member.name;

        // Business category
        const category = document.createElement("p");
        category.textContent = member.category;

        // Business address
        const address = document.createElement("p");
        address.textContent = `Address: ${member.address}`;

        // Business phone
        const phone = document.createElement("p");
        phone.textContent = `Phone: ${member.phone}`;

        // Membership level
        const level = document.createElement("p");
        const membership = Number(member.membership);

        level.textContent =
            membership === 3 ? "Gold Member" :
            membership === 2 ? "Silver Member" :
            "Member";

        // Business description
        const description = document.createElement("p");
        description.textContent = member.description;

        // Business website
        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

        // Add elements to card
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

// Mobile navigation
menuButton.addEventListener("click", () => {

    navigation.classList.toggle("show");

    const isOpen = navigation.classList.contains("show");

    menuButton.setAttribute("aria-expanded", String(isOpen));

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

// Footer copyright year
document.querySelector("#currentyear").textContent =
    new Date().getFullYear();

// Footer last modified date
document.querySelector("#lastmodified").textContent =
    document.lastModified;

// Initialize directory
setView("grid");
getMembers();

