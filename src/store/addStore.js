const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");



const addStore = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient();

      const { storeName } = event.body;

      //Validate that the storeName field is not empty
      if( storeName.length == 0) {
        return  {body: {
          message: `The storeName is empty`
        }
      }}
 
      const stores = await dynamodb.scan({ TableName: "StoreTable" }).promise();

      const store = stores.Items.find(store => store.storeName===storeName);
    
      if(store){
        return  {body: {
          message: `Store ${storeName} is already registered`
        }
      }} 
    

  const id = v4();
  const newStore = {
    id,
    isActive:true,
    storeName 
  };

  try {
    await dynamodb
    .put({
      TableName: "StoreTable",
      Item: newStore
    })
    .promise();

  return {
   newStore
  };
  } catch (error) {
    console.log(error)
  }
};



module.exports = {
  addStore:middy(addStore)

  .use(httpJSONBodyParser())
};

