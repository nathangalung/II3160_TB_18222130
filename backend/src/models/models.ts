import { integer, text, varchar } from 'drizzle-orm';

const User = db.define('User', {
    id: integer().primaryKey(),
    username: varchar(),
    email: text(),
});

export { User };
