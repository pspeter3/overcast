/**
 * Framework
 */
type Maybe<T> = T | null

const AUTH_KEY = "$auth"

interface Authentication {
    readonly base: string
    readonly token: string
}

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
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-1-6h-3V8h-2v5H8l4 4 4-4z" />
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

const Login = (props: {authenticate: EventListener}): JSX.Element => {
    return (
        <form onSubmit={props.authenticate}>
            <fieldset>
                <div class="cell">
                    <input type="url" name="base" required placeholder="https://api.airtable.com/v0/" autocomplete="url" autofocus />
                    <label for="base">Base</label>
                </div>
                <div class="cell">
                    <input type="text" name="token" required inputMode="verbatim" />
                    <label for="token">Token</label>
                </div>
                <div class="cell">
                    <button type="submit">Authenticate</button>
                </div>
            </fieldset>
        </form>
    )
}

/**
 * Application
 */
interface AppState {
    readonly auth: Maybe<Authentication>
    readonly updateReady?: boolean
}

class App extends preact.Component<{}, AppState> {
    public state: AppState = {
        auth: this._auth(),
    }

    public render(): JSX.Element {
        const main = this.state.auth === null
            ? <Login authenticate={this._authenticate}/>
            : <pre>{this.state.auth.base}</pre>
        return (
            <div class="app">
                <AppBar updateReady={this.state.updateReady} />
                <main>
                    {main}
                </main>
            </div>
        )
    }

    public componentWillMount(): void {
        applicationCache.addEventListener("updateready", this._onUpdateReady)
        window.addEventListener("storage", this._onStorage)
    }

    public componentWillUnmount(): void {
        applicationCache.removeEventListener("updateready", this._onUpdateReady)
        window.removeEventListener("storage", this._onStorage)
    }

    private _authenticate = (evt: Event): void => {
        evt.preventDefault()
        const target = evt.currentTarget as HTMLFormElement
        const inputs = Array.prototype.slice.call(target.querySelectorAll("input"))
        const values = inputs.reduce((acc: Record<string, string>, node: HTMLInputElement): Record<string, string> => {
            acc[node.name] = node.value
            return acc
        }, {} as Record<string, string>)
        localStorage.setItem(AUTH_KEY, JSON.stringify(values))
        this._onStorage()
    }

    private _onStorage = (): void => {
        this.setState({
            auth: this._auth(),
        })
    }

    private _onUpdateReady = (): void => {
        this.setState({
            updateReady: applicationCache.status === applicationCache.UPDATEREADY,
        })
    }

    private _auth(): Maybe<Authentication> {
        const value = localStorage.getItem(AUTH_KEY)
        return typeof value === "string"
            ? JSON.parse(value)
            : value
    }
}

/**
 * Init
 */
window.addEventListener("load", () => {
    preact.render(<App />, document.body)
})
