
// ========================================
// MOBILE NAVIGATION
// ========================================

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

menuButton.addEventListener("click", () => {
    const isExpanded =
        menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", !isExpanded);

    menuButton.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation menu" : "Close navigation menu"
    );

    navigation.classList.toggle("show");
});


// ========================================
// FOOTER DATES
// ========================================

const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastmodified");

currentYear.textContent = new Date().getFullYear();

lastModified.textContent = document.lastModified;


// ========================================
// OPENWEATHERMAP API
// ========================================

// Replace this with your actual OpenWeatherMap API key.
const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";

const city = "Abuja";
const country = "NG";

const currentWeatherURL =
    `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apiKey}&units=metric`;


// Get current weather
async function getCurrentWeather() {

    const weatherContainer =
        document.querySelector("#weather-current");

    try {

        const response = await fetch(currentWeatherURL);

        if (!response.ok) {
            throw new Error("Unable to retrieve current weather.");
        }

        const data = await response.json();

        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;

        const icon = data.weather[0].icon;

        weatherContainer.innerHTML = `
            <div class="current-weather">

                <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="${description}"
                    width="80"
                    height="80">

                <div>
                    <p class="temperature">${temperature}°C</p>

                    <p class="weather-description">
                        ${description}
                    </p>

                    <p>Abuja, Nigeria</p>
                </div>

            </div>
        `;

    } catch (error) {

        console.error("Current weather error:", error);

        weatherContainer.textContent =
            "Weather information is currently unavailable.";

    }

}


// Get three-day weather forecast
async function getWeatherForecast() {

    const forecastContainer =
        document.querySelector("#weather-forecast");

    try {

        const response = await fetch(forecastURL);

        if (!response.ok) {
            throw new Error("Unable to retrieve weather forecast.");
        }

        const data = await response.json();

        // Abuja uses UTC +1.
        const timezoneOffset = data.city.timezone;

        const dailyForecasts = {};

        data.list.forEach(item => {

            const localDate = new Date(
                (item.dt + timezoneOffset) * 1000
            );

            const dateKey = localDate.toISOString().slice(0, 10);

            const hour = localDate.getUTCHours();

            // Select the forecast closest to midday.
            if (!dailyForecasts[dateKey] ||
                Math.abs(hour - 12) <
                Math.abs(dailyForecasts[dateKey].hour - 12)) {

                dailyForecasts[dateKey] = {
                    item: item,
                    hour: hour
                };

            }

        });

        // Get the next three calendar days.
        const today = new Date(
            Date.now() + timezoneOffset * 1000
        ).toISOString().slice(0, 10);

        const forecastDates = Object.keys(dailyForecasts)
            .filter(date => date > today)
            .sort()
            .slice(0, 3);

        if (forecastDates.length < 3) {
            throw new Error("Three forecast days are not available.");
        }

        forecastContainer.innerHTML = "";

        forecastDates.forEach(date => {

            const forecast = dailyForecasts[date].item;

            const temperature =
                Math.round(forecast.main.temp);

            const description =
                forecast.weather[0].description;

            const icon = forecast.weather[0].icon;

            const displayDate = new Date(
                `${date}T12:00:00Z`
            );

            const dayName = displayDate.toLocaleDateString(
                "en-GB",
                {
                    weekday: "long",
                    timeZone: "UTC"
                }
            );

            const card = document.createElement("div");

            card.classList.add("forecast-card");

            card.innerHTML = `
                <h4>${dayName}</h4>

                <img
                    src="https://openweathermap.org/img/wn/${icon}.png"
                    alt="${description}"
                    width="50"
                    height="50">

                <p class="forecast-temperature">
                    ${temperature}°C
                </p>

                <p>${description}</p>
            `;

            forecastContainer.appendChild(card);

        });

    } catch (error) {

        console.error("Forecast error:", error);

        forecastContainer.textContent =
            "Three-day forecast is currently unavailable.";

    }

}


// Load weather information
getCurrentWeather();
getWeatherForecast();


// ========================================
// BUSINESS SPOTLIGHTS
// ========================================

// Assumes members.json is stored in the data folder.
const membersURL = "data/members.json";

async function getBusinessSpotlights() {

    const spotlightContainer =
        document.querySelector("#spotlight-container");

    try {

        const response = await fetch(membersURL);

        if (!response.ok) {
            throw new Error("Unable to load business members.");
        }

        const members = await response.json();

        // Select only Gold (3) and Silver (2) members.
        const qualifiedMembers = members.filter(member =>
            member.membership === 2 ||
            member.membership === 3
        );

        // Randomly shuffle the qualified members.
        const shuffledMembers = qualifiedMembers.sort(
            () => Math.random() - 0.5
        );

        // Select three members.
        const selectedMembers =
            shuffledMembers.slice(0, 3);

        spotlightContainer.innerHTML = "";

        selectedMembers.forEach(member => {

            const membershipLevel =
                member.membership === 3 ? "Gold" : "Silver";

            const card = document.createElement("article");

            card.classList.add("spotlight-card");

            // Create elements safely using textContent.
            const logo = document.createElement("img");

            logo.src = `images/${member.image}`;
            logo.alt = `${member.name} company logo`;
            logo.loading = "lazy";

            const name = document.createElement("h3");
            name.textContent = member.name;

            const category = document.createElement("p");
            category.textContent = member.category;

            const phone = document.createElement("p");
            phone.textContent = `Phone: ${member.phone}`;

            const address = document.createElement("p");
            address.textContent = `Address: ${member.address}`;

            const membership = document.createElement("p");

            membership.classList.add("membership-level");
            membership.textContent =
                `${membershipLevel} Member`;

            const website = document.createElement("a");

            website.href = member.website;
            website.textContent = "Visit Website";
            website.target = "_blank";
            website.rel = "noopener noreferrer";

            card.append(
                logo,
                name,
                category,
                phone,
                address,
                membership,
                website
            );

            spotlightContainer.appendChild(card);

        });

        if (selectedMembers.length === 0) {
            spotlightContainer.textContent =
                "No Gold or Silver members are available.";
        }

    } catch (error) {

        console.error("Business spotlight error:", error);

        spotlightContainer.textContent =
            "Business spotlights are currently unavailable.";

    }

}


// Load business spotlights
getBusinessSpotlights();
const apiKey = "a2cb095b6b024d8f5d2d0715d2116f41";