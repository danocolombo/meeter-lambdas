var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

/**
 * Meeter Meetings
 */

exports.handler = async (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    var operation = event.operation;
    console.log('operation:' + operation);
    let payload = {
        status: '400',
        body: {
            // message: 'Meeter System Error',
        },
    };
    var mData = '';
    switch (operation) {
        case 'getFutureMeetings':
            // get the Future Meetings for clientId
            const meetings = await getMeetings(event.payload.clientId);
            //==================================
            // should get array of meetings
            //==================================

            if (meetings.Count < 1) {
                payload.status = '400';
                // payload.body.message = 'no meetings found';
                return payload;
            } else {
                payload.status = '200';
                let theMeetings = [];
                for (let i = 0; i < meetings.Count; i++) {
                    let m = {};
                    mtg = meetings.Items[i];
                    m._id = mtg.id;
                    m.clientId = mtg.clientId; // required field no need to check
                    if (mtg.meetingDate) m.meetingDate = mtg.meetingDate;
                    if (mtg.meetingType) m.type = mtg.meetingType;
                    if (mtg.title) m.title = mtg.title;
                    if (mtg.attendance) m.attendance = mtg.attendance;
                    if (mtg.faciliator) m.facilitator = mtg.facilitator;
                    if (mtg.supportRole) m.supportRole = mtg.supportRole;
                    if (mtg.announcementContact)
                        m.announcementContact = mtg.announcementContact;
                    if (mtg.cafeCoordinator)
                        m.cafeCoordinator = mtg.cafeCoordinator;
                    if (mtg.cafeCount) m.cafeCount = mtg.cafeCount;
                    if (mtg.children) m.children = mtg.children;
                    if (mtg.childrenContact)
                        m.childrenContact = mtg.childrenContact;
                    if (mtg.cleanupContact)
                        m.cleanupContact = mtg.cleanupContact;
                    if (mtg.closingContact)
                        m.closingContact = mtg.closingContact;
                    if (mtg.donations) m.donations = mtg.donations;
                    if (mtg.greeterContact1)
                        m.greeterContact1 = mtg.greeterContact1;
                    if (mtg.greeterContact2)
                        m.greeterContact2 = mtg.greeterContact2;
                    if (mtg.meal) m.meal = mtg.meal;
                    if (mtg.mealCnt) m.mealCnt = mtg.mealCnt;
                    if (mtg.mealCoordinator)
                        m.mealCoordinator = mtg.mealCoordinator;
                    if (mtg.newcomers) m.newcomers = mtg.newcomers;
                    if (mtg.meetingType) m.meetingType = mtg.meetingType;
                    if (mtg.notes) m.notes = mtg.notes;
                    if (mtg.nursery) m.nursery = mtg.nursery;
                    if (mtg.nurseryContact)
                        m.nurseryContact = mtg.nurseryContact;
                    if (mtg.resourceContact)
                        m.resourceContact = mtg.resourceContact;
                    if (mtg.securityContact)
                        m.securityContact = mtg.securityContact;
                    if (mtg.setupContact) m.setupContact = mtg.setupContact;
                    if (mtg.supportRole) m.supportRole = mtg.supportRole;
                    if (mtg.transportationContact)
                        m.transportationContact = mtg.transportationContact;
                    if (mtg.transportationCount)
                        m.transportationCount = mtg.transportationCount;
                    if (mtg.worship) m.worship = mtg.worship;
                    if (mtg.youth) m.youth = mtg.youth;
                    if (mtg.youthContact) m.youthContact = mtg.youthContact;
                    theMeetings.push(m);
                }
                payload.body = theMeetings;

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
        //callback('Unknown operation: ${operation}');
    }
};
async function getMeetings(var1) {
    const mParams = {
        TableName: 'meeterMeetings',
        IndexName: 'clientId-index',
        KeyConditionExpression: 'clientId = :v_id',
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
