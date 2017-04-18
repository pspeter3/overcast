/**
 * Framework
 */
const idom = IncrementalDOM

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
    const keyValue = attrs !== null
        ? attrs["key"]
        : undefined
    const key = keyValue !== undefined
        ? keyValue.toString()
        : keyValue
    idom.elementOpenStart(tag, key)
    if (attrs !== null) {
        Object.keys(attrs).forEach((attr) => {
            if (attr !== "key") {
                idom.attr(attr, attrs[attr])
            }
        })
    }
    idom.elementOpenEnd()
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

const ATTACK_TYPE = [
    "Melee",
    "Ranged",
]

const ATTACK_DISTINCTION = [
    "Crushing",
    "Reaching",
    "Slashing",
    "Stabbing",
]

const ARMOR_CATEGORY = [
    "Light",
    "Medium",
    "Heavy",
]

const SKILL_LEVEL = [
    "Inability",
    "Trained",
    "Specialized",
]

const ABILITY_TYPE = [
    "Action",
    "Enabler",
]

const STATS = [
    "Might",
    "Speed",
    "Intellect",
]

const BASE = "https://api.airtable.com/v0/app3twwgtlOjlzeLy"
const DATA_KEY = "$data"
const TOKEN_KEY = "$token"

/**
 * Handlers
 */
function toRecord<K extends string, V>(records: Record<K, V>, record: Airtable.RecordResponse<V>): Record<K, V> {
    records[(record.id as K)] = record.fields
    return records
}

function setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
    render()
}

function fetchTable<K extends string, V>(table: string): Promise<Record<K, V>> {
    const auth = token()
    if (auth === null) {
        return Promise.reject("Unauthenticated")
    }
    return fetch(`${BASE}/${table}`, {
        headers: {
            "Authorization": `Bearer ${auth}`,
        },
    }).then((response: Response): Promise<Record<K, V>> => {
        return response.json().then((value: Airtable.ListResponse<V> | Airtable.Error): Record<K, V> => {
            if (!response.ok) {
                throw new Error((value as Airtable.Error).error.message)
            }
            return (value as Airtable.ListResponse<V>).records.reduce((records, record) => {
                records[(record.id as K)] = record.fields
                return records
            }, ({} as Record<K, V>))
        })
    })
}

function upgrade(): void {
    applicationCache.swapCache()
    location.reload(true)
}

function authenticate(event: Event): void {
    event.preventDefault()
    const target = event.currentTarget as HTMLFormElement
    const input = target.querySelector("input")
    if (input) {
        setItem(TOKEN_KEY, input.value)
    }
}

function onError(err: Error): void {
    ERR = err.message
    render()
}

function fetchData(): void {
    Promise.all([
        fetchTable<Airtable.AbilityId, Airtable.Ability>("Abilities"),
        fetchTable<Airtable.AdvancementId, Airtable.Advancement>("Advancement"),
        fetchTable<Airtable.ArmorId, Airtable.Armor>("Armor"),
        fetchTable<Airtable.AttackId, Airtable.Attack>("Attacks"),
        fetchTable<Airtable.CharacterId, Airtable.Character>("Characters"),
        fetchTable<Airtable.CypherId, Airtable.Cypher>("Cyphers"),
        fetchTable<Airtable.EffectId, Airtable.Effect>("Effects"),
        fetchTable<Airtable.EquipmentId, Airtable.Equipment>("Equipment"),
        fetchTable<Airtable.SkillId, Airtable.Skill>("Skills"),
        fetchTable<Airtable.StatId, Airtable.Stat>("Stats"),
    ]).then((values: Airtable.TableList) => {
        const data: Airtable.Schema = {
            Abilities: values[0],
            Advancements: values[1],
            Armor: values[2],
            Attacks: values[3],
            Characters: values[4],
            Cyphers: values[5],
            Effects: values[6],
            Equipment: values[7],
            Skills: values[8],
            Stats: values[9],
        }
        setItem(DATA_KEY, JSON.stringify(data))
    }).catch(onError)
}

/**
 * State
 */
let ERR: string | null = null

