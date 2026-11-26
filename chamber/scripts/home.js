// ========================================
// MOBILE NAVIGATION
// ========================================

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("show");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuButton.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("show");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.textContent = "☰";
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            navigation.classList.remove("show");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.textContent = "☰";
        }
    });
}


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
// WEATHER INFORMATION
// ========================================

// Replace this with your newly generated OpenWeatherMap API key.
const apiKey = "a2cb095b6b024d8f5d2d0715d2116f41";

const city = "Abuja";
const country = "NG";

const currentWeatherContainer = document.querySelector("#weather-current");
const forecastContainer = document.querySelector("#weather-forecast");

const weatherBaseURL = "https://api.openweathermap.org/data/2.5";


// Display current weather
async function getCurrentWeather() {
    if (!currentWeatherContainer) return;

    if (!apiKey || apiKey === "PASTE_YOUR_NEW_API_KEY_HERE") {
        currentWeatherContainer.innerHTML =
            "<p>Weather information is temporarily unavailable. Please configure the weather API key.</p>";
        return;
    }

    const url =
        `${weatherBaseURL}/weather?q=${city},${country}` +
        `&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather request failed: ${response.status}`);
        }

        const data = await response.json();

        const temperature = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        currentWeatherContainer.innerHTML = `
            <div class="current-weather">
                <img src="${iconURL}" alt="${description}" width="100" height="100">
                <div>
                    <h3>${city}, Nigeria</h3>
                    <p class="temperature">${temperature}&deg;C</p>
                    <p>${description}</p>
                    <p>Feels like: ${feelsLike}&deg;C</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Current weather error:", error);
        currentWeatherContainer.innerHTML =
            "<p>Unable to load current weather. Please try again later.</p>";
    }
}


// Display a three-day forecast
async function getWeatherForecast() {
    if (!forecastContainer) return;

    if (!apiKey || apiKey === "PASTE_YOUR_NEW_API_KEY_HERE") {
        forecastContainer.innerHTML =
            "<p>Forecast information is temporarily unavailable.</p>";
        return;
    }

    const url =
        `${weatherBaseURL}/forecast?q=${city},${country}` +
        `&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Forecast request failed: ${response.status}`);
        }

        const data = await response.json();

        // Use Abuja's local date when grouping forecast entries.
        const abujaDate = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Africa/Lagos",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });

        const today = abujaDate.format(new Date());
        const dailyForecasts = new Map();

        data.list.forEach((item) => {
            const date = abujaDate.format(new Date(item.dt * 1000));

            // Skip today's forecast and keep one forecast per future day.
            if (date !== today && !dailyForecasts.has(date)) {
                dailyForecasts.set(date, item);
            }
        });

        const forecastDays = Array.from(dailyForecasts.entries())
            .slice(0, 3);

        if (forecastDays.length === 0) {
            throw new Error("No future forecast data was returned.");
        }

        forecastContainer.innerHTML = "";

        forecastDays.forEach(([date, item]) => {
            const temperature = Math.round(item.main.temp);
            const description = item.weather[0].description;
            const icon = item.weather[0].icon;
            const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString(
                "en-GB",
                {
                    timeZone: "Africa/Lagos",
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                }
            );

            const card = document.createElement("article");
            card.classList.add("forecast-card");

            card.innerHTML = `
                <h4>${formattedDate}</h4>
                <img src="${iconURL}" alt="${description}" width="80" height="80">
                <p class="temperature">${temperature}&deg;C</p>
                <p>${description}</p>
            `;

            forecastContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Forecast error:", error);
        forecastContainer.innerHTML =
            "<p>Unable to load the three-day forecast. Please try again later.</p>";
    }
}


// ========================================
// BUSINESS SPOTLIGHTS
// ========================================

async function getBusinessSpotlights() {
    const spotlightContainer = document.querySelector("#spotlight-container");

    if (!spotlightContainer) return;

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`Members data request failed: ${response.status}`);
        }

        const members = await response.json();

        if (!Array.isArray(members)) {
            throw new Error("The members.json file must contain an array.");
        }

        // Membership 2 = Silver; Membership 3 = Gold.
        const eligibleMembers = members.filter((member) => {
            const level = Number(member.membership);
            return level === 2 || level === 3;
        });

        if (eligibleMembers.length === 0) {
            spotlightContainer.innerHTML =
                "<p>No Gold or Silver member businesses are available at the moment.</p>";
            return;
        }

        // Shuffle the eligible members.
        const shuffledMembers = [...eligibleMembers];

        for (let i = shuffledMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledMembers[i], shuffledMembers[j]] =
                [shuffledMembers[j], shuffledMembers[i]];
        }

        // Display up to three random businesses.
        const selectedMembers = shuffledMembers.slice(0, 3);

        spotlightContainer.innerHTML = "";

        selectedMembers.forEach((member) => {
            const card = document.createElement("article");
            card.classList.add("spotlight-card");

            const image = document.createElement("img");
            image.src = `images/${member.image}`;
            image.alt = `${member.name} business logo`;
            image.loading = "lazy";
            image.width = 180;
            image.height = 120;

            image.addEventListener("error", () => {
                image.alt = `${member.name} image unavailable`;
                image.hidden = true;
            });

            const name = document.createElement("h3");
            name.textContent = member.name;

            const category = document.createElement("p");
            category.textContent = member.category || "Business Member";

            const description = document.createElement("p");
            description.textContent = member.description || "";

            const phone = document.createElement("p");
            phone.textContent = `Phone: ${member.phone || "Not provided"}`;

            const address = document.createElement("p");
            address.textContent = `Address: ${member.address || "Not provided"}`;

            const membership = document.createElement("p");
            membership.textContent =
                Number(member.membership) === 3
                    ? "Gold Member"
                    : "Silver Member";

            card.append(
                image,
                name,
                category,
                description,
                phone,
                address,
                membership
            );

            if (member.website) {
                const website = document.createElement("a");
                website.href = member.website;
                website.textContent = "Visit Website";
                website.target = "_blank";
                website.rel = "noopener noreferrer";
                card.appendChild(website);
            }

            spotlightContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Business spotlight error:", error);
        spotlightContainer.innerHTML =
            "<p>Business spotlights are currently unavailable. Please try again later.</p>";
    }
}


// ========================================
// RUN HOMEPAGE FUNCTIONS
// ========================================

getCurrentWeather();
getWeatherForecast();
getBusinessSpotlights();