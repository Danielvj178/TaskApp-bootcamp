const { MongoClient, ObjectID } = require('mongodb');
//const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

/* const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp()); */

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);


    //Create documents in Mongo DB
    /* db.collection('users').insertOne({
        _id: id,
        name: 'Pablo',
        age: 36
    }) */
    /*db.collection('users').insertMany([
        {
            name: 'Alexa',
            firstName: 'Fabiola'
        },
        {
            name: 'Alexander',
            age: 28
        }
    ])*/

    /*db.collection('tasks').insertMany([
        {
            description: 'Make the bed',
            completed: false
        },
        {
            description: 'Clean the laundry',
            completed: true
        },
        {
            description: 'Go to the gym',
            completed: false
        }
    ]).then(result => {
        console.log(result)
    })*/

    /*  const results = db.collection('tasks').find({
         _id: '614426bd8f573a4331e59fe2'
     })
 
     console.log(results) */

    // Read documents
    //Obtener un solo registro
    /* db.collection('users').findOne({ _id: new ObjectID('61442195f3befe2bfebcb025') }, (error, user) => {
        if (error) {
            return console.log(error)
        }

        console.log(user);
    }) */

    //Obtener varios registros
    /*db.collection('users').find({ age: 26 }).toArray((error, users) => {
        console.log(users);
    })*/

    /*db.collection('tasks').findOne({ _id: new ObjectID('614426bd8f573a4331e59fe4') }, (error, task) => {
        if (error) {
            return console.log('Unable to connect to DB');
        }

        console.log(task);
    });

    db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
        console.log(tasks);
    })*/

    // Actualizar registros
    /*db.collection('users').updateOne({ _id: new ObjectID('61441ed0ccdc1012f57bbdb1') }, { $set: { name: 'Danielito' } }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })*/

    /*db.collection('tasks').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })*/

    // Borrar registros
    /*db.collection('users').deleteMany({
        age: 36
    }).then((resolve) => {
        console.log(resolve);
    }).catch((error) => {
        console.log(error);
    })*/

    db.collection('tasks').deleteOne({
        description: 'Clean the laundry'
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
})