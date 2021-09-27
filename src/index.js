const express = require('express');
require('./db/mongoose.js');
const routerUser = require('./routers/user');
const routerTask = require('./routers/task');

const app = express();
const port = process.env.PORT;

// Middleware para colocar la página en mantenimiento
/* app.use((req, res, next) => {
    res.status(503).send('Page on maintenance! Come on Soon!');
}) */

app.use(express.json());
app.use(routerUser);
app.use(routerTask);

app.listen(port, () => {
    console.log(`Application up on port ${port}`);
});

const multer = require('multer');
const upload = multer({
    dest: 'images'
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})