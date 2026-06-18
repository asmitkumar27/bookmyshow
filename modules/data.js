// Data Module - Contains all book and show data
const DataModule = (() => {
    // Books data
    const books = [
        {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            description: 'A classic American novel set in the Jazz Age.',
            rating: 4.5,
            emoji: '📘',
            type: 'book'
        },
        {
            id: 2,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            description: 'A gripping tale of racial injustice and childhood innocence.',
            rating: 4.8,
            emoji: '📗',
            type: 'book'
        },
        {
            id: 3,
            title: '1984',
            author: 'George Orwell',
            description: 'A dystopian novel about totalitarianism and surveillance.',
            rating: 4.7,
            emoji: '📕',
            type: 'book'
        },
        {
            id: 4,
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            description: 'A romantic novel about love and social class in England.',
            rating: 4.6,
            emoji: '📙',
            type: 'book'
        },
        {
            id: 5,
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            description: 'A coming-of-age novel following Holden Caulfield.',
            rating: 4.3,
            emoji: '📘',
            type: 'book'
        },
        {
            id: 6,
            title: 'Moby Dick',
            author: 'Herman Melville',
            description: 'An epic adventure about obsession and the sea.',
            rating: 4.2,
            emoji: '📗',
            type: 'book'
        },
        {
            id: 7,
            title: 'Jane Eyre',
            author: 'Charlotte Brontë',
            description: 'A gothic romance with a strong female protagonist.',
            rating: 4.4,
            emoji: '📕',
            type: 'book'
        },
        {
            id: 8,
            title: 'Wuthering Heights',
            author: 'Emily Brontë',
            description: 'A dark tale of love and revenge on the Yorkshire moors.',
            rating: 4.1,
            emoji: '📙',
            type: 'book'
        }
    ];

    // Shows data
    const shows = [
        {
            id: 101,
            title: 'Breaking Bad',
            author: 'Vince Gilligan',
            description: 'A thrilling drama about a chemistry teacher turned drug lord.',
            rating: 4.9,
            emoji: '📺',
            type: 'show'
        },
        {
            id: 102,
            title: 'Game of Thrones',
            author: 'David Benioff, D.B. Weiss',
            description: 'An epic fantasy series with political intrigue and dragons.',
            rating: 4.5,
            emoji: '🎬',
            type: 'show'
        },
        {
            id: 103,
            title: 'The Crown',
            author: 'Peter Morgan',
            description: 'A biographical drama about the British Royal Family.',
            rating: 4.6,
            emoji: '📺',
            type: 'show'
        },
        {
            id: 104,
            title: 'Stranger Things',
            author: 'The Duffer Brothers',
            description: 'A sci-fi horror series set in the 1980s with supernatural elements.',
            rating: 4.7,
            emoji: '🎬',
            type: 'show'
        },
        {
            id: 105,
            title: 'The Office',
            author: 'Greg Daniels',
            description: 'A mockumentary comedy about office workers and their daily lives.',
            rating: 4.8,
            emoji: '📺',
            type: 'show'
        },
        {
            id: 106,
            title: 'Sherlock',
            author: 'Mark Gatiss, Steven Moffat',
            description: 'A modern adaptation of the classic detective stories.',
            rating: 4.6,
            emoji: '🎬',
            type: 'show'
        },
        {
            id: 107,
            title: 'The Mandalorian',
            author: 'Jon Favreau',
            description: 'A space western set in the Star Wars universe.',
            rating: 4.7,
            emoji: '📺',
            type: 'show'
        },
        {
            id: 108,
            title: 'Chernobyl',
            author: 'Craig Mazin',
            description: 'A historical drama about the Chernobyl nuclear disaster.',
            rating: 4.8,
            emoji: '🎬',
            type: 'show'
        }
    ];

    // Get books
    const getBooks = () => books;

    // Get shows
    const getShows = () => shows;

    // Get item by ID
    const getItemById = (id, type) => {
        if (type === 'book') {
            return books.find(b => b.id === id);
        } else if (type === 'show') {
            return shows.find(s => s.id === id);
        }
        return null;
    };

    // Search books and shows
    const search = (query) => {
        const lowerQuery = query.toLowerCase();
        const bookResults = books.filter(b =>
            b.title.toLowerCase().includes(lowerQuery) ||
            b.author.toLowerCase().includes(lowerQuery)
        );
        const showResults = shows.filter(s =>
            s.title.toLowerCase().includes(lowerQuery) ||
            s.author.toLowerCase().includes(lowerQuery)
        );
        return {
            books: bookResults,
            shows: showResults
        };
    };

    // Get top rated items
    const getTopRated = (count = 4) => {
        const allItems = [...books, ...shows];
        return allItems.sort((a, b) => b.rating - a.rating).slice(0, count);
    };

    // Public API
    return {
        getBooks,
        getShows,
        getItemById,
        search,
        getTopRated
    };
})();
