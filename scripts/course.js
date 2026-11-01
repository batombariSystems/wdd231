// Course information array

const courses = [

    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: false
    },

    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: false
    },

    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 3,
        completed: false
    },

    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        completed: false
    },

    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: false
    },

    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        completed: false
    }

];


// Select HTML elements

const courseList = document.querySelector("#courseList");

const creditTotal = document.querySelector("#creditTotal");

const filterButtons = document.querySelectorAll(".filter-button");


// Function to display courses

function displayCourses(filter = "ALL") {

    let filteredCourses;

    // Display all courses

    if (filter === "ALL") {

        filteredCourses = courses;

    }

    // Display selected subject courses

    else {

        filteredCourses = courses.filter(
            course => course.subject === filter
        );

    }


    // Clear previous courses

    courseList.innerHTML = "";


    // Display each course

    filteredCourses.forEach(course => {

        const card = document.createElement("div");

        card.classList.add("course-card");

        // Mark completed courses

        if (course.completed) {

            card.classList.add("completed");

        }

        card.innerHTML = `
            <span>${course.subject} ${course.number}</span>

            <small>
                ${course.title} -
                ${course.credits} Credits

                ${course.completed ? " - Completed" : ""}
            </small>
        `;

        courseList.appendChild(card);

    });


    // Calculate total credits using reduce()

    const totalCredits = filteredCourses.reduce(
        (total, course) => total + course.credits,
        0
    );

    // Display total credits

    creditTotal.textContent = totalCredits;

}


// Add click events to filter buttons

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        const selectedFilter = button.dataset.filter;

        // Update selected button appearance

        filterButtons.forEach(btn => {

            btn.classList.remove("selected");

            btn.setAttribute("aria-pressed", "false");

        });

        button.classList.add("selected");

        button.setAttribute("aria-pressed", "true");


        // Display filtered courses

        displayCourses(selectedFilter);

    });

});


// Display all courses when page loads

displayCourses();

