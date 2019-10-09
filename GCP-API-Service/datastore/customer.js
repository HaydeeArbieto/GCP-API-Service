
const { Datastore } = require('@google-cloud/datastore');

const datastore = new Datastore({
    projectId: 'api-service-gcp'
});

const tableContext = 'Customer';

function list(limit, callAgain) {
    const query = datastore
                 .createQuery([tableContext])
                 .limit(limit)
                 .order('FirstName');

    datastore.runQuery(q, (err, entities) => {
        if (err) {
            callAgain(err);
            return;
        }

        callAgain(null, entities.map(fromDatastore));
    });
}

function read(id, cb) {
    const key = datastore.key([tableContext, parseInt(id, 10)]);
    datastore.get(key, (err, entity) => {
        if (!err && !entity) {
            err = {
                code: 404,
                message: 'Not found',
            };
        }
        if (err) {
            cb(err);
            return;
        }
        cb(null, fromDatastore(entity));
    });
}

function fromDatastore(obj) {
    obj.id = obj[Datastore.KEY].id;
    return obj;
}

// [START exports]
module.exports = {
    read,
    list
};
  // [END exports]