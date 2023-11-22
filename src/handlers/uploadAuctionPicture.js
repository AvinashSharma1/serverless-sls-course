import dotenv from 'dotenv';
dotenv.config();
export async function uploadAuctionPicture(event,context){

    const bucketName= process.env.AUCTIONS_BUCKET_NAME;
    return {
        statusCode: 200,
        body: JSON.stringify({bucketName})
    }

}
export const handler = uploadAuctionPicture;