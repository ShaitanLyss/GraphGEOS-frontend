import { Entity, PrimaryKey, Property, Collection, Unique, types, OneToMany } from "@mikro-orm/core"
import type { defaultEntities } from "@auth/mikro-orm-adapter"
import type { AdapterUser } from "@auth/core/adapters"

type RemoveIndex<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K]
}

export @Entity()
class User implements RemoveIndex<AdapterUser> {
    @PrimaryKey({type: types.string})
    id: string = crypto.randomUUID()

    @Property({ type: types.string, nullable: true })
    name?: string

    @Property({ type: types.string, nullable: true })
    @Unique()
    email: string = ""

    @Property({ type: types.datetime, nullable: true })
    emailVerified: Date | null = null

    @Property({ type: types.string, nullable: true })
    image?: string

    @OneToMany({
        entity: "Session",
        mappedBy: (session: defaultEntities.Session) => session.user,
        hidden: true,
        orphanRemoval: true,
    })
    sessions = new Collection<defaultEntities.Session, object>(this)

    @OneToMany({
        entity: "Account",
        mappedBy: (account: defaultEntities.Account) => account.user,
        hidden: true,
        orphanRemoval: true,
    })
    accounts = new Collection<defaultEntities.Account, object>(this)
}