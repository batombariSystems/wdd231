const spotlightContainer = document.querySelector("#spotlight-container");

// Fetch chamber members from the JSON file
async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load chamber members.");
        }

        const members = await response.json();

        // Select only Gold and Silver members
        const eligibleMembers = members.filter((member) => {
            const membership = String(member.membership).toLowerCase();

            return (
                membership === "3" ||
                membership === "2" ||
                membership === "gold" ||
                membership === "silver"
            );
        });

        // Check if eligible members exist
        if (eligibleMembers.length === 0) {
            spotlightContainer.textContent =
                "No Gold or Silver members are available.";
            return;
        }

        // Randomly shuffle eligible members
        const shuffledMembers = [...eligibleMembers];

        for (let i = shuffledMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffledMembers[i], shuffledMembers[j]] =
                [shuffledMembers[j], shuffledMembers[i]];
        }

        // Randomly choose two or three members
        const randomCount = Math.random() < 0.5 ? 2 : 3;

        const selectedMembers = shuffledMembers.slice(
            0,
            randomCount
        );

        // Display selected members
        displaySpotlights(selectedMembers);

    } catch (error) {
        spotlightContainer.textContent =
            "Member spotlights could not be loaded.";

        console.error("Spotlight error:", error);
    }
}

// Display spotlight advertisements
function displaySpotlights(members) {
    spotlightContainer.innerHTML = "";

    members.forEach((member) => {

        // Create spotlight card
        const card = document.createElement("article");
        card.classList.add("spotlight-card");

        // Company logo
        const logo = document.createElement("img");
        logo.src = images/${member.image};
        logo.alt = ${member.name} company logo;
        logo.loading = "lazy";

        // Company name
        const name = document.createElement("h3");
        name.textContent = member.name;

        // Membership level
        const membership = String(member.membership).toLowerCase();

        const level = document.createElement("p");
        level.classList.add("membership-level");

        level.textContent =
            membership === "3" || membership === "gold"
                ? "Gold Member"
                : "Silver Member";

        // Phone number
        const phone = document.createElement("p");
        phone.textContent = Phone: ${member.phone};

        // Address
        const address = document.createElement("p");
        address.textContent = Address: ${member.address};

        // Website
        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

        // Add information to card
        card.append(
            logo,
            name,
            level,
            phone,
            address,
            website
        );

        // Add card to spotlight container
        spotlightContainer.appendChild(card);
    });
}

// Load spotlights when the page opens
getSpotlights();