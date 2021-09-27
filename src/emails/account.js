const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'vidal179@gmail.com', // Change to your verified sender
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

const sendCanceledEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'vidal179@gmail.com',
        subject: 'We hope see soon! :(',
        text: `Hi ${name}, for us is very important know why do you leave our services!`
    }

    sgMail.send(msg).
        then(() => {
            console.log('Email sent');
        }).catch(error => {
            console.log(error);
        })
}

module.exports = {
    sendWelcomeEmail,
    sendCanceledEmail
}
