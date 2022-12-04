const AWS = require("aws-sdk");

const updateCredit = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  const { storeName, email, amount } = JSON.parse(event.body);
  
   //validate stores

   const stores = await dynamodb.scan({ TableName: "StoreTable" }).promise();

   const store = stores.Items.find(store => store.storeName===storeName);
 
   if(!store){
     return  {body: {
       message: `Store ${storeName} is not registered in the database`
     }
   }} 
 
   //validate users
 
   const users = await dynamodb.scan({ TableName: "UserTable" }).promise();
 
   const user = users.Items.find(user => user.email===email);
 
   if(!user){
     return  {body: {
       message: `User ${email} is not registered`
     }
   }
   }

  //Verify that the credit is not registered in the database

  const credits = await dynamodb.scan({ TableName: "CreditTable" }).promise();

  const credit = credits.Items.find(credit => credit.storeName===storeName && credit.email===email);
  
  if(!credit){   
    return  `User ${email} does not have a credit on file with store ${storeName}`     
  }

  await dynamodb
  .update({
    TableName: "CreditTable",
    Key: { id },
    UpdateExpression: "set amount = :amount",
    ExpressionAttributeValues: {
      ":amount": amount
    },
    ReturnValues: "ALL_NEW",
  })
  .promise();

  return {
    amount
  };
};

module.exports = {
  updateCredit
};
