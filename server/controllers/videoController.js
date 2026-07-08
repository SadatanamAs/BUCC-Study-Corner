import Video from '../models/Video.js';

// @desc    Post a new video
// @route   POST /api/videos
// @access  Private/Admin
export const postVideo = async (req, res) => {
  const { title, youtubeId, category, tags } = req.body;

  if (!title || !youtubeId) {
    return res.status(400).json({ message: 'Please provide both title and YouTube video ID' });
  }

  try {
    const video = await Video.create({
      title,
      youtubeId,
      category: category || 'General',
      tags: tags || [],
      postedBy: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({})
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Update an existing video
// @route   PUT /api/videos/:id
// @access  Private/Admin
export const updateVideo = async (req, res) => {
  const { title, youtubeId, category, tags } = req.body;

  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update fields if provided in request
    video.title = title || video.title;
    video.youtubeId = youtubeId || video.youtubeId;
    video.category = category || video.category;
    if (tags !== undefined) {
      video.tags = tags;
    }

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.deleteOne();
    res.json({ message: 'Video removed successfully' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
