const express = require('express');
const router = express.Router();

const multer = require('multer');

const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCanceledEmail } = require('../emails/account');
const User = require('../models/user');

const upload = multer({
    // Con la propiedad dest, lo que hace es guardar el archivo subido en la ubicación que se coloque en este parámetro 
    //dest: 'avatars',
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Plese upload a image'));
        }

        cb(undefined, true);
    }
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }

    // Without asyc-await
    /*user.save().then((result) => {
        res.status(201).send(result);
    }).catch((error) => {
        res.status(400).send(error);
    })*/
});

router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => (token.token !== req.token));
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// Función para obtener los datos del usuario que se está logueando en este momento
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})


// Función para obtener todos los usuarios de la BD
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }

    // Without async-await
    /*User.find({}).then((result) => {
        res.send(result);
    }).catch((e) => {
        res.status(500).send();
    })*/
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send(user);
        }

        res.send(user);

    } catch (error) {
        res.status(500).send(error);
    }

    //Without async-await
    /*User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }).catch(e => {
        res.status(500).send();
    })*/

});

//Función para actualizar su propia información
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Función para actualizar un usuario mediante el ID
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const user = await User.findById(req.params.id);

        updates.forEach((update) => user[update] = req.body[update])

        await user.save();

        // No se hace con esta función debido a que esta no pasa por el middleware definido en el modelo
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send(user);
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Función para eliminar su propio registro
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCanceledEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Función para eliminar un registro mediante un ID
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// MANEJO DE IMAGENES
// Función para añadir imagenes
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // Si se desea guardar la data que corresponde a la imagen y/o archivo, se debe acceder al buffer del archivo subido
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

// Función para eliminar imágenes 
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error)
    }
})

// Función para traer la imagen desde la BD
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpeg');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = router;