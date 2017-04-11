/**
 * Framework
 */
type Maybe<T> = T | null

interface AirtableErrorResponse {
    readonly error: { readonly message: string }
}

interface AirtableRecord<T> {
    readonly id: string
    readonly fields: T
    readonly createdTime: string
}

interface AirtableListResponse<T extends AirtableRecord<{}>> {
    records: T[]
}

interface CharacterNameRecord extends AirtableRecord<{ readonly Name: String }> { }
interface CharacterListResponse extends AirtableListResponse<CharacterNameRecord> { }

const AIRTABLE = "https://api.airtable.com/v0"
const TOKEN_KEY = "$token"

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
            <span class="title">Overcast</span>
            {upgrade}
        </header>
    )
}

const Login = (props: { authenticate: EventListener }): JSX.Element => {
    return (
        <form onSubmit={props.authenticate}>
            <fieldset>
                <div class="cell">
                    <input type="password" name="token" required inputMode="verbatim" autofocus />
                    <label for="token">Token</label>
                </div>
                <div class="cell">
                    <button type="submit">Authenticate</button>
                </div>
            </fieldset>
        </form>
    )
}

const Err = (props: { message: string }): JSX.Element => {
    return (
        <main class="error">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <path d="M24 4C12.96 4 4 12.95 4 24s8.96 20 20 20 20-8.95 20-20S35.04 4 24 4zm2 30h-4v-4h4v4zm0-8h-4V14h4v12z" />
            </svg>
            <p>{props.message}</p>
        </main>
    )
}

const Loading = (): JSX.Element => {
    return (
        <main class="loading">
            <div class="spinner" />
        </main>
    )
}

const ListItem = ({ record }: { key: string; record: CharacterNameRecord }): JSX.Element => {
    return (
        <a class="item" href={`#${record.id}`}>{record.fields.Name}</a>
    )
}

/**
 * Character List
 */
interface ListProps {
    readonly base: string
    readonly token: string
}

interface ListState {
    readonly error?: string
    readonly characters?: CharacterNameRecord[]
}

class List extends preact.Component<ListProps, ListState> {
    public render(_: ListProps, state: ListState): JSX.Element {
        if (state.error) {
            return <Err message={state.error} />
        }
        if (state.characters) {
            return (
                <main class="list">
                    {state.characters.map((c) => <ListItem key={c.id} record={c} />)}
                </main>
            )
        }
        return <Loading />
    }

    public componentWillMount(): void {
        const url = `${AIRTABLE}/${this.props.base}/Characters?fields[]=Name`
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${this.props.token}`,
            },
        }).then((response) => {
            return response.json().then((value: CharacterListResponse | AirtableErrorResponse) => {
                if (response.ok) {
                    this.setState({
                        characters: (value as CharacterListResponse).records,
                    })
                } else {
                    this.setState({
                        error: (value as AirtableErrorResponse).error.message,
                    })
                }

            })

        })
    }
}

/**
 * Application
 */
interface AppProps {
    readonly query: Record<string, string>
}

interface AppState {
    readonly token: Maybe<string>
    readonly updateReady?: boolean
}

class App extends preact.Component<AppProps, AppState> {
    public state: AppState = {
        token: this._token(),
    }

    public render(): JSX.Element {
        return (
            <div class="app">
                <AppBar updateReady={this.state.updateReady} />
                {this._main()}
            </div>
        )
    }

    public componentWillMount(): void {
        applicationCache.addEventListener("updateready", this._onUpdateReady)
        window.addEventListener("storage", this._setToken)
    }

    public componentWillUnmount(): void {
        applicationCache.removeEventListener("updateready", this._onUpdateReady)
        window.removeEventListener("storage", this._setToken)
    }

    private _authenticate = (evt: Event): void => {
        evt.preventDefault()
        const target = evt.currentTarget as HTMLFormElement
        const input = target.querySelector("input")
        if (input) {
            localStorage.setItem(TOKEN_KEY, input.value)
            this._setToken()
        }
    }

    private _setToken = (): void => {
        this.setState({
            token: this._token(),
        })
    }

    private _onUpdateReady = (): void => {
        this.setState({
            updateReady: applicationCache.status === applicationCache.UPDATEREADY,
        })
    }

    private _base(): Maybe<string> {
        return this.props.query["base"] || null
    }

    private _token(): Maybe<string> {
        return localStorage.getItem(TOKEN_KEY)
    }

    private _main(): JSX.Element {
        const base = this._base()
        const token = this.state.token
        if (token === null) {
            return <Login authenticate={this._authenticate} />
        }
        if (base === null) {
            return <Err message="Base is required in querystring" />
        }
        return <List base={base} token={token} />
    }
}

/**
 * Init
 */
window.addEventListener("load", () => {
    const query = window.location.search.substring(1).split("&").reduce((q, segment) => {
        const pair = segment.split("=")
        q[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
        return q
    }, {} as Record<string, string>)
    preact.render(<App query={query} />, document.body)
})
