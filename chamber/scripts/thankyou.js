const params = new URLSearchParams(window.location.search);

const detailsContainer = document.querySelector("#application-details");

const fields = [
    ["First Name", "firstName"],
    ["Last Name", "lastName"],
    ["Email Address", "email"],
    ["Mobile Phone Number", "phone"],
    ["Business/Organization Name", "organization"],
    ["Application Date", "timestamp"]
];

if (detailsContainer) {
    detailsContainer.innerHTML = "";

    fields.forEach(([label, key]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;
        paragraph.appendChild(strong);

        let value = params.get(key) || "Not provided";

        if (key === "timestamp" && value !== "Not provided") {
            const date = new Date(value);

            if (!isNaN(date.getTime())) {
                value = date.toLocaleString();
            }
        }

        paragraph.appendChild(document.createTextNode(value));
        detailsContainer.appendChild(paragraph);
    });
}

