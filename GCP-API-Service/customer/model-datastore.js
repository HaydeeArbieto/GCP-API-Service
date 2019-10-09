'use strict';

const { Datastore } = require('@google-cloud/datastore');

const ds = new Datastore();
const kind = 'Customer';

function fromDatastore(obj) {
    obj.id = obj[Datastore.KEY].id;
    return obj;
}

function toDatastore(obj, nonIndexed) {
    nonIndexed = nonIndexed || [];
    const results = [];
    Object.keys(obj).forEach(k => {
        if (obj[k] === undefined) {
            return;
        }
        results.push({
            name: k,
            value: obj[k],
            excludeFromIndexes: nonIndexed.indexOf(k) !== -1,
        });
    });
    return results;
}

// Lists all list in the Datastore.
// The ``limit`` argument determines the maximum amount of results to
// return per page. The ``token`` argument allows requesting additional
// pages. The callback is invoked with ``(err, customer, nextPageToken)``.

function list(limit, token, cb) {
    const q = ds
        .createQuery([kind])
        .limit(limit)
        .order('FirstName')
        .start(token);

    ds.runQuery(q, (err, entities, nextQuery) => {
        if (err) {
            cb(err);
            return;
        }
        const hasMore =
            nextQuery.moreResults !== Datastore.NO_MORE_RESULTS
                ? nextQuery.endCursor
                : false;
        cb(null, entities.map(fromDatastore), hasMore);
    });
}


function read(id, cb) {
    const key = ds.key([kind, parseInt(id, 10)]);
    ds.get(key, (err, entity) => {
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

module.exports = {
    list
};