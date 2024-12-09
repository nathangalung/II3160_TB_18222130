import { Hono } from 'hono';
import { User } from '../models/user';
import db from '../database';

const router = new Hono();

// Route to fetch users
router.get('/users', async (c) => {
    const users = await db.select().from(User);
    return c.json(users);
});

export default router;
