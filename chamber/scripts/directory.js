const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

// Load members from JSON
async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load members.");
        }

        const members = await response.json();
        displayMembers(members);

    } catch (error) {
        membersContainer.innerHTML =
            "<p>Business information could not be loaded.</p>";
        console.error(error);
    }
}

// Display business cards
function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("article");
        card.classList.add("member-card");

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} business`;
        image.loading = "lazy";

        const name = document.createElement("h3");
        name.textContent = member.name;

        const category = document.createElement("p");
        category.textContent = member.category;

        const address = document.createElement("p");
        address.textContent = `Address: ${member.address}`;

        const phone = document.createElement("p");
        phone.textContent = `Phone: ${member.phone}`;

        const level = document.createElement("p");
        level.textContent =
            member.membership === 3 ? "Gold Member" :
            member.membership === 2 ? "Silver Member" :
            "Member";

        const description = document.createElement("p");
        description.textContent = member.description;

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

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

// Grid view
gridButton.addEventListener("click", () => {
    membersContainer.classList.add("grid-view");
    membersContainer.classList.remove("list-view");
});

// List view
listButton.addEventListener("click", () => {
    membersContainer.classList.add("list-view");
    membersContainer.classList.remove("grid-view");
});

// Mobile navigation
menuButton.addEventListener("click", () => {
    navigation.classList.toggle("show");
    const isOpen = navigation.classList.contains("show");
    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

// Footer year
document.querySelector("#currentyear").textContent =
    new Date().getFullYear();

// Last modified date
document.querySelector("#lastmodified").textContent =
    document.lastModified;

// Start
getMembers();

