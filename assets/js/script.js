// --- 1. Celebrity Catalog and Search Functionality ---
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const catalog = document.getElementById('celebrity-catalog');
const pagination = document.getElementById('pagination');
const nameFilter = document.getElementById('nameFilter');
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// --- 1.2. Data and State ---
let celebrities = [];
let itemsPerPage = 8;
let currentPage = 1;
let isMobile = window.innerWidth < 768;

// --- 1.3. Fetch Celebrity Data ---
fetch('celebrities.json')
    .then(response => response.json())
    .then(data => {
        celebrities = data;
        displayCelebrities(currentPage); // Call display functions here
        displayPagination();
    })
    .catch(error => {
        console.error('Error fetching celebrities:', error);
        catalog.innerHTML = `<p class="text-center w-full">Error loading celebrities.</p>`; //display error to user.
    });

// --- 1.4. Mobile Menu Toggle ---
btn.addEventListener('click', navToggle);
function navToggle() {
    btn.classList.toggle('open');
    menu.classList.toggle('flex');
    menu.classList.toggle('hidden');
}


// --- 1.5. Search Bar Styles ---
searchInput.addEventListener('focus', () => {
    searchBar.classList.add('shadow-lg', 'border', 'border-indigo-200');
});
searchInput.addEventListener('blur', () => {
    searchBar.classList.remove('shadow-lg', 'border', 'border-indigo-200');
});

// --- 1.6. Search Functionality ---
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let searchResults = [];

    if (searchTerm) {
        searchResults = celebrities.filter(celebrity =>
            celebrity.name.toLowerCase().includes(searchTerm)
        );
    } else {
        searchResults = celebrities;
    }

    displaySearchResults(searchResults);
}

function displaySearchResults(results) {
    catalog.innerHTML = '';
    pagination.innerHTML = ""; // Remove pagination when searching

    if (results.length > 0) {
        displayCelebritiesData(results); // Use the existing display function with search results
    } else {
        catalog.innerHTML = `<p class="text-center w-full">No matching celebrities found.</p>`;
    }
}

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
    }
});

// --- 1.7. Filter Functionality ---
nameFilter.addEventListener('input', () => {
    currentPage = 1;
    displayCelebrities(currentPage);
    displayPagination();
});

// --- 1.8. Display Celebrities and Pagination ---
function displayCelebrities(page) {
    let filteredCelebrities = celebrities; // Start with the full array

    const nameFilterValue = nameFilter.value.toLowerCase();
    filteredCelebrities = filteredCelebrities.filter(celebrity =>
        celebrity.name.toLowerCase().includes(nameFilterValue)
    );

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredCelebrities.slice(startIndex, endIndex);

    displayCelebritiesData(pageItems);
    displayPagination();
}

function displayCelebritiesData(data) {
    catalog.innerHTML = '';

    if (data.length === 0) {
        catalog.innerHTML = `<p class="text-center w-full">No Celebrities Found</p>`;
        pagination.innerHTML = "";
        return;
    }

    if (isMobile) {
        catalog.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
        catalog.classList.add('flex', 'overflow-x-auto', 'snap-x', 'snap-mandatory');
    } else {
        catalog.classList.remove('flex', 'overflow-x-auto', 'snap-x', 'snap-mandatory');
        catalog.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
    }

    data.forEach(celebrity => {
        const item = document.createElement('div');
        item.classList.add('relative', 'rounded-lg', 'overflow-hidden', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'duration-300');
        if (isMobile) {
            item.classList.add('flex-shrink-0', 'w-full', 'snap-center');
        }
    
        item.innerHTML = `
            <img src="celebrities/assets/${celebrity.image}" alt="${celebrity.name}" class="w-full h-64 object-cover">
            <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent flex items-center justify-between px-4">
                <span class="text-white font-semibold">${celebrity.name}</span>
                <a href="celebrities/${celebrity.page}" class="bg-black text-white px-3 py-1 rounded-md transition-colors duration-300">View</a>
            </div>
        `;
        catalog.appendChild(item);
    });
}

function displayPagination() {
    pagination.innerHTML = '';
    const filteredCelebritiesCount = celebrities.filter(celebrity => celebrity.name.toLowerCase().includes(nameFilter.value.toLowerCase())).length;
    const pageCount = Math.ceil(filteredCelebritiesCount / itemsPerPage);

    if (pageCount <= 1) {
        return;
    }

    const maxButtons = isMobile ? 5 : 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(pageCount, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
        pagination.appendChild(createPaginationButton('...', 1));
    }

    for (let i = startPage; i <= endPage; i++) {
        pagination.appendChild(createPaginationButton(i, i));
    }

    if (endPage < pageCount) {
        pagination.appendChild(createPaginationButton('...', pageCount));
    }
}

