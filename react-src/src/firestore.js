import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, increment, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Initialize user document when they first sign up
export const createUserProfile = async (user) => {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const today = new Date().toISOString().split('T')[0];
            await setDoc(userRef, {
                email: user.email,
                name: user.displayName || "name",
                lastPlayed: serverTimestamp(),
                score: 0,
                gamesPlayed: 0,
                streak: 0,
                completedDay: false,
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
        "dailyChances": 5,
    });
}

// Get user profile
export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
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

        const userData = userSnap.data();

        let newScore = userData.score + scoreToday;

        await updateDoc(userRef, {
            "score": newScore,
            "completedDay": true,
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

        const userData = userSnap.data();

        let newChances = chances;

        await updateDoc(userRef, {
            "dailyChances": newChances,
        });
    } catch (error) {
        console.error("Error updating daily chances:", error);
        throw error;
    }
}

export const completeGame = async (userId, chances) => {
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
        const today = new Date().toISOString().split('T')[0];
        const lastPlayed = userData.lastPlayed;

        // Calculate if streak should continue
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

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
            lastPlayed: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating streak:", error);
        throw error;
    }
};