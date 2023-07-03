import { Migration } from '@mikro-orm/migrations';
export class Migration20230630154840_AddGraph extends Migration {
    async up() {
        this.addSql('create table "graph" ("id" varchar(255) not null, "name" varchar(255) null, "data" varchar(255) null, "description" varchar(255) null, "is_public" boolean not null default true, "author" varchar(255) null, constraint "graph_pkey" primary key ("id"));');
        this.addSql('alter table "graph" add constraint "graph_author_foreign" foreign key ("author") references "user" ("id") on update cascade on delete set null;');
    }
    async down() {
        this.addSql('drop table if exists "graph" cascade;');
    }
}
//# sourceMappingURL=Migration20230630154840_AddGraph.js.map