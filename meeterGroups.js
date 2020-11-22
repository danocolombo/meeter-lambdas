var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const crypto = require('crypto');

/**
 * Meeter Groups
 */

exports.handler = async (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let operation = event.operation;
    let groups = null;
    console.log('operation:' + operation);
    let payload = {
        status: '400',
        body: {
            // message: 'Meeter System Error',
        },
    };
    var gData = '';
    switch (operation) {
        case 'getGroupById':
            // get a specific group
            group = await getGroupById(event.payload.groupId);
            //==================================
            // should get the group
            //==================================
            if (group.Count < 1) {
                payload.status = '400';
                return payload;
            } else {
                payload.status = '200';
                payload.count = group.Count;
                payload.body = group.Items[0];
                return payload;
            }
            return response;
        case 'getGroupsByMeetingId':
            // get groups for the meetingId
            groups = await getGroupsByMeetingId(event.payload.meetingId);
            //==================================
            // should get array of groups
            //==================================

            if (groups.Count < 1) {
                payload.status = '400';
                return payload;
            } else {
                payload.status = '200';
                payload.count = groups.Count;
                let theGroups = [];
                for (let i = 0; i < groups.Count; i++) {
                    theGroups.push(groups.Items[i]);
                }
                payload.body = theGroups;
                return payload;
            }
            return response;
        case 'echo':
            callback(null, 'Success');
            break;
        case 'ping':
            callback(null, 'pong');
            break;
        default:
            payload.status = '400';
            payload.body.message =
                'Meeter System Error: operation (' + operation + ') unsupport';
            return payload;
    }
};
async function getGroupById(var1) {
    const uParams = {
        TableName: 'meeterGroups',
        KeyConditionExpression: 'id = :v_id',
        ExpressionAttributeValues: {
            ':v_id': var1,
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
async function getGroupsByMeetingId(var1) {
    const mParams = {
        TableName: 'meeterGroups',
        IndexName: 'meetingId-index',
        KeyConditionExpression: 'meetingId = :v_id',
        ExpressionAttributeValues: {
            ':v_id': var1,
        },
    };
    try {
        // console.log('BEFORE dynamo query');
        const data = await dynamo.query(mParams).promise();
        // console.log(data);
        return data;
    } catch (err) {
        console.log('FAILURE in dynamoDB call', err.message);
    }
}
