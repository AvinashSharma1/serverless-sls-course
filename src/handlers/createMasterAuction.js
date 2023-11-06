import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
async function createMasterAuction(event, context){
  const {title} = event.body;
  const now = new Date();
  const auction = {
    id: uuid(),
    title,
    status:"OPEN",
    createdAT: now.toISOString(),
    highestBid: {
      amount: 0,
    }
  };

  try {
    await dynamoDB.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item:auction
    }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

 

  return {
    statusCode: 201,
    body: JSON.stringify({auction})
  };
}

export const handler = commonMiddleware(createMasterAuction);


