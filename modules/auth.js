// Auth Module - Handles login, signup, and user authentication
const AuthModule = (() => {
    // Storage key for users
    const USERS_STORAGE_KEY = 'bookshow_users';
    const CURRENT_USER_KEY = 'bookshow_current_user';

    // Initialize with demo users if empty
    const initializeDemoUsers = () => {
        if (!localStorage.getItem(USERS_STORAGE_KEY)) {
            const demoUsers = [
                {
                    id: 1,
                    name: 'Asmit Kumar',
                    email: 'asmit@demo.com',
                    password: 'password123', // In production, use hashed passwords
                    createdAt: new Date().toISOString(),
                    favorites: []
                },
                {
                    id: 2,
                    name: 'Demo User',
                    email: 'demo@demo.com',
                    password: 'demo123',
                    createdAt: new Date().toISOString(),
                    favorites: []
                }
            ];
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUsers));
        }
    };

    // Get all users from storage
    const getAllUsers = () => {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    };

    // Save users to storage
    const saveUsers = (users) => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    };

    // Login user
    const login = (email, password) => {
        const users = getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                favorites: user.favorites || []
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
            return { success: true, user: userData };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    // Signup new user
    const signup = (name, email, password, confirmPassword) => {
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return { success: false, message: 'All fields are required' };
        }

        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        const users = getAllUsers();

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            password: password, // In production, hash this
            createdAt: new Date().toISOString(),
            favorites: []
        };

        users.push(newUser);
        saveUsers(users);

        // Auto login after signup
        return login(email, password);
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        return { success: true, message: 'Logged out successfully' };
    };

    // Get current logged in user
    const getCurrentUser = () => {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    };

    // Check if user is logged in
    const isLoggedIn = () => {
        return getCurrentUser() !== null;
    };

    // Add to favorites
    const addToFavorites = (itemId, itemType) => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Please login first' };
        }

        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        const favorite = {
            itemId: itemId,
            itemType: itemType,
            addedAt: new Date().toISOString()
        };

        if (!users[userIndex].favorites) {
            users[userIndex].favorites = [];
        }

        // Check if already in favorites
        if (users[userIndex].favorites.some(f => f.itemId === itemId && f.itemType === itemType)) {
            return { success: false, message: 'Already in favorites' };
        }

        users[userIndex].favorites.push(favorite);
        saveUsers(users);

        // Update current user
        currentUser.favorites = users[userIndex].favorites;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

        return { success: true, message: 'Added to favorites', favorites: users[userIndex].favorites };
    };

    // Remove from favorites
    const removeFromFavorites = (itemId) => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Please login first' };
        }

        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        users[userIndex].favorites = users[userIndex].favorites.filter(f => f.itemId !== itemId);
        saveUsers(users);

        // Update current user
        currentUser.favorites = users[userIndex].favorites;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

        return { success: true, message: 'Removed from favorites', favorites: users[userIndex].favorites };
    };

    // Get favorites
    const getFavorites = () => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return [];
        }
        return currentUser.favorites || [];
    };

    // Initialize on load
    initializeDemoUsers();

    // Public API
    return {
        login,
        signup,
        logout,
        getCurrentUser,
        isLoggedIn,
        addToFavorites,
        removeFromFavorites,
        getFavorites
    };
})();
