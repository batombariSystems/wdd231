
const spotlightContainer = document.querySelector("#spotlight-container");

// Convert membership numbers to membership names
function getMembershipLevel(membership) {
    const level = Number(membership);

    if (level === 3) {
        return "Gold Member";
    } else if (level === 2) {
        return "Silver Member";
    }

    return "Member";
}

// Shuffle the members randomly
function shuffleMembers(members) {
    const shuffled = [...members];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

// Display selected business members
function displaySpotlights(members) {
    spotlightContainer.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("article");
        card.classList.add("spotlight-card");

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} logo`;
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
        level.textContent = getMembershipLevel(member.membership);

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
            website
        );

        spotlightContainer.appendChild(card);
    });
}

// Fetch and select Gold and Silver members
async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load business members.");
        }

        const members = await response.json();

        const qualifiedMembers = members.filter((member) => {
            const membership = Number(member.membership);

            return membership === 2 || membership === 3;
        });

        const selectedMembers = shuffleMembers(qualifiedMembers).slice(0, 3);

        displaySpotlights(selectedMembers);

    } catch (error) {
        spotlightContainer.textContent =
            "Business spotlights could not be loaded. Please try again later.";

        console.error("Error loading spotlights:", error);
    }
}

// Initialize spotlights
getSpotlights();
