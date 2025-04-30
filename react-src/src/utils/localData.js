// localData.js

// Save both score and streak to localStorage
export function saveGameStats(score, streak) {
    localStorage.setItem("minuteScore", score);
    localStorage.setItem("minuteStreak", streak);
}

// Initialize all expected localStorage keys with default values if they don't exist
export function initializeLocalStorageDefaults() {
    if (localStorage.getItem("minuteScore") === null) {
        localStorage.setItem("minuteScore", 0);
    }
    if (localStorage.getItem("minuteStreak") === null) {
        localStorage.setItem("minuteStreak", 0);
    }
    if (localStorage.getItem("dailyChances") === null) {
        localStorage.setItem("dailyChances", 5); 
    }
    if (localStorage.getItem("lastPlayedDate") === null) {
        localStorage.setItem("lastPlayedDate", new Date().toDateString());
    }
    if (localStorage.getItem("completedGame") === null) {
        localStorage.setItem("completedGame", 0);
    }
}

// Save score only
export function saveScore(score) {
    localStorage.setItem("minuteScore", score);
}

// Save streak only
export function saveStreak(streak) {
    localStorage.setItem("minuteStreak", streak);
}

// Save chances only
export function saveChances(chances) {
    localStorage.setItem("dailyChances", chances);
}

// Save whether the game was completed (0 or 1)
export function completeGame(completed) {
    localStorage.setItem("completedGame", completed)
}

// Retrieve all stored game data from localStorage and parse them into usable numbers
export function getGameStats() {
    return {
        score: parseInt(localStorage.getItem("minuteScore")) || 0,
        streak: parseInt(localStorage.getItem("minuteStreak")) || 0,
        chances: parseInt(localStorage.getItem("dailyChances")) || 0,
        completed: parseInt(localStorage.getItem("completedGame")) || 0,
    };
}

// Clear all saved stats from localStorage
export function resetGameStats() {
    localStorage.removeItem("minuteScore");
    localStorage.removeItem("minuteStreak");
    localStorage.removeItem("dailyChances");
    localStorage.removeItem("completedGame");
    localStorage.removeItem("lastPlayedDate");
}

// Reset chances to default value (5)
export function resetChances() {
    localStorage.setItem("dailyChances", 5);
}

// Store today's date in localStorage
export function setLastDate() {
    localStorage.setItem("lastPlayedDate", new Date().toDateString());
}

// Retrieve last saved date from localStorage
export function getLastDate() {
    return localStorage.getItem("lastPlayedDate");
}

// Check if today is a new calendar day and reset daily stats if so
export function checkAndResetDaily() {
    const today = new Date().toDateString();
    const lastDate = getLastDate();
    const storedChances = localStorage.getItem("dailyChances");

    if (today !== lastDate || storedChances === null) {
        resetChances();
        completeGame(0);
        // If it's the next calendar day, continue the streak; otherwise reset it
        if (isNextDay()) {
            saveStreak(getGameStats().streak + 1);
        } else {
            saveStreak(0);
        }
        setLastDate();
    }
}

// Determine if today is exactly one day after the last played date
export function isNextDay() {
    const today = new Date();
    const lastDateStr = getLastDate();

    if (!lastDateStr) return false;

    const lastDate = new Date(lastDateStr);

    // Strip the time component to ensure date-only comparison
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastMidnight = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

    const diffInMs = todayMidnight - lastMidnight;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays === 1;
}