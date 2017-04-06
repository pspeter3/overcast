/**
 * UI
 */
const appbar = (
    <header>
        <a class="menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M2 13.5h14V12H2v1.5zm0-4h14V8H2v1.5zM2 4v1.5h14V4H2z" />
            </svg>
        </a>
        <span class="title">Overcast</span>
    </header>
)

/**
 * Init
 */
window.addEventListener("load", () => {
    preact.render(appbar, document.body)
})