function createPaginationButton(text, page) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('mx-1', 'px-3', 'py-1', 'rounded-md', 'border', 'border-gray-300', 'hover:bg-gray-200', 'transition-colors', 'duration-300');
    if (page === currentPage) {
        button.classList.add('bg-black', 'text-white', 'border-black');
    }
    button.addEventListener('click', () => {
        currentPage = page;
        displayCelebrities(currentPage);
        displayPagination();
    });
    return button;
}

// --- 1.9. Screen Size Check ---
function checkScreenSize() {
    isMobile = window.innerWidth < 768;
    currentPage = 1;
    displayCelebrities(currentPage);
    displayPagination();
}

window.addEventListener('resize', checkScreenSize);

// --- 2. Chat and FAQ Functionality ---
const chatButton = document.getElementById('chatButton');
const chatPopup = document.getElementById('chatPopup');
const closeChat = document.getElementById('closeChat'); // Get the close button here
const faqSection = document.getElementById('faqSection');
const faqAnswer = document.getElementById('faqAnswer');
const answerText = document.getElementById('answerText');
const userMessage = document.getElementById('userMessage');
const sendMessage = document.getElementById('sendMessage');
const messageSent = document.getElementById('messageSent');

// --- 2.1. FAQ Data ---
const faqs = [
    { question: "How do I book a celebrity?", answer: "Visit the booking page and fill out the form." },
    { question: "What types of events do you handle?", answer: "We handle corporate events, private parties, and more." },
    { question: "Can I get a quote?", answer: "Yes, please contact us with your event details." },
    { question: "How long does it take to confirm a booking?", answer: "Confirmation times vary, we will get back to you as soon as possible." }
];

// --- 2.3. Create FAQ Buttons ---
faqs.forEach(faq => {
    const button = document.createElement('button');
    button.textContent = faq.question;
    button.classList.add('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700', 'py-2', 'px-4', 'rounded-md', 'mb-2', 'w-full', 'text-left');
    button.addEventListener('click', () => {
        answerText.textContent = faq.answer;
        faqAnswer.classList.remove('hidden');
        userMessage.classList.add('hidden');
        sendMessage.classList.add('hidden');
    });
    faqSection.appendChild(button);
});

// --- 2.4. Event Listeners for Chat ---
chatButton.addEventListener('click', () => {
    chatPopup.classList.remove('hidden');
    faqAnswer.classList.add('hidden');
    userMessage.classList.remove('hidden');
    sendMessage.classList.remove('hidden');
});

// --- 2.5. Close Chat Event Listener (Moved to global scope) ---
closeChat.addEventListener('click', () => {
    chatPopup.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded');

    // --- 2.6. Send Message Functionality (with Fetch) ---
    sendMessage.addEventListener('click', () => {
        const message = userMessage.value.trim();
        if (message) {
            fetch('http://localhost:3000/send-email', { // Adjust URL if needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            })
            .then(response => response.json()) //parse the response as json.
            .then(data => {
                console.log(data);
                userMessage.value = '';
                messageSent.textContent = "Message sent successfully!"; //Change message text.
                messageSent.classList.remove('hidden');
                setTimeout(() => {
                    messageSent.classList.add('hidden');
                }, 3000);
            })
            .catch(error => {
                console.error('Error sending email:', error);
                messageSent.textContent = "Failed to send message. Please try again.";
                messageSent.classList.remove('hidden');
                setTimeout(() => {
                    messageSent.classList.add('hidden');
                }, 3000);
            });
        }
    });
});

// --- 3. Form Submission Functionality ---
const submitRequestButton = document.getElementById('submitRequestButton');
const requestMessageSent = document.getElementById('requestMessageSent');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const eventDateInput = document.getElementById('eventDate');
const eventTypeInput = document.getElementById('eventType');
const messageInput = document.getElementById('message');
const emailError = document.getElementById('emailError');

// --- 3.1. Email Validation Function ---
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// --- 3.2. Restrict Date Input ---
const today = new Date().toISOString().split('T')[0];
eventDateInput.setAttribute('min', today);

// --- 3.3. Form Submission Event Listener ---
submitRequestButton.addEventListener('click', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailError.classList.remove('hidden');
        return;
    } else {
        emailError.classList.add('hidden');
    }

    const formData = {
        name: nameInput.value,
        email: email,
        phone: phoneInput.value,
        eventDate: eventDateInput.value,
        eventType: eventTypeInput.value,
        message: messageInput.value,
    };

    console.log('Form data sent:', formData);

    requestMessageSent.textContent = "Request submitted successfully!";
    requestMessageSent.classList.remove('hidden');

    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    eventDateInput.value = '';
    eventTypeInput.value = '';
    messageInput.value = '';

    setTimeout(() => {
        requestMessageSent.classList.add('hidden');
    }, 3000);
});