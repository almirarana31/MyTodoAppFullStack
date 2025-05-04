import mongoose from "mongoose";

const todolistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    todo_name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Todo name must be at least 3 characters long'],
        index: true,
    },
    todo_desc: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: "",
        trim: true
    },
    todo_status: {
        type: String,
        required: true,
        default: "active",
        enum: {
            values: ["active", "finished"],
            message: '{VALUE} is not a valid status. Must be either "active" or "finished"'
        }
    },
    todo_priority: {
        type: String,
        enum: {
            values: ["low", "medium", "high"],
            message: '{VALUE} is not a valid priority. Must be either "low", "medium", or "high"'
        },
        default: "low"
    },
    due_date: {
        type: Date,
        default: null,
        validate: {
            validator: function (value) {
                return value === null || value >= new Date(); // Allow null or future dates
            },
            message: 'Due date must be a future date or null'
        }
    },
}, {
    timestamps: true
})

export default mongoose.model('Todolist', todolistSchema)