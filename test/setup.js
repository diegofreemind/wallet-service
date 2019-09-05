const { connect, connection } = require('mongoose');
const { mongo_host } = require('../components/_config/env');
require('../components/Scheduler/SchedulerModel');

beforeAll(async () => {

    try {

        await connect(mongo_host,
            {
                useNewUrlParser: true
            });

    } catch (error) {

        throw error;
    }

});

beforeEach(async () => {

    const collections = Object.keys(connection.collections);
    for (const collectionName of collections) {

        const collection = connection.collections[collectionName]
        await collection.deleteMany();
    }
});

async function dropAllCollections() {
    const collections = Object.keys(connection.collections)
    for (const collectionName of collections) {
        const collection = connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            // This error happens when you try to drop a collection that's already dropped. Happens infrequently. 
            // Safe to ignore. 
            if (error.message === 'ns not found') return

            // This error happens when you use it.todo.
            // Safe to ignore. 
            if (error.message.includes('a background operation is currently running')) return

            console.log(error.message)
        }
    }
}

afterAll(async () => {
    await dropAllCollections();
    await connection.close()
});