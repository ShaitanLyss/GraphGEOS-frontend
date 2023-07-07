var __decorate =
	(this && this.__decorate) ||
	function (decorators, target, key, desc) {
		var c = arguments.length,
			r =
				c < 3
					? target
					: desc === null
					? (desc = Object.getOwnPropertyDescriptor(target, key))
					: desc,
			d;
		if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
			r = Reflect.decorate(decorators, target, key, desc);
		else
			for (var i = decorators.length - 1; i >= 0; i--)
				if ((d = decorators[i]))
					r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
var __metadata =
	(this && this.__metadata) ||
	function (k, v) {
		if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
			return Reflect.metadata(k, v);
	};
import {
	Entity,
	PrimaryKey,
	Property,
	Collection,
	Unique,
	types,
	OneToMany
} from '@mikro-orm/core';
let User = class User {
	id = crypto.randomUUID();
	name;
	email = '';
	emailVerified = null;
	image;
	sessions = new Collection(this);
	accounts = new Collection(this);
};
__decorate([PrimaryKey(), __metadata('design:type', String)], User.prototype, 'id', void 0);
__decorate(
	[Property({ type: types.string, nullable: true }), __metadata('design:type', String)],
	User.prototype,
	'name',
	void 0
);
__decorate(
	[Property({ type: types.string, nullable: true }), Unique(), __metadata('design:type', String)],
	User.prototype,
	'email',
	void 0
);
__decorate(
	[Property({ type: types.datetime, nullable: true }), __metadata('design:type', Object)],
	User.prototype,
	'emailVerified',
	void 0
);
__decorate(
	[Property({ type: types.string, nullable: true }), __metadata('design:type', String)],
	User.prototype,
	'image',
	void 0
);
__decorate(
	[
		OneToMany({
			entity: 'Session',
			mappedBy: (session) => session.user,
			hidden: true,
			orphanRemoval: true
		}),
		__metadata('design:type', Object)
	],
	User.prototype,
	'sessions',
	void 0
);
__decorate(
	[
		OneToMany({
			entity: 'Account',
			mappedBy: (account) => account.user,
			hidden: true,
			orphanRemoval: true
		}),
		__metadata('design:type', Object)
	],
	User.prototype,
	'accounts',
	void 0
);
User = __decorate([Entity()], User);
export { User };
//# sourceMappingURL=User.js.map
