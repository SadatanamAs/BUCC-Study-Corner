import express from 'express';
import {
  postVideo,
  getVideos,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getVideos)
  .post(protect, admin, postVideo);

router.route('/:id')
  .put(protect, admin, updateVideo)
  .delete(protect, admin, deleteVideo);

export default router;
