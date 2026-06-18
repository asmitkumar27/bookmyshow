// Main App - Initializes and orchestrates all modules
const App = (() => {
    // Initialize the application
    const init = () => {
        console.log('🚀 BookShow App Initializing...');

        // Setup UI
        UIModule.setupModalClosers();
        UIModule.setupFormSwitches();

        // Render initial content
        UIModule.renderBooks();
        UIModule.renderShows();

        // Update user menu based on login state
        UIModule.updateUserMenu();

        // Setup event listeners
        setupEventListeners();

        console.log('✅ BookShow App Ready!');
    };

    // Setup all event listeners
    const setupEventListeners = () => {
        // Login button
        document.getElementById('loginBtn').addEventListener('click', () => {
            UIModule.openModal('loginModal');
        });

        // Signup button
        document.getElementById('signupBtn').addEventListener('click', () => {
            UIModule.openModal('signupModal');
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });

        // Profile link
        document.querySelector('a[href="#profile"]').addEventListener('click', (e) => {
            e.preventDefault();
            UIModule.displayProfile();
        });

        // Favorites link
        document.querySelector('a[href="#favorites"]').addEventListener('click', (e) => {
            e.preventDefault();
            UIModule.displayFavorites();
        });

        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', handleLogin);

        // Signup form submission
        document.getElementById('signupForm').addEventListener('submit', handleSignup);

        // Explore button
        document.getElementById('exploreBtnHero').addEventListener('click', () => {
            document.getElementById('books').scrollIntoView({ behavior: 'smooth' });
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const section = document.querySelector(href);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    };

    // Handle login form submission
    const handleLogin = (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Validate inputs
        if (!email || !password) {
            UIModule.showAlert('Please fill in all fields', 'error');
            return;
        }

        // Attempt login
        const result = AuthModule.login(email, password);

        if (result.success) {
            UIModule.showAlert(`Welcome back, ${result.user.name}!`, 'success');
            UIModule.closeModal('loginModal');
            document.getElementById('loginForm').reset();
            UIModule.updateUserMenu();
        } else {
            UIModule.showAlert(result.message, 'error');
        }
    };

    // Handle signup form submission
    const handleSignup = (e) => {
        e.preventDefault();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            UIModule.showAlert('Please fill in all fields', 'error');
            return;
        }

        // Attempt signup
        const result = AuthModule.signup(name, email, password, confirmPassword);

        if (result.success) {
            UIModule.showAlert(`Welcome to BookShow, ${result.user.name}!`, 'success');
            UIModule.closeModal('signupModal');
            document.getElementById('signupForm').reset();
            UIModule.updateUserMenu();
        } else {
            UIModule.showAlert(result.message, 'error');
        }
    };

    // Handle logout
    const handleLogout = () => {
        const result = AuthModule.logout();
        if (result.success) {
            UIModule.showAlert('Logged out successfully', 'success');
            UIModule.updateUserMenu();
        }
    };

    // Public API
    return {
        init
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
