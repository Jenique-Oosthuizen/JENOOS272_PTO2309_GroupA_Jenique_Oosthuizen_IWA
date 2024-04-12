/**
 * Display the list of books along with previews.
 * If no books are available, an error is thrown.
 * @throws {Error} - Throws an error if books are not available or not in array format.
 */
import {books, genres, authors, BOOKS_PER_PAGE} from "./data.js"
import { DOM, createPreviewsFragment, createGenresFragment, createAuthorsFragment, isDarkMode, setTheme } from "./view.js";

if (!books && !Array.isArray(books)) throw new Error('Source required')

//----------------------------------------------------------------------------//
const extractedBooks = books.slice(0, 36)
/**
 * Creates a preview element for a book.
 * @param {object} book - The book object containing information like id, image, title, and author.
 * @returns {HTMLElement} - The HTML button element representing the book preview.
 */
const createPreview = (book) => {
    const { author, id, image, title } = book
    const authorName = authors[author]
    const element = document.createElement('button')
    element.classList.add('preview')
    element.setAttribute('data-preview', id)
    element.innerHTML = /*html*/`
        <img
            class="preview__image"
            src="${image}"
        />
            
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authorName}</div>
        </div>
        `
    return element
    }    

extractedBooks.forEach((book) => {
    const preview = createPreview(book)
    createPreviewsFragment.appendChild(preview)
})

DOM.list.items.appendChild(createPreviewsFragment)

//----------------------------------------------------------------------------//
/**
 * Function to handle showing more books when the "Show more" button is clicked.
 * Updates the page number and displays more books.
 */
let page = 1
const showMoreButton = () => {
    const matches = books
    const remaining = matches.length - (page * BOOKS_PER_PAGE)

    
    if (remaining > 0) {
        const startIndex = BOOKS_PER_PAGE
        const endIndex = startIndex + BOOKS_PER_PAGE
        const booksToShow = matches.slice(startIndex, endIndex)

        const fragment = document.createDocumentFragment()
        booksToShow.forEach(book => {
            const preview = createPreview(book)
            fragment.appendChild(preview)
        })

        DOM.list.items.appendChild(fragment)

        page++; // Increment page number
    
    DOM.list.button.innerHTML = /* html */`
         <span>Show more</span>
         <span class="list__remaining"> (${remaining})</span>`

    } else {
         // If no more books remaining, disable the button
         DOM.list.button.disabled = true
    }
}
DOM.list.button.addEventListener('click', showMoreButton)

//----------------------------------------------------------------------------//
/**
 * Populates the genre select dropdown with options.
 */
const genreSearch = () => {
    const genreSelect = DOM.search.genres
    genreSelect.innerHTML = ''
    const allGenresOption = document.createElement('option')
    allGenresOption.value = 'any'
    allGenresOption.innerText = 'All Genres'
    genreSelect.appendChild(allGenresOption)

    for (const [id, genreName] of Object.entries(genres)) {
        const genreOption = document.createElement('option')
        genreOption.value = id
        genreOption.innerText = genreName
        genreSelect.appendChild(genreOption)
    }
}

DOM.search.genres.appendChild(createGenresFragment)
genreSearch()

//----------------------------------------------------------------------------//
/**
 * Populates the author select dropdown with options.
 */
const authorSearch = () => {
    const authorSelect = DOM.search.authors
    authorSelect.innerHTML = ''
    const allAuthorOptions = document.createElement('option')
    allAuthorOptions.value = 'any'
    allAuthorOptions.innerText = 'All Authors'
    authorSelect.appendChild(allAuthorOptions)

    for (const [id, authorName] of Object.entries(authors)) {
        const authorOption = document.createElement('option')
        authorOption.value = id
        authorOption.innerText = authorName
        authorSelect.appendChild(authorOption)
    }
}

DOM.search.authors.appendChild(createAuthorsFragment)
authorSearch()

//----------------------------------------------------------------------------//
/**
 * Opens the search overlay to allow user input for searching books.
 */
const search = () => {
    DOM.search.overlay.open = true 
    DOM.search.title.focus()
}
DOM.header.search.addEventListener('click', search)

//----------------------------------------------------------------------------//
/**
 * Handles the search functionality based on user input.
 * Filters books based on title, author, and genre.
 * Displays the search results.
 * @param {Event} event - The event object from form submission.
 */
