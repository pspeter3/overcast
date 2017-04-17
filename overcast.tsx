/**
 * Framework
 */
const idom = IncrementalDOM

function toStatics(attrs: JSX.HTMLAttributes | null): JSX.Primitive[] {
    if (attrs === null) {
        return []
    }
    return Object.keys(attrs).reduce((statics, key) => {
        statics.push(key, attrs[key])
        return statics
    }, [] as JSX.Primitive[])
}

function renderNode(node: JSX.Node): void {
    if (typeof node === "string") {
        idom.text(node)
    } else if (Array.isArray(node)) {
        node.forEach(renderNode)
    } else {
        node()
    }
}

function renderDomElement(tag: string, attrs: JSX.HTMLAttributes | null, children: JSX.Node[]): void {
    idom.elementOpen(tag, undefined, toStatics(attrs))
    children.forEach(renderNode)
    idom.elementClose(tag)
}

function createElement<P>(factory: JSX.Factory<P>, attrs: P | JSX.HTMLAttributes | null, ...children: JSX.Node[]): JSX.Element {
    if (typeof factory === "string") {
        return () => {
            renderDomElement(factory, attrs as JSX.HTMLAttributes, children)
        }
    }
    return factory(attrs as P, children)
}

function empty(): void {
    return undefined
}

/**
 * Constants
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
    "Weird",
]

const FLAVORS = [
    "Stealth",
    "Technology",
    "Combat",
    "Skills and Knowledge",
]

const TYPES = [
    "Warrior",
    "Adept",
    "Explorer",
    "Speaker",
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
    "Would Rather Be Reading",
]

const BASE = "app3twwgtlOjlzeLy"
const DATA_KEY = "$data"
const TOKEN_KEY = "$token"

/**
 * Handlers
 */
function setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
    render()
}

function authenticate(event: Event): void {
    event.preventDefault()
    const target = event.currentTarget as HTMLFormElement
    const input = target.querySelector("input")
    if (input) {
        setItem(TOKEN_KEY, input.value)
    }
}

function upgrade(): void {
    applicationCache.swapCache()
    location.reload(true)
}

/**
 * State
 */
let ERR: string | null = null

function token(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

function data(): string | null {
    return localStorage.getItem(DATA_KEY)
}

/**
 * UI
 */
const Row = (_: {}, children: JSX.Node[]): JSX.Element => {
    return (
        <div class="row">
            {children}
        </div>
    )
}

const Cell = (_: {}, children: JSX.Node[]): JSX.Element => {
    return (
        <div class="cell">
            {children}
        </div>
    )
}

const Label = ({ name }: { name: string }): JSX.Element => {
    return <label for={name}>{name}</label>
}

const TextField = (props: { name: string } & JSX.HTMLAttributes): JSX.Element => {
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

const TextArea = ({ name, value }: { name: string } & JSX.HTMLAttributes): JSX.Element => {
    return (
        <Cell>
            <textarea name={name} value={value} />
            <Label name={name} />
        </Cell>
    )
}

const AppBar = (): JSX.Element => {
    return (
        <header>
            <a class="title" href="#">Overcast</a>
        </header>
    )
}

const Upgrade = (): JSX.Element => {
    return (
        <main class="upgrade" onclick={upgrade}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-1-6h-3V8h-2v5H8l4 4 4-4z" />
            </svg>
            <p>Upgrade Available</p>
        </main>
    )
}

const Login = (): JSX.Element => {
    return (
        <form onsubmit={authenticate}>
            <fieldset>
                <Row>
                    <TextField name="Token" type="password" required inputMode="verbatim" autofocus />
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

const Err = (): JSX.Element => {
    return (
        <main class="error">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <path d="M24 4C12.96 4 4 12.95 4 24s8.96 20 20 20 20-8.95 20-20S35.04 4 24 4zm2 30h-4v-4h4v4zm0-8h-4V14h4v12z" />
            </svg>
            <p>{ERR}</p>
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

const Main = (): JSX.Element => {
    if (applicationCache.status === applicationCache.UPDATEREADY) {
        return <Upgrade />
    }
    if (token() === null) {
        return <Login />
    }
    if (data() === null) {
        return <Loading />
    }
    if (ERR !== null) {
        return <Err />
    }
    return (<p>Overcast</p>)
}

const App = (): JSX.Element => {
    return (
        <div class="app">
            <AppBar />
            <Main />
        </div>
    )
}

/**
 * Setup
 */
function patch(): void {
    idom.patch(document.body, <App />)
}

function render(): void {
    window.requestAnimationFrame(patch)
}

window.addEventListener("load", render)
applicationCache.addEventListener("updateready", render)
window.addEventListener("hashchange", render)
window.addEventListener("storage", render)
