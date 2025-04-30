/*
    Homepage.js
    This file contains the code for the homepage of the application.
    Luca Mazzotta April 24 2024
 */

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Select all buttons on the homepage
    const buttons = document.querySelectorAll("button");
    const menuButton = document.getElementById("menu-button");

    // Add a click event listener to each button
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            console.log(`Button clicked: ${button.id}`);
            if (button.id === "how-button") {
                showHowToPlay(); //scrolls to the how to play section and highlights it
            } else if (button.id === "play-button") {
                openPlay(); //opens the play page
            }
        });
    });

    menuButton.addEventListener("click", (event) => {
        console.log(`Menu button clicked: ${menuButton.id}`);
    });
});

function showHowToPlay() {
    const span = document.getElementById("how-to-play");
    if (span) {
        span.scrollIntoView({ behavior: "smooth" });
        span.classList.remove('glow-flash-off');
        span.classList.add('glow-flash');

        setTimeout(() => {
            span.classList.remove('glow-flash');
            span.classList.add('glow-flash-off');
        }, 1000); // remove glow after 1 second
    }
}

function openPlay() {
    // Redirect to the play page
    window.location.href = "/dist/index.html";
}