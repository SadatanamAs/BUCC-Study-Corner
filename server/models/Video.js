import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a video title'],
      trim: true,
    },
    youtubeId: {
      type: String,
      required: [true, 'Please add a YouTube video ID'],
      trim: true,
      match: [
        /^[a-zA-Z0-9_-]{11}$/,
        'Please add a valid 11-character YouTube video ID',
      ],
    },
    category: {
      type: String,
      required: [true, 'Please add a video category'],
      trim: true,
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
