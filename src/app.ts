import express from 'express';
import routerAuth from './routes/user.route';
import routerTache from './routes/tache.route';


const app = express();
app.use(express.json());
app.use("/api/v1/taches", routerTache)
app.use('/api/v1/auth', routerAuth);

export default app;