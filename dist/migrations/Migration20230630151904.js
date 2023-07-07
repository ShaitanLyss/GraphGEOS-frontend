import { Migration } from '@mikro-orm/migrations';
export class Migration20230630151904 extends Migration {
	async up() {
		this.addSql(
			'create table "user" ("id" varchar(255) not null, "name" varchar(255) null, "email" varchar(255) null, "emailVerified" timestamptz(0) null, "image" varchar(255) null, constraint "user_pkey" primary key ("id"));'
		);
		this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
		this.addSql(
			'create table "session" ("id" varchar(255) not null, "user" varchar(255) not null, "expires" timestamptz(0) not null, "sessionToken" varchar(255) not null, constraint "session_pkey" primary key ("id"));'
		);
		this.addSql(
			'alter table "session" add constraint "session_sessionToken_unique" unique ("sessionToken");'
		);
		this.addSql(
			'create table "account" ("id" varchar(255) not null, "user" varchar(255) not null, "type" varchar(255) not null, "provider" varchar(255) not null, "providerAccountId" varchar(255) not null, "refresh_token" varchar(255) null, "access_token" varchar(255) null, "expires_at" int null, "token_type" varchar(255) null, "scope" varchar(255) null, "id_token" text null, "session_state" varchar(255) null, constraint "account_pkey" primary key ("id"));'
		);
		this.addSql(
			'alter table "account" add constraint "account_provider_providerAccountId_unique" unique ("provider", "providerAccountId");'
		);
		this.addSql(
			'create table "verification-token" ("token" varchar(255) not null, "expires" timestamptz(0) not null, "identifier" varchar(255) not null, constraint "verification-token_pkey" primary key ("token"));'
		);
		this.addSql(
			'alter table "verification-token" add constraint "verification-token_token_identifier_unique" unique ("token", "identifier");'
		);
		this.addSql(
			'alter table "session" add constraint "session_user_foreign" foreign key ("user") references "user" ("id") on update cascade on delete cascade;'
		);
		this.addSql(
			'alter table "account" add constraint "account_user_foreign" foreign key ("user") references "user" ("id") on update cascade on delete cascade;'
		);
	}
}
//# sourceMappingURL=Migration20230630151904.js.map
