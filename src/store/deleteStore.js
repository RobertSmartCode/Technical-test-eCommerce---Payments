const AWS = require("aws-sdk");

const deleteStore = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  await dynamodb
  .update({
    TableName: "StoreTable",
    Key: { id },
    UpdateExpression: "set isActive = :isActive",
    ExpressionAttributeValues: {
      ":isActive": false
    },
    ReturnValues: "ALL_NEW",
  })
  .promise();

  return {
    status: 200,
    body: {
      message: 'Deleted Store'
    }
  };
};

module.exports = {
  deleteStore
};
