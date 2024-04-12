/**
 * Object representing color values for day mode.
 * @typedef {Object} DayColors
 * @property {string} dark - Dark color values in RGB format.
 * @property {string} light - Light color values in RGB format.
 */
const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}
/**
 * Object representing color values for night mode.
 * @typedef {Object} NightColors
 * @property {string} dark - Dark color values in RGB format.
 * @property {string} light - Light color values in RGB format.
 */
const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}
//----------------------------------------------------------------------------//
//Fragment for authors
export const createAuthorsFragment = document.createDocumentFragment()
//Fragment for genres
export const createGenresFragment = document.createDocumentFragment()
//Fragment for book previews
export const createPreviewsFragment = document.createDocumentFragment()
//----------------------------------------------------------------------------//
//Object containing DOM elements
export const DOM = {
    list: {
        items: document.querySelector('[data-list-items]'),
        title: document.querySelector('[data-list-title]'),
        subtitle: document.querySelector('[data-list-subtitle]'),
        description: document.querySelector('[data-list-description]'),
        image: document.querySelector('[data-list-image]'),
        blur: document.querySelector('[data-list-blur]'),
        message: document.querySelector('[data-list-message]'),
        button: document.querySelector('[data-list-button]'),
        active: document.querySelector('[data-list-active]'),
        close: document.querySelector('[data-list-close]'),
},

header: {
        search: document.querySelector('[data-header-search]'),
        settings: document.querySelector('[data-header-settings]')
},

search: {
        title: document.querySelector('[data-search-title]'),
        overlay: document.querySelector('[data-search-overlay]'),
        form: document.querySelector('[data-search-form]'),
        genres: document.querySelector('[data-search-genres]'),
        authors: document.querySelector('[data-search-authors]'),
        cancel: document.querySelector('[data-search-cancel]'),
},
settings: {
        theme: document.querySelector('[data-settings-theme]'),
        cancel: document.querySelector('[data-settings-cancel]'),
        form: document.querySelector('[data-settings-form]'),
        overlay: document.querySelector('[data-settings-overlay]'),
}
}

//----------------------------------------------------------------------------//
/**
 * Sets the theme (day or night) by updating CSS variables.
 * @param {string} mode - Theme mode ('day' or 'night').
 */
export const setTheme = (mode) => {
    const root = document.documentElement
    const colors = mode === 'night' ? night : day

    root.style.setProperty('--color-dark', `rgb(${colors.dark})`)
    root.style.setProperty('--color-light', `rgb(${colors.light})`)
}

//----------------------------------------------------------------------------//
/**
 * Checks if the system prefers dark mode.
 * @returns {boolean} - Indicates whether dark mode is preferred by the system.
 */
export const isDarkMode = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}
//---------------------...ooo000 END OF FILE 000ooo...------------------------//