const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

// Creación de la colección de usuarios en la base de datos
/* const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error(`Password don't be included the word "password"`);
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    }
});

const me = new User({
    name: 'Daniel      ',
    email: '    DVIDAL@GMAIL.COM',
    password: '12345678'
}); 

me.save().then(() => {
    console.log(me);
}).catch((error) => {
    console.log(error);
})*/

// Creación de la colección de tareas en la base de datos
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const task = new Task({
    description: 'Make the bed   ',
});

task.save().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log('Error', error);
})