import express from 'express';
import cors from 'cors';

// Create global app object
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// App index
app.get('/', (req, res) => {
  res.status(200).json({ Message: 'Welcome! This is the NorthStar Barefoot Nomad homepage.' });
});

// catch 404 and forward to error handler
app.get('*', (req, res) => {
  res.status(404).json({ Message: 'Endpoint Not Found' });
});

// finally, let’s start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;
