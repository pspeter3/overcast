declare namespace Airtable {
    export interface Error {
        readonly error: { readonly message: string }
    }

    export interface RecordResponse<T> {
        readonly createdTime: string
        readonly fields: T
        readonly id: string
    }

    export interface ListResponse<T> {
        records: RecordResponse<T>[]
    }

    export interface Collaborator {
        readonly email: string
        readonly id: string
        readonly name: string
    }

    export type AbilityId = string
    export type Abilities = Record<AbilityId, Ability>
    export interface Ability {
        readonly Character?: CharacterId[]
        readonly Cost?: number
        readonly Name?: string
        readonly Notes?: string
        readonly Stat?: string
        readonly Type?: string
    }

    export type AdvancementId = string
    export type Advancements = Record<AdvancementId, Advancement>
    export interface Advancement {
        readonly Character?: string[]
        readonly Edge?: boolean
        readonly Effort?: boolean
        readonly Other?: boolean
        readonly Skill?: boolean
        readonly Stats?: boolean
        readonly Tier?: number
    }

    export type ArmorId = string
    export type Armors = Record<ArmorId, Armor>
    export interface Armor {
        readonly Bonus?: string
        readonly Category?: string
        readonly Character?: CharacterId[]
        readonly Name?: string
    }

    export type AttackId = string
    export type Attacks = Record<AttackId, Attack>
    export interface Attack {
        readonly Character?: CharacterId[]
        readonly Damage?: number
        readonly Distinction?: string
        readonly Name?: string
        readonly Notes?: string
        readonly Type?: string
    }

    export type CharacterId = string
    export type Characters = Record<CharacterId, Character>
    export interface Character {
        readonly Abilities: AbilityId[]
        readonly Advancement: AdvancementId[]
        readonly Armor: ArmorId[]
        readonly Attacks: AttackId[]
        readonly Cyphers: CypherId[]
        readonly Descriptor?: string
        readonly Effects: EffectId[]
        readonly Effort?: number
        readonly Equipment: EquipmentId[]
        readonly Flavor?: string
        readonly Focus?: string
        readonly Limit?: number
        readonly Name?: string
        readonly Notes?: string
        readonly Player?: Collaborator
        readonly Refresh?: string[]
        readonly Skills: SkillId[]
        readonly Stats: StatId[]
        readonly Type?: string
        readonly XP?: number
    }

    export type CypherId = string
    export type Cyphers = Record<CypherId, Cypher>
    export interface Cypher {
        readonly Character?: CharacterId[]
        readonly Effect?: string
        readonly Level?: number
        readonly Name?: string
    }

    export type EffectId = string
    export type Effects = Record<EffectId, Effect>
    export interface Effect {
        readonly Character?: CharacterId[]
        readonly ID?: string
        readonly Level?: string
        readonly Notes?: string
    }

    export type EquipmentId = string
    export type Equipments = Record<EquipmentId, Equipment>
    export interface Equipment {
        readonly Character?: CharacterId[]
        readonly Name?: string
        readonly Notes?: string
    }

    export type SkillId = string
    export type Skills = Record<SkillId, Skill>
    export interface Skill {
        readonly Character?: CharacterId[]
        readonly Level?: string
        readonly Name?: string
    }

    export type StatId = string
    export type Stats = Record<StatId, Stat>
    export interface Stat {
        readonly Character: CharacterId[]
        readonly Edge?: number
        readonly ID?: string
        readonly Pool?: number
        readonly Stat?: string
        readonly Value?: number
    }

    export interface Schema {
        Abilities: Abilities
        Advancements: Advancements
        Armor: Armors
        Attacks: Attacks
        Characters: Characters
        Cyphers: Cyphers
        Effects: Effects
        Equipment: Equipments
        Skills: Skills
        Stats: Stats
    }

    export type TableList = [
        Abilities,
        Advancements,
        Armors,
        Attacks,
        Characters,
        Cyphers,
        Effects,
        Equipments,
        Skills,
        Stats
    ]
}
