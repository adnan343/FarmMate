import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    },
    category: {
        type: String,
        enum: [
            'planting',
            'maintenance',
            'harvesting',
            'watering',
            'fertilizing',
            'pest_control',
            'irrigation',
            'weeding',
            'monitoring',
            'other'
        ],
        default: 'other'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'overdue', 'scheduled'],
        default: 'pending'
    },
    dueDate: {
        type: Date
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    assignedTeam: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;


