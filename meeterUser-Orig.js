var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();

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

    var uData = '';
    switch (operation) {
        case 'login':
            const userData = await authenticate(
                event.payload.Key.email,
                event.payload.Key.password
            );
            return userData;
            break;
        case 'getUserByUserName':
            uData = await getUserByUserName(event.payload.Key.userName);
            return uData;
            break;
        case 'getUserByEmail':
            uData = await getUserByEmail(event.payload.Key.email);
            return uData;
            break;
        case 'getUser':
            uData = await getUser(event.payload.uid);
            const response = {
                statusCode: 200,
                body: uData,
            };
            return response;

            break;
        case 'validate':
            console.log('VALIDATING');
            event.payload.TableName = 'meeterUsers';
            dynamo.get(event.payload, callback);
            break;
        case 'echo':
            callback(null, 'Success');
            break;
        case 'ping':
            callback(null, 'pong');
            break;
        default:
            callback('Unknown operation: ${operation}');
    }
};
async function getUser(var1) {
    console.log('#####>>>> uid: ' + var1 + ' <<<<########');
    const uParams = {
        TableName: 'meeterUserProfiles',
        // indexName: 'userName-password-index',
        KeyConditionExpression: 'uid = :v_uid',
        ExpressionAttributeValues: {
            ':v_uid': var1,
        },
    };
    try {
        // console.log('BEFORE dynamo query');
        const data = await dynamo.query(uParams).promise();
        // console.log(data);
        return data;
    } catch (err) {
        console.log('FAILURE in dynamoDB call', err.message);
    }
}

async function getUserByUserName(var1) {
    const uParams = {
        TableName: 'meeterUsers',
        KeyConditionExpression: 'userName = :v_userName',
        ExpressionAttributeValues: {
            ':v_userName': var1,
        },
    };
    try {
        // console.log('BEFORE dynamo query');
        const data = await dynamo.query(uParams).promise();
        // console.log(data);
        return data;
    } catch (err) {
        console.log('FAILURE in dynamoDB call', err.message);
    }
}
async function getUserByEmail(var1) {
    const tParams = {
        TableName: 'meeterUsers',
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :v_id',
        ExpressionAttributeValues: {
            ':v_id': var1,
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
async function authenticate(var1, var2) {
    //return var1 + var2;
    const uParams = {
        TableName: 'meeterUsers',
        ExpressionAttributeValues: {
            ':v_email': var1,
            ':v_password': var2,
        },
        FilterExpression: 'email = :v_email and password = :v_password',
    };
    try {
        // console.log('BEFORE dynamo query');
        const data = await dynamo.scan(uParams).promise();
        // console.log(data);
        return data;
    } catch (err) {
        console.log('FAILURE in dynamoDB call', err.message);
    }
}
