// UI Module - Handles all UI interactions and DOM manipulation
const UIModule = (() => {
    // Show alert message
    const showAlert = (message, type = 'success') => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        document.body.insertBefore(alertDiv, document.body.firstChild);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    };

    // Open modal
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    };

    // Close modal
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Update user menu in navbar
    const updateUserMenu = () => {
        const currentUser = AuthModule.getCurrentUser();
        const userMenuContainer = document.getElementById('userMenuContainer');
        const authLinks = document.getElementById('authLinks');
        const userName = document.getElementById('userName');

        if (currentUser) {
            // User is logged in
            userMenuContainer.style.display = 'block';
            authLinks.style.display = 'none';
            userName.textContent = currentUser.name;
        } else {
            // User is not logged in
            userMenuContainer.style.display = 'none';
            authLinks.style.display = 'block';
        }
    };

    // Display profile
    const displayProfile = () => {
        const currentUser = AuthModule.getCurrentUser();
        if (!currentUser) {
            showAlert('Please login first', 'error');
            return;
        }

        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('memberSince').textContent = new Date(currentUser.createdAt).toLocaleDateString();

        openModal('profileModal');
    };

    // Display favorites
    const displayFavorites = () => {
        const currentUser = AuthModule.getCurrentUser();
        if (!currentUser) {
            showAlert('Please login first', 'error');
            return;
        }

        const favoritesList = document.getElementById('favoritesList');
        const favorites = AuthModule.getFavorites();

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p style="text-align: center; color: #9ca3af;">No favorites yet</p>';
        } else {
            const allItems = [...DataModule.getBooks(), ...DataModule.getShows()];
            favoritesList.innerHTML = '';

            favorites.forEach(fav => {
                const item = allItems.find(i => i.id === fav.itemId && i.type === fav.itemType);
                if (item) {
                    const favItem = document.createElement('div');
                    favItem.style.cssText = `
                        padding: 12px;
                        border-bottom: 1px solid #e5e7eb;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    `;
                    favItem.innerHTML = `
                        <div>
                            <p style="font-weight: 600; margin-bottom: 4px;">${item.title}</p>
                            <p style="font-size: 0.9rem; color: #9ca3af;">${item.author}</p>
                        </div>
                        <button onclick="UIModule.removeFavorite(${item.id})" style="
                            background-color: #fee2e2;
                            color: #991b1b;
                            border: none;
                            padding: 6px 12px;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Remove</button>
                    `;
                    favoritesList.appendChild(favItem);
                }
            });
        }

        openModal('favoritesModal');
    };

    // Remove favorite
    const removeFavorite = (itemId) => {
        const result = AuthModule.removeFromFavorites(itemId);
        if (result.success) {
            showAlert(result.message, 'success');
            displayFavorites(); // Refresh favorites list
        } else {
            showAlert(result.message, 'error');
        }
    };

    // Create book/show card
    const createCard = (item) => {
        const card = document.createElement('div');
        card.className = 'card';
        const isFavorited = AuthModule.getFavorites().some(f => f.itemId === item.id);

        card.innerHTML = `
            <div class="card-image">${item.emoji}</div>
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-author">${item.author}</p>
                <p class="card-description">${item.description}</p>
                <p class="card-rating">⭐ ${item.rating} / 5</p>
                <div class="card-actions">
                    <button class="card-btn btn-favorite" onclick="UIModule.toggleFavorite(${item.id}, '${item.type}')" id="fav-${item.id}">
                        ${isFavorited ? '❤️ Favorited' : '🤍 Favorite'}
                    </button>
                    <button class="card-btn btn-read">Read More</button>
                </div>
            </div>
        `;

        return card;
    };

    // Toggle favorite
    const toggleFavorite = (itemId, itemType) => {
        if (!AuthModule.isLoggedIn()) {
            showAlert('Please login first to add favorites', 'error');
            openModal('loginModal');
            return;
        }

        const favorites = AuthModule.getFavorites();
        const isFavorited = favorites.some(f => f.itemId === itemId);

        if (isFavorited) {
            const result = AuthModule.removeFromFavorites(itemId);
            if (result.success) {
                showAlert('Removed from favorites', 'success');
            }
        } else {
            const result = AuthModule.addToFavorites(itemId, itemType);
            if (result.success) {
                showAlert('Added to favorites', 'success');
            } else {
                showAlert(result.message, 'error');
            }
        }

        updateFavoriteButtons();
    };

    // Update favorite buttons
    const updateFavoriteButtons = () => {
        const favorites = AuthModule.getFavorites();
        document.querySelectorAll('.card-btn.btn-favorite').forEach(btn => {
            const cardId = btn.getAttribute('onclick').match(/\d+/)[0];
            const isFavorited = favorites.some(f => f.itemId === parseInt(cardId));
            btn.textContent = isFavorited ? '❤️ Favorited' : '🤍 Favorite';
        });
    };

    // Render books
    const renderBooks = () => {
        const booksGrid = document.getElementById('booksGrid');
        const books = DataModule.getBooks();
        booksGrid.innerHTML = '';

        books.forEach(book => {
            booksGrid.appendChild(createCard(book));
        });
    };

    // Render shows
    const renderShows = () => {
        const showsGrid = document.getElementById('showsGrid');
        const shows = DataModule.getShows();
        showsGrid.innerHTML = '';

        shows.forEach(show => {
            showsGrid.appendChild(createCard(show));
        });
    };

    // Setup modal close buttons
    const setupModalClosers = () => {
        document.getElementById('closeLoginModal').addEventListener('click', () => {
            closeModal('loginModal');
        });

        document.getElementById('closeSignupModal').addEventListener('click', () => {
            closeModal('signupModal');
        });

        document.getElementById('closeProfileModal').addEventListener('click', () => {
            closeModal('profileModal');
        });

        document.getElementById('closeFavoritesModal').addEventListener('click', () => {
            closeModal('favoritesModal');
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('active');
            }
        });
    };

    // Setup form switches
    const setupFormSwitches = () => {
        document.getElementById('switchToSignup').addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            openModal('signupModal');
        });

        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('signupModal');
            openModal('loginModal');
        });
    };

    // Public API
    return {
        showAlert,
        openModal,
        closeModal,
        updateUserMenu,
        displayProfile,
        displayFavorites,
        removeFavorite,
        createCard,
        toggleFavorite,
        renderBooks,
        renderShows,
        setupModalClosers,
        setupFormSwitches
    };
})();
