var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Property, PrimaryKey, Entity, ManyToOne, types, } from "@mikro-orm/core";
import { User } from "./User.js";
// class Graph(Base):
// __tablename__ = "graph"
// id = Column(Integer, primary_key = True, index = True)
// name = Column(String, unique = True, index = True)
// data = Column(String)
// description = Column(String)
// is_public = Column(Boolean, default=True)
// author_id = Column(String, ForeignKey("user.id"))
// author = relationship("User", back_populates = "graphs")
let Graph = class Graph {
    id = crypto.randomUUID();
    name;
    data;
    description;
    is_public = true;
    author;
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", String)
], Graph.prototype, "id", void 0);
__decorate([
    Property({ type: types.string, nullable: true }),
    __metadata("design:type", String)
], Graph.prototype, "name", void 0);
__decorate([
    Property({ type: types.string, nullable: true }),
    __metadata("design:type", String)
], Graph.prototype, "data", void 0);
__decorate([
    Property({ type: types.string, nullable: true }),
    __metadata("design:type", String)
], Graph.prototype, "description", void 0);
__decorate([
    Property({ type: types.boolean, default: true }),
    __metadata("design:type", Boolean)
], Graph.prototype, "is_public", void 0);
__decorate([
    ManyToOne(() => User, { nullable: true }),
    __metadata("design:type", User)
], Graph.prototype, "author", void 0);
Graph = __decorate([
    Entity()
], Graph);
export { Graph };
//# sourceMappingURL=Graph.js.map