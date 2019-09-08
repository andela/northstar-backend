import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({ Message: 'Welcome! This is the NorthStar Barefoot Nomad homepage' });
});

export default router;
