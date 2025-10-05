const Task = require('../models/Task');
const logger = require('../utils/logger');

exports.getTasks = async (req, res, next) => {
  try {
    const { status, sort } = req.query;
    const filter = { userId: req.user._id };
    
    if (status && ['pending', 'completed'].includes(status)) {
      filter.status = status;
    } else {
      filter.status = { $ne: 'deleted' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    const tasks = await Task.find(filter).sort(sortOption);
    
    // Get progress statistics
    const totalTasks = await Task.countDocuments({ userId: req.user._id, status: { $ne: 'deleted' } });
    const completedTasks = await Task.countDocuments({ userId: req.user._id, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ userId: req.user._id, status: 'pending' });
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.render('tasklist', {
      tasks,
      currentStatus: status || 'all',
      currentSort: sort || 'newest',
      user: req.user,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      dueDate: dueDate || null,
      userId: req.user._id
    });

    await task.save();
    logger.info(`Task created: ${title} by user ${req.user.username}`);
    res.redirect('/tasks');
  } catch (error) {
    logger.error('Create task error:', error);
    next(error);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = status;
    await task.save();

    logger.info(`Task status updated: ${id} to ${status} by user ${req.user.username}`);
    res.redirect('/tasks');  // Changed from res.json() to res.redirect()
  } catch (error) {
    logger.error('Update task error:', error);
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = 'deleted';
    await task.save();

    logger.info(`Task deleted: ${id} by user ${req.user.username}`);
    res.redirect('/tasks');  // Changed from res.json() to res.redirect()
  } catch (error) {
    logger.error('Delete task error:', error);
    next(error);
  }
};
