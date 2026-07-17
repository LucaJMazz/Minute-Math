import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getDateString = (value) => {
    if (!value) return null;
    if (typeof value === "string") return value;

    const date = typeof value.toDate === "function" ? value.toDate() : value;
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getYesterdayString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getDateString(yesterday);
};

const getProfileWithCurrentDailyState = async (userRef, userSnap) => {
    const data = userSnap.data();
    const today = getTodayString();
    const lastPlayed = getDateString(data.lastPlayed);
    const hasCompletedToday = lastPlayed === today && Boolean(data.completedDay || data.completedGame);

    if (!hasCompletedToday && (data.completedDay || data.dailyChances !== 5)) {
        const resetData = {
            completedDay: false,
            completedGame: false,
            correctAnswer: false,
            dailyChances: 5,
        };

        await updateDoc(userRef, resetData);
        return { ...data, ...resetData };
    }

    return {
        ...data,
        completedDay: hasCompletedToday || Boolean(data.completedDay),
        dailyChances: hasCompletedToday ? (data.dailyChances ?? 0) : 5,
    };
};

// Initialize user document when they first sign up
export const createUserProfile = async (user) => {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                name: user.displayName || "name",
                lastPlayed: null,
                lastPlayedAt: null,
                score: 0,
                gamesPlayed: 0,
                streak: 0,
                completedDay: false,
                completedGame: false,
                correctAnswer: false,
                dailyChances: 5,
            });
        }
        return userRef;
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export const newDay = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    await updateDoc(userRef, {
        "completedDay": false,
        "completedGame": false,
        "dailyChances": 5,
    });
}

// Get user profile
export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = await getProfileWithCurrentDailyState(userRef, userSnap);
            return { id: userSnap.id, ...data };
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};

export const updateScore = async (userId, scoreToday) => {
    try {
        if (!userId) {
            console.error("updateScore called with invalid userId:", userId);
            return;
        }
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        await updateDoc(userRef, {
            "score": increment(scoreToday),
            "completedDay": true,
            "completedGame": true,
            "correctAnswer": Boolean(scoreToday),
            "dailyChances": 0,
        });
    } catch (error) {
        console.error("Error updating score:", error);
        throw error;
    }
};

export const updateDailyChances = async (userId, chances) => {
    try {
        if (!userId) {
            console.error("updateDailyChances called with invalid userId:", userId);
            return;
        }
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        await updateDoc(userRef, {
            "dailyChances": Math.max(chances, 0),
        });
    } catch (error) {
        console.error("Error updating daily chances:", error);
        throw error;
    }
}

export const completeGame = async (userId) => {
    try {
        if (!userId) {
            console.error("completeGame called with invalid userId:", userId);
            return;
        }
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        await updateDoc(userRef, {
            "completedGame": true,
            "completedDay": true,
            "dailyChances": 0,
            "lastPlayed": getTodayString(),
            "lastPlayedAt": serverTimestamp(),
        });
    } catch (error) {
        console.error("Error completing game:", error);
        throw error;
    }
}

// Update streak
export const updateStreak = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const today = getTodayString();
        const lastPlayed = getDateString(userData.lastPlayed);
        const yesterdayStr = getYesterdayString();

        let newStreak = userData.streak || 0;

        if (lastPlayed === today) {
            // Already played today, no change
            return;
        } else if (lastPlayed === yesterdayStr) {
            // Played yesterday, increment streak
            newStreak += 1;
        } else {
            // Streak broken, reset to 1
            newStreak = 1;
        }

        await updateDoc(userRef, {
            "streak": newStreak,
            "lastPlayed": today,
            "lastPlayedAt": serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating streak:", error);
        throw error;
    }
};
