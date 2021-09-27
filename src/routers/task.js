const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();

        res.status(201).send(task);
    } catch (error) {
        res.status(500).send(error);
    }

    //Without async-await
    /*task.save().then(() => {
        res.status(201).send(task);
    }).catch((error) => {
        res.status(400).send(error);
    });*/
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    // Data filtered
    const match = {}

    // Data sorted
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({});
        await req.user.populate('tasks');
        res.send(req.user.tasks);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }


    //Without async-await
    /*Task.find({}).then(tasks => {
        res.send(tasks);
    }).catch(e => {
        res.status(500).send();
    })*/
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        //const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }

    //Without async-await
    /*Task.findById(_id).then(task => {
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    }).catch(e => {
        res.status(500).send();
    })*/
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updateField = Object.keys(req.body);
    const allowedUpdate = ['description', 'completed'];
    const isValidUpdate = updateField.every((update) => allowedUpdate.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid field!' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        //const task = await Task.findById(req.params.id);
        updateField.forEach((update) => task[update] = req.body[update]);

        await task.save();

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({ id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;