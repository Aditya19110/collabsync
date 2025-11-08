import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'List',
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
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    labels: [
      {
        color: String,
        text: String,
      },
    ],
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    checklist: [
      {
        item: String,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
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

const Task = mongoose.model('Task', taskSchema);

export default Task;
