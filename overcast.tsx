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
 * Schema
 */
const DESCRIPTORS = [
    "Appealing",
    "Brash",
    "Calm",
    "Charming",
    "Clever",
    "Clumsy",
    "Craven",
    "Creative",
    "Cruel",
    "Dishonorable",
    "Doomed",
    "Driven",
    "Empathic",
    "Exiled",
    "Fast",
    "Foolish",
    "Graceful",
    "Guarded",
    "Hardy",
    "Hideous",
    "Honorable",
    "Impulsive",
    "Inquisitive",
    "Intelligent",
    "Jovial",
    "Kind",
    "Learned",
    "Lucky",
    "Mad",
    "Mechanical",
    "Mysterious",
    "Mystical",
    "Naive",
    "Noble",
    "Perceptive",
    "Resilient",
    "Rugged",
    "Sharp-Eyed",
    "Skeptical",
    "Spiritual",
    "Stealthy",
    "Strong",
    "Strong-Willed",
    "Swift",
    "Tongue-Tied",
    "Tough",
    "Vengeful",
    "Virtuous",
    "Wealthy",
    "Weird"
]

const FLAVORS = [
    "Stealth",
    "Technology",
    "Combat",
    "Skills and Knowledge"
]

const TYPES = [
    "Warrior",
    "Adept",
    "Explorer",
    "Speaker"
]

const FOCI = [
    "Abides in Stone",
    "Battles Robots",
    "Bears a Halo of Fire",
    "Blazes with Radiance",
    "Builds Robots",
    "Calculates the Incalculable",
    "Carries a Quiver",
    "Commands Mental Powers",
    "Conducts Weird Science",
    "Consorts With the Dead",
    "Controls Gravity",
    "Crafts Unique Objects",
    "Defends the Weak",
    "Doesn't Do Much",
    "Employs Magnetism",
    "Exists Partially Out of Phase",
    "Exists in Two Places at Once",
    "Explores Dark Places",
    "Explores Deep Waters",
    "Fights Dirty",
    "Fights With Panache",
    "Focuses Mind Over Matter",
    "Fuses Flesh and Steel",
    "Fuses Mind and Machine",
    "Grows to Towering Heights",
    "Hunts With Great Skill",
    "Infiltrates",
    "Interprets the Law",
    "Is Idolized by Millions",
    "Is Licensed to Carry",
    "Leads",
    "Lives in the Wilderness",
    "Looks for Trouble",
    "Masters Defense",
    "Masters Weaponry",
    "Masters the Swarm",
    "Metes Out Justice",
    "Moves Like a Cat",
    "Moves Like the Wind",
    "Murders",
    "Needs No Weapon",
    "Never Says Die",
    "Operates Undercover",
    "Performs Feats of Strength",
    "Rages",
    "Rides the Lightning",
    "Sees Beyond",
    "Separates Mind From Body",
    "Siphons Power",
    "Slays Monster",
    "Solves Mysteries",
    "Stands Like a Bastion",
    "Talks to Machines",
    "Throws With Deadly Accuracy",
    "Travels Through Time",
    "Wears a Sheen of Ice",
    "Wields Two Weapons at Once",
    "Works the Back Alleys",
    "Works the System",
    "Would Rather Be Reading"
]

/**
 * UI
 */
const Row = ({ children }: { children?: JSX.Element[] }): JSX.Element => {
    return (
        <div class="row">
            {children}
        </div>
    )
}

const Cell = ({ children }: { children?: JSX.Element[] }): JSX.Element => {
    return (
        <div class="cell">
            {children}
        </div>
    )
}

const Label = ({ name }: { name: string }): JSX.Element => {
    return <label for={name}>{name}</label>
}


const TextField = (props: { name: string; } & JSX.HTMLAttributes): JSX.Element => {
    const name = props.name
    const attrs = props.type
        ? props
        : { type: "text", ...props }
    return (
        <Cell>
            <input name={name} {...attrs} />
            <Label name={name} />
        </Cell>
    )
}

const Select = ({ name, options, value }: { name: string; options: string[]; value: string }): JSX.Element => {
    return (
        <Cell>
            <select name={name}>
                {
                    options.map((option, index) => {
                        const key = index.toString(16)
                        const selected = option === value
                        return <option key={key} value={option} selected={selected}>{option}</option>
                    })
                }
            </select>
            <Label name={name} />
        </Cell>
    )
}

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
                <Row>
                    <TextField name="token" type="password" required inputMode="verbatim" autofocus />
                </Row>
                <Row>
                    <Cell>
                        <button type="submit">Authenticate</button>
                    </Cell>
                </Row>
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

/**
 * Character Sheet
 */
interface CharacterProps {
    readonly base: string
    readonly id: string
    readonly token: string
}

interface CharacterState { }

class Character extends preact.Component<CharacterProps, CharacterState> {
    public render(_: CharacterProps, __: CharacterState): JSX.Element {
        return (
            <main class="character">
                <fieldset>
                    <Row>
                        <TextField name="name" value="" />
                    </Row>
                    <Row>
                        <Select name="descriptor" value="" options={DESCRIPTORS} />
                    </Row>
                    <Row>
                        <Select name="flavor" value="" options={FLAVORS} />
                        <Select name="type" value="" options={TYPES} />
                    </Row>
                    <Row>
                        <Select name="focus" value="" options={FOCI} />
                    </Row>
                </fieldset>
            </main>
        )
    }
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
                    {state.characters.map((c) => {
                        return <a class="item" href={`#${c.id}`}>{c.fields.Name}</a>
                    })}
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
    readonly hash: string
    readonly token: Maybe<string>
    readonly updateReady?: boolean
}

class App extends preact.Component<AppProps, AppState> {
    public state: AppState = {
        hash: this._hash(),
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
        applicationCache.addEventListener("updateready", this._updateState)
        window.addEventListener("hashchange", this._updateState)
        window.addEventListener("storage", this._updateState)
    }

    public componentWillUnmount(): void {
        applicationCache.removeEventListener("updateready", this._updateState)
        window.removeEventListener("hashchange", this._updateState)
        window.removeEventListener("storage", this._updateState)
    }

    private _authenticate = (evt: Event): void => {
        evt.preventDefault()
        const target = evt.currentTarget as HTMLFormElement
        const input = target.querySelector("input")
        if (input) {
            localStorage.setItem(TOKEN_KEY, input.value)
            this._updateState()
        }
    }

    private _updateState = (): void => {
        this.setState({
            hash: this._hash(),
            token: this._token(),
            updateReady: applicationCache.status === applicationCache.UPDATEREADY,
        })
    }

    private _base(): Maybe<string> {
        return this.props.query["base"] || null
    }

    private _token(): Maybe<string> {
        return localStorage.getItem(TOKEN_KEY)
    }

    private _hash(): string {
        return window.location.hash.substring(1)
    }

    private _main(): JSX.Element {
        const base = this._base()
        const token = this.state.token
        const hash = this.state.hash
        if (token === null) {
            return <Login authenticate={this._authenticate} />
        }
        if (base === null) {
            return <Err message="Base is required in querystring" />
        }
        if (hash.length === 0) {
            return <List base={base} token={token} />
        }
        return <Character base={base} id={hash} token={token} />
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
