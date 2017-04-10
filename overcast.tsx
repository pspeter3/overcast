/**
 * Framework
 */
function forceReload(): void {
    location.reload(true)
}

/**
 * UI
 */
const AppBar = (props: { updateReady?: boolean }): JSX.Element => {
    const upgrade = props.updateReady
        ? (
            <a class="upgrade icon" onClick={forceReload}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    { /* tslint:disable: max-line-length */}
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-1-6h-3V8h-2v5H8l4 4 4-4z" />
                    { /* tslint:enable: max-line-length */}
                </svg>
            </a>
        )
        : null
    return (
        <header>
            <a class="menu icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M2 13.5h14V12H2v1.5zm0-4h14V8H2v1.5zM2 4v1.5h14V4H2z" />
                </svg>
            </a>
            <span class="title">Overcast</span>
            {upgrade}
        </header>
    )
}

/**
 * Application
 */
interface AppState {
    updateReady?: boolean
}

class App extends preact.Component<{}, AppState> {
    public render(): JSX.Element {
        return <AppBar updateReady={this.state.updateReady} />
    }

    public componentWillMount(): void {
        applicationCache.addEventListener("updateready", this._onUpdateReady)
    }

    public componentWillUnmount(): void {
        applicationCache.addEventListener("updateready", this._onUpdateReady)
    }

    private _onUpdateReady = (): void => {
        this.setState({
            updateReady: applicationCache.status === applicationCache.UPDATEREADY,
        })
    }
}

/**
 * Init
 */
window.addEventListener("load", () => {
    preact.render(<App />, document.body)
})
