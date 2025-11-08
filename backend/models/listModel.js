import mongoose from 'mongoose';

const listSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a list title'],
      trim: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
    position: {
      type: Number,
      default: 0,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model('List', listSchema);

export default List;