const searchFunction = (event) => {
    event.preventDefault()

    const formData = new FormData(DOM.search.form)
    const filters = Object.fromEntries(formData)

    const result = books.filter(book => {
        // Check if the title or description contains the text phrase
        const titleMatch = book.title.toLowerCase().includes(filters.title.toLowerCase())
        const descriptionMatch = book.description.toLowerCase().includes(filters.title.toLowerCase())

        // Check if the author matches the selected author filter
        const authorMatch = filters.author === 'any' || book.author === filters.author

        // Check if the genre matches the selected genre filter
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre)

        return (titleMatch || descriptionMatch) && authorMatch && genreMatch
    })

    // Display search results
    displaySearchResults(result)
}

//----------------------------------------------------------------------------//
/**
 * Displays the search results on the page.
 * @param {Array} results - An array of book objects matching the search criteria.
 */
const displaySearchResults = (results) => {
    // Clear previous search results
    DOM.list.items.innerHTML = ''

    // Display each matching book
    results.forEach(book => {
        const preview = createPreview(book);
        DOM.list.items.appendChild(preview);
    })

    // Show message if no results found
    if (results.length === 0) {
        DOM.list.message.classList.add('list__message_show')
    } else {
        DOM.list.message.classList.remove('list__message_show')
    }
}

DOM.search.form.addEventListener('submit', searchFunction)

//----------------------------------------------------------------------------//
/**
 * Scrolls to the top of the page and closes the search overlay.
 */
window.scrollTo({ top: 0, behavior: 'smooth' })
DOM.search.overlay.open === false

//----------------------------------------------------------------------------//
/**
 * Toggles between dark mode and light mode.
 * Saves the selected theme.
 */
const toggleDarkMode = () => {
    const currentMode = isDarkMode() // Check if currently in dark mode
    setTheme(currentMode ? 'day' : 'night')
}

// Function to handle saving theme selection
const saveTheme = () => {
    const form = DOM.settings.form
    form.submit()
}

// Function to handle opening the theme selection overlay
const openThemeOverlay = () => {
    const overlay = DOM.settings.overlay
    overlay.style.display = 'block'
}

/**
 * Initializes the theme selection functionality.
 * Adds event listeners to theme selection buttons.
 */
const initializeThemeSelection = () => {
    const settingsButton = DOM.header.settings
    settingsButton.addEventListener('click', openThemeOverlay)

    const darkModeButton = DOM.settings.theme;
    darkModeButton.addEventListener('click', toggleDarkMode)

    const lightModeButton = DOM.settings.theme;
    lightModeButton.addEventListener('click', toggleDarkMode)

    const saveButton = document.querySelector('.overlay__button.overlay__button_primary')
    saveButton.addEventListener('click', () => {
        saveTheme()
        cancelSettings()
    })
}
initializeThemeSelection()

//----------------------------------------------------------------------------//
/**
 * Closes the search overlay when the cancel button is clicked.
 */
const cancelButton = () => {
        if (DOM.search.overlay.open === true) {
            DOM.search.overlay.open = false
        }
    }
    DOM.search.cancel.addEventListener('click', cancelButton)
    
/**
 * Closes the settings overlay when the cancel button is clicked.
 */
    const cancelSettings = () => {
        if (DOM.settings.overlay.open === true) {
            DOM.settings.overlay.open = false
        }
    }
    DOM.settings.cancel.addEventListener('click', cancelSettings)
    
/**
 * Closes the active book preview.
 */
    const closeList = () => {
        if (DOM.list.active.open === true) {
            DOM.list.active.open = false
        }
    }
    DOM.list.close.addEventListener('click', closeList)

//----------------------------------------------------------------------------//
/**
 * Displays the preview of a clicked book.
 * @param {Event} event - The click event object.
 */
    const bookPreview = (event) => {
        const pathArray = Array.from(event.path || event.composedPath())
        let active = null
    
        for (const node of pathArray) {
            if (node && node.dataset && node.dataset.preview) {
                const previewId = node.dataset.preview
            if (previewId) {
                active = books.find(book => book.id === previewId)
                break
            }}
        }
    
        if (!active) return
    
        DOM.list.active.open = true
        DOM.list.blur.value = active.image
        DOM.list.image.src = active.image
        DOM.list.title.textContent = active.title
        const authorName = authors[active.author]
        const publicationYear = new Date(active.published).getFullYear()
        DOM.list.subtitle.textContent = `${authorName} (${publicationYear})`
        DOM.list.description.textContent = active.description
    }
    DOM.list.items.addEventListener('click', bookPreview)
//---------------------...ooo000 END OF FILE 000ooo...------------------------//