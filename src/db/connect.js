const mongoose = require('mongoose');

async function connect() {
    const dbUri = process.env.DB_URI;

    try {
        await mongoose
            .connect(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        console.log('database connected');
    } catch (error) {
        console.error('db error', error);
        process.exit(1);
    }
}

module.exports = connect;