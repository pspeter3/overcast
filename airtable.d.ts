declare namespace Airtable {
    export interface Error {
        readonly error: { readonly message: string }
    }

    export interface Record<T> {
        readonly createdTime: string
        readonly fields: T
        readonly id: string
    }

    export interface ListResponse<T extends Record<{}>> {
        records: T[]
    }

    export interface Collaborator {
        readonly email: string
        readonly id: string
        readonly name: string
    }

    export type AbilityId = string
    export interface AbilityFields {
        readonly Character?: CharacterId[]
        readonly Cost?: number
        readonly Name?: string
        readonly Notes?: string
        readonly Stat?: string
        readonly Type?: string
    }

    export type AdvancementId = string
    export interface AdvancementFields {
        readonly Character?: string[]
        readonly Edge?: boolean
        readonly Effort?: boolean
        readonly Other?: boolean
        readonly Skill?: boolean
        readonly Stats?: boolean
        readonly Tier?: number
    }

    export type ArmorId = string
    export interface ArmorFields {
        readonly Bonus?: string
        readonly Category?: string
        readonly Character?: CharacterId[]
        readonly Name?: string
    }

    export type AttackId = string
    export interface AttackFields {
        readonly Character?: CharacterId[]
        readonly Damage?: number
        readonly Distinction?: string
        readonly Name?: string
        readonly Notes?: string
        readonly Type?: string
    }

    export type CharacterId = string
    export interface CharacterFields {
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
    export interface CypherFields {
        readonly Character?: CharacterId[]
        readonly Effect?: string
        readonly Level?: number
        readonly Name?: string
    }

    export type EffectId = string
    export interface EffectFields {
        readonly Character?: CharacterId[]
        readonly ID?: string
        readonly Level?: string
        readonly Notes?: string
    }

    export type EquipmentId = string
    export interface EquipmentFields {
        readonly Character?: CharacterId[]
        readonly Name?: string
        readonly Notes?: string
    }

    export type SkillId = string
    export interface SkillFields {
        readonly Character?: CharacterId[]
        readonly Level?: string
        readonly Name?: string
        readonly Notes?: string
    }

    export type StatId = string
    export interface StatFields {
        readonly Character: CharacterId[]
        readonly Edge?: Number
        readonly ID?: string
        readonly Pool?: Number
        readonly Stat?: string
        readonly Value?: Number
    }
}
