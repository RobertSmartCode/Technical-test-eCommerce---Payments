const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");

const addCredit= async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { storeName, email, amount } = event.body;

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
  
  if(credit){   
    return  {body: {
      message: `The user ${email} already has a credit registered with the store ${storeName}`
    }

  }
     
  }
  const id = v4();

  const newCredit = {
    id,
    isActive:true,
    email,
    storeName,
    amount  
  };

  try {
    await dynamodb
    .put({
      TableName: "CreditTable",
      Item: newCredit
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(newCredit),
  };
  } catch (error) {
    console.log(error)
  }

};

module.exports = {
  addCredit: middy(addCredit).use(httpJSONBodyParser()),
};
