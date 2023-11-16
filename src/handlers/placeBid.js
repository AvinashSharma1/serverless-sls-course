import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator';
import { getAuctionById } from './getAuction';
import placeBidSchema from '../lib/schemas/placeBidSchema';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
async function placeBid(event, context){
  let updatedAuction;
  const {id} = event.pathParameters;
  const {amount} = event.body;
  const {email} = event.requestContext.authorizer;
  console.log(event.body);

  const auction = await getAuctionById(id);
  
  // Bid Identity validation
  if(email === auction.seller)
  {
    throw new createError.Forbidden(`You cannot bid on your own auctions!`);
  }

  // Avoid double bidding
  if(email === auction.highestBid.bidder){
    throw new createError.Forbidden(`You are already the highest bidder`);
  }

  // Auction status validation
  if(auction.status !== 'OPEN'){
    throw new createError.Forbidden(`You cannot bid on closed auctions!`);
  }

  // Bid Amount validation
  if(amount <= auction.highestBid.amount)
  {
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount} !`);
  }

  try {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :newAmount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
            ":newAmount" : amount,
            ":bidder" : email
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

export const handler = commonMiddleware(placeBid)
.use(validator({
  inputSchema: placeBidSchema,
  ajvOptions: {
    strict: false,
  },
}));