function token(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

function data(): Airtable.Schema | null {
    const value = localStorage.getItem(DATA_KEY)
    return value === null
        ? value
        : JSON.parse(value)
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

interface CellProps {
    content?: boolean
}

const Cell = (props: CellProps, children: JSX.Node[]): JSX.Element => {
    return (
        <div class={`cell${props !== null && props.content ? " content" : ""}`}>
            {children}
        </div>
    )
}

const Label = ({ name }: { name: string }): JSX.Element => {
    return <label for={name}>{name}</label>
}

const TextField = (props: { name: string; label?: string } & CellProps & JSX.HTMLAttributes): JSX.Element => {
    const name = props.name
    const attrs = props.type
        ? props
        : { type: "text", ...props }
    return (
        <Cell content={props.content}>
            <input name={name} {...attrs} />
            <Label name={props.label || name} />
        </Cell>
    )
}

const Select = ({ name, options, value, content }: { name: string; options: string[]; value: string | undefined } & CellProps): JSX.Element => {
    return (
        <Cell content={content}>
            <select class={value} name={name}>
                { value ? empty : <option selected></option>}
                {
                    options.map((option, index) => {
                        const key = index.toString(16)
                        const selected = option === value
                        return selected
                            ? <option key={key} value={option} selected={selected}>{option}</option>
                            : <option key={key} value={option}>{option}</option>
                    })
                }
            </select>
            <Label name={name} />
        </Cell>
    )
}

const TextArea = ({ name, value }: { name: string; value?: string }): JSX.Element => {
    return (
        <Cell>
            <textarea name={name}>{value || ""}</textarea>
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

const Loading = (): JSX.Element => {
    return (
        <main class="loading">
            <div class="spinner" />
        </main>
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

const List = ({ store }: { store: Airtable.Schema }): JSX.Element => {
    const characters = store.Characters
    return (
        <main class="list">
            {Object.keys(characters).map((id) => {
                const character = characters[id]
                return <a class="item" href={`#${id}`}>{character.Name}</a>
            })}
        </main>
    )
}

interface CharacterStore {
    character: Airtable.Character
    store: Airtable.Schema
}

const Overview = ({ character }: { character: Airtable.Character }): JSX.Element => {
    return (
        <fieldset>
            <legend>Overview</legend>
            <Row>
                <TextField name="Name" value={character.Name} />
            </Row>
            <Row>
                <Select name="Descriptor" value={character.Descriptor} options={DESCRIPTORS} />
            </Row>
            <Row>
                <Select name="Flavor" value={character.Flavor} options={FLAVORS} />
                <Select name="Type" value={character.Type} options={TYPES} />
            </Row>
            <Row>
                <Select name="Focus" value={character.Focus} options={FOCI} />
            </Row>
        </fieldset>
    )
}

const Summary = ({ character }: { character: Airtable.Character }): JSX.Element => {
    return (
        <fieldset>
            <legend>Summary</legend>
            <Row>
                <TextField name="Effort" value={character.Effort} type="number" min="0" />
                <TextField name="Limit" value={character.Limit} type="number" min="0" />
                <TextField name="XP" value={character.XP} type="number" min="0" />
            </Row>
        </fieldset>
    )
}

const Stat = ({ stat }: { stat: Airtable.Stat }): JSX.Element => {
    return (
        <div class="column">
            <Row>
                <TextField name="Value" label={stat.Stat} value={stat.Value} type="number" min="0" max={stat.Pool} />
            </Row>
            <Row>
                <TextField name="Pool" value={stat.Pool} type="number" min="0" />
                <TextField name="Edge" value={stat.Edge} type="number" min="0" />
            </Row>
        </div>
    )
}

function statSortKey(stat?: string): number {
    switch (stat) {
        case "Might": return 0
        case "Speed": return 1
        case "Intellect": return 2
        default: return 3
    }
}

const Stats = ({ character, store }: CharacterStore): JSX.Element => {
    const ids = character.Stats.sort((left, right) => {
        return statSortKey(store.Stats[left].Stat) - statSortKey(store.Stats[right].Stat)
    })
    return (
        <fieldset>
            <legend>Stats</legend>
            <Row>
                {ids.map((id) => {
                    return <Stat stat={store.Stats[id]} />
                })}
            </Row>
        </fieldset>
    )
}

function effectSortKey(effect?: string): number {
    switch (effect) {
        case "Minor": return 0
        case "Major": return 1
        default: return 2
    }
}

const Effect = ({ effect }: { effect: Airtable.Effect }): JSX.Element => {
    return (
        <Row>
            <TextField name="Level" value={effect.Level} content/>
            <TextArea name="Notes" value={effect.Notes} />
        </Row>
    )
}

const Flavor = ({ character, store }: CharacterStore): JSX.Element => {
    const ids = character.Effects.sort((left, right) => {
        return effectSortKey(store.Effects[left].Level) - effectSortKey(store.Effects[right].Level)
    })
    return (
        <fieldset>
            <legend>Flavor</legend>
            <Row>
                <TextArea name="Notes" value={character.Notes} />
            </Row>
            {ids.map((id) => {
                return <Effect effect={store.Effects[id]} />
            })}
        </fieldset>
    )
}

const Attack = ({ attack }: { attack: Airtable.Attack }): JSX.Element => {
    return (
        <Row>
            <TextField name="Name" value={attack.Name} />
            <TextField name="Damage" value={attack.Damage} type="number" min="0" content />
            <Select name="Type" value={attack.Type} options={ATTACK_TYPE} content />
            <Select name="Distinction" value={attack.Distinction} options={ATTACK_DISTINCTION} content />
        </Row>
    )
}

const Attacks = ({ character, store }: CharacterStore): JSX.Element => {
    return (
        <fieldset>
            <legend>Attacks</legend>
            {character.Attacks.map((id) => {
                return <Attack attack={store.Attacks[id]} />
            })}
        </fieldset>
    )
}

const Armor = ({ armor }: { armor: Airtable.Armor }): JSX.Element => {
    return (
        <Row>
            <TextField name="Name" value={armor.Name} />
            <Select name="Category" value={armor.Category} options={ARMOR_CATEGORY} content />
            <TextField name="Bonus" value={armor.Bonus} type="number" disabled content />
        </Row>
    )
}

const Armors = ({ character, store }: CharacterStore): JSX.Element => {
    return (
        <fieldset>
            <legend>Armor</legend>
            {character.Armor.map((id) => {
                return <Armor armor={store.Armor[id]} />
            })}
        </fieldset>
    )
}

const Equipment = ({ equipment }: { equipment: Airtable.Equipment }): JSX.Element => {
    return (
        <Row>
            <TextField name="Name" value={equipment.Name} />
            <TextArea name="Notes" value={equipment.Notes} />
        </Row>
    )
}

const Equipments = ({ character, store }: CharacterStore): JSX.Element => {
    return (
        <fieldset>
            <legend>Equipment</legend>
            {character.Equipment.map((id) => {
                return <Equipment equipment={store.Equipment[id]} />
            })}
        </fieldset>
    )
}

const Skill = ({ skill }: { skill: Airtable.Skill }): JSX.Element => {
    return (
        <Row>
            <TextField name="Name" value={skill.Name} />
            <Select name="Level" value={skill.Level} options={SKILL_LEVEL} content />
        </Row>
    )
}

const Skills = ({ character, store }: CharacterStore): JSX.Element => {
    return (
        <fieldset>
            <legend>Skills</legend>
            {character.Skills.map((id) => {
                return <Skill skill={store.Skills[id]} />
            })}
        </fieldset>
    )
}

const Ability = ({ ability }: { ability: Airtable.Ability }): JSX.Element => {
    return (
        <Row>
            <TextField name="Name" value={ability.Name} />
            <Select name="Type" value={ability.Type} options={ABILITY_TYPE} content />
            <Select name="Stat" value={ability.Stat} options={STATS} content />
            <TextField name="Cost" value={ability.Cost} type="number" content />
            <TextArea name="Notes" value={ability.Notes} />
        </Row>
    )
}

const Abilities = ({ character, store }: CharacterStore): JSX.Element => {
    return (
        <fieldset>
            <legend>Abilities</legend>
            {character.Abilities.map((id) => {
                return <Ability ability={store.Abilities[id]} />
            })}
        </fieldset>
    )
}

const Cypher = ({ cypher }: { cypher: Airtable.Cypher }): JSX.Element => {
    return (
        <Row>
            <TextField name="Name" value={cypher.Name} />
            <TextField name="Level" value={cypher.Level} type="number" content />
            <TextArea name="Effect" value={cypher.Effect} />
        </Row>
    )
}

const Cyphers = ({ character, store }: CharacterStore): JSX.Element => {
    return (
        <fieldset>
            <legend>Cyphers</legend>
            {character.Cyphers.map((id) => {
                return <Cypher cypher={store.Cyphers[id]} />
            })}
        </fieldset>
    )
}

const Maybe = (props: { factory: (props: CharacterStore) => void; ids?: string[] } & CharacterStore): JSX.Element => {
    return props.ids && props.ids.length > 0
        ? <props.factory character={props.character} store={props.store} />
        : empty
}

const Character = ({ id, store }: { id: string; store: Airtable.Schema }): JSX.Element => {
    const character = store.Characters[id]
    return (
        <main class="character">
            <section>
                <Overview character={character} />
                <Summary character={character} />
                <Stats character={character} store={store} />
                <Flavor character={character} store={store}/>
            </section>
            <section>
                <Maybe ids={character.Attacks} factory={Attacks} character={character} store={store} />
                <Maybe ids={character.Armor} factory={Armors} character={character} store={store} />
                <Maybe ids={character.Equipment} factory={Equipments} character={character} store={store} />
            </section>
            <section>
                <Maybe ids={character.Abilities} factory={Abilities} character={character} store={store} />
                <Maybe ids={character.Skills} factory={Skills} character={character} store={store} />
                <Maybe ids={character.Cyphers} factory={Cyphers} character={character} store={store} />
            </section>
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
    const store = data()
    if (store === null) {
        return <Loading />
    }
    if (ERR !== null) {
        return <Err />
    }
    const hash = location.hash.substr(1)
    if (hash.length === 0) {
        return <List store={store} />
    }
    return <Character id={hash} store={store} />
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
window.addEventListener("load", fetchData)
applicationCache.addEventListener("updateready", render)
window.addEventListener("hashchange", render)
window.addEventListener("storage", render)
