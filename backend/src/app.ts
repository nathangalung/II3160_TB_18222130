import { Hono } from 'hono';
import { fetch } from 'undici'; // Hono needs this

const app = new Hono();

app.get('/', (c) => {
    return c.json({ message: 'Hello, World!' });
});

export default app;
