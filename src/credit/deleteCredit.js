const AWS = require("aws-sdk");

const deleteCredit = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  
  let { storeName, email } = JSON.parse(event.body);

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

 const credits = await dynamodb.scan({ TableName: "CreditTable" }).promise();

 const {id} = credits.Items.find(credit => credit.storeName===storeName && credit.email===email);

 
  await dynamodb
  .update({
    TableName: "CreditTable",
    Key: { id },
    UpdateExpression: "set isActive = :isActive",
    ExpressionAttributeValues: {
      ":isActive": false
    },
    ReturnValues: "ALL_NEW",
  })
  .promise();

  return {
    body: {
      message: 'Deleted Credit'
    }
  };
};

module.exports = {
  deleteCredit
};
