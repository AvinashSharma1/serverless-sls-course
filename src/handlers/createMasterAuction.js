import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import createAuctionSchema from '../lib/schemas/createAuctionSchema';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
async function createMasterAuction(event, context){
  const {title} = event.body;
  const {email} = event.requestContext.authorizer;
  const now = new Date();
  let endDate = new Date();
  endDate.setHours(now.getHours() + 1);
  const auction = {
    id: uuid(),
    title,
    status:"OPEN",
    createdAT: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email
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

export const handler = commonMiddleware(createMasterAuction)
.use(validator({
  inputSchema: createAuctionSchema,
  ajvOptions: {
    strict: false,
  },
}));


