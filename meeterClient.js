var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */

exports.handler = async (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    var operation = event.operation;

    event.payload.TableName = 'meeterClientProfiles';

    switch (operation) {
        case 'getClient':
            const requestedClient = await getClient(event.payload.clientId);
            return requestedClient;
            break;

        case 'getClients':
            const requestedClients = await getClients();
            return requestedClients;
            break;
        case 'getAuth':
            const requestedAuth = await getAuth(
                event.payload.uid,
                event.payload.clientId
            );
            return requestedAuth;
            break;

        case 'echo':
            callback(null, 'Success');
            break;
        default:
            callback('Unknown operation: ${operation}');
    }
};
async function getClient(var1) {
    //return var1 + var2;
    const tParams = {
        TableName: 'meeterClientProfiles',
        KeyConditionExpression: 'clientId = :v_clientId',
        ExpressionAttributeValues: {
            ':v_clientId': var1,
        },
    };
    try {
        // console.log('BEFORE dynamo query');
        const data = await dynamo.query(tParams).promise();
        // console.log(data);
        return data;
    } catch (err) {
        console.log('FAILURE in dynamoDB call', err.message);
    }
}
async function getClients() {
    //return var1 + var2;
    const tParams = {
        TableName: 'meeterClientProfiles',
    };
    try {
        // console.log('BEFORE dynamo query');
        const data = await dynamo.scan(tParams).promise();
        // console.log(data);
        return data;
    } catch (err) {
        console.log('FAILURE in dynamoDB call', err.message);
    }
}
//
async function getAuth(uid, clientId) {
    try {
        const theClient = await getClient(clientId);
        //=====================================
        // now get the user reference to uid
        //=====================================

        // console.log(data);
        return data;
    } catch (err) {
        console.log('FAILURE in dynamoDB call', err.message);
    }
}
