import mongoose from 'mongoose';

const boardSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a board title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['admin', 'member', 'viewer'],
          default: 'member',
        },
      },
    ],
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
      },
    ],
    backgroundImage: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: '#0079bf',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model('Board', boardSchema);

export default Board;
