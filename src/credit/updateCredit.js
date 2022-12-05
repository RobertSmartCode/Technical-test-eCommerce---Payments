const AWS = require("aws-sdk");


const updateCredit = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  // const { id } = event.pathParameters;

  let { storeName, email, amount } = JSON.parse(event.body);

  //Validate that the storeName field is not empty
  if( storeName.length == 0) {
    return  {body: {
       message: `The storeName is empty`
         }
       }}
 
  // Validate email
 emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
  
  if (!emailRegex.test(email) || email.length == 0) {
   return  {body: {
     message: `Enter a valid email`
   }
 }} 
 
 
 // Validate amount
 if( isNaN(amount) ) {
   return  {body: {
     message: `Enter a valid amount`
   }
 } 
 }
 
  
   //Check if storeName is in the database

   const stores = await dynamodb.scan({ TableName: "StoreTable" }).promise();

   const store = stores.Items.find(store => store.storeName===storeName);
 
   if(!store){
     return  {body: {
       message: `Store ${storeName} is not registered in the database`
     }
   }} 
 
   //Check if email is in the database
 
   const users = await dynamodb.scan({ TableName: "UserTable" }).promise();
 
   const user = users.Items.find(user => user.email===email);
 
   if(!user){
     return  {body: {
       message: `User ${email} is not registered`
     }
   }
   }

   //Verify that the credit is not registered in the database

  let credits = await dynamodb.scan({ TableName: "CreditTable" }).promise();

  let credit = credits.Items.find(credit => credit.storeName===storeName && credit.email===email);
  
  if(!credit){   
    return  `User ${email} does not have a credit on file with store ${storeName}`     
  }
const oldAmount=amount
amount=Number(oldAmount)+Number(credit.amount)
if(amount<0){
  return  `The amount to debit of ${-(oldAmount)} exceeds the credit of ${credit.amount}` 
}

const id=credit.id

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

