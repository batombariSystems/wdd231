/* Set the timestamp when the application page loads */
const timestampField = document.querySelector("#timestamp");

if (timestampField) {
    timestampField.value = new Date().toISOString();
}

/* Membership modal functionality */
const modalLinks = document.querySelectorAll(".modal-link");
const closeButtons = document.querySelectorAll(".close-modal");

modalLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        const modalId = link.dataset.modal;
        const modal = document.querySelector(`#${modalId}`);

        if (modal) {
            modal.showModal();
        }
    });
});

closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        button.closest("dialog").close();
    });
});

/* Close modal when clicking outside its content */
document.querySelectorAll("dialog").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.close();
        }
    });
});

