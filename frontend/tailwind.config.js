import { Hono } from 'hono';
import router from './routes';

const app = new Hono();

app.use(router);

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
