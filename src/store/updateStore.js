const AWS = require("aws-sdk");

const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");


const updateStore = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { id } = event.pathParameters;

    const { storeName } = event.body;

      //Validate that the storeName field is not empty
      if( storeName.length == 0) {
        return  {body: {
          message: `The storeName is empty`
        }
      }}

      await dynamodb
        .update({
          TableName: "StoreTable",
          Key: { id },
          UpdateExpression: "set storeName = :storeName",
          ExpressionAttributeValues: {
            ":storeName": storeName
          },
          ReturnValues: "ALL_NEW",
        })
        .promise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Store ${storeName} updated`,
        }),
      };

  
};


module.exports = {
  updateStore:middy(updateStore)
  .use(httpJSONBodyParser())
};
