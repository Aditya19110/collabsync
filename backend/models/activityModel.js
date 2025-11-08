import mongoose from 'mongoose';

const activitySchema = mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'created_task',
        'updated_task',
        'deleted_task',
        'moved_task',
        'created_list',
        'updated_list',
        'deleted_list',
        'added_member',
        'removed_member',
        'added_comment',
        'updated_priority',
        'set_due_date',
        'completed_task',
        'reopened_task',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient activity feed queries
activitySchema.index({ board: 1, createdAt: -1 });
activitySchema.index({ task: 1, createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
