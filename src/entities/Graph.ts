import {
    Property,
    Unique,
    PrimaryKey,
    Entity,
    OneToMany,
    Collection,
    ManyToOne,
    types,
} from "@mikro-orm/core"
import { User } from "./User"

// class Graph(Base):
// __tablename__ = "graph"

// id = Column(Integer, primary_key = True, index = True)
// name = Column(String, unique = True, index = True)
// data = Column(String)
// description = Column(String)
// is_public = Column(Boolean, default=True)
// author_id = Column(String, ForeignKey("user.id"))

// author = relationship("User", back_populates = "graphs")

@Entity()
export class Graph {
    @PrimaryKey()
    id: string = crypto.randomUUID()

    @Property({ type: types.string, nullable: true })
    name?: string

    @Property({ type: types.string, nullable: true })
    data?: string

    @Property({ type: types.string, nullable: true })
    description?: string

    @Property({ type: types.boolean, default: true })
    is_public: boolean = true

    @ManyToOne(() => User, { nullable: true })
    author?: User







}