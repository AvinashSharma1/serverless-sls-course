import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuction(auction){
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id : auction.id},
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }

    };

    const result = await dynamodb.update(params).promise();
    const {title, seller, highestBid} = auction;
    const {amount, bidder} = highestBid;
    const source = process.env.EMAIL_SOURCE_ENV_VALUE;
    const notifySeller = sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject: "Your Item has been sold!",
            body: `Woohoo! Your Item ${title} has been sold for $${amount}.`,
            source: source,
            recipient:{
                ToAddresses: [seller]
            }
        }),
    }).promise();

    const notifyBidder = sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject: "You won an auction!",
            body: `What a great deal! You got yourself a ${title} for $${amount}.`,
            source: source,
            recipient:{
                ToAddresses: [bidder]
            }
        }),
    }).promise();

    return Promise.all([notifySeller,notifyBidder]);

    //return result;
}