import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
async function placeBid(event, context){
  let updatedAuction;
  const {id} = event.pathParameters;
  const {amount} = event.body;
  console.log(event.body);
  try {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :newAmount',
        ExpressionAttributeValues: {
            ":newAmount" : amount
        },
        ReturnValues: 'ALL_NEW'
    };


    const result = await dynamoDB.update(params).promise();
    updatedAuction = result.Attributes;
    
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);    
  } 

  return {
    statusCode: 200,
    body: JSON.stringify({updatedAuction})
  };
}

export const handler = commonMiddleware(placeBid);

