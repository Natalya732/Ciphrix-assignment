import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validate input
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Please provide title and description" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "Pending",
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user with pagination
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    // Build query - only get tasks created by the logged-in user
    const query = { createdBy: req.user._id };

    // Add status filter if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Get tasks with pagination
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if task belongs to user
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this task" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if task belongs to user
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Update task
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, checkAdmin, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
