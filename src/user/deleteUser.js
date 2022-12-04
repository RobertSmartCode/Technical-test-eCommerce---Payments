const AWS = require("aws-sdk");

const deleteUser = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  await dynamodb
  .update({
    TableName: "UserTable",
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
      message: 'Deleted User'
    }
  };
};

module.exports = {
  deleteUser
};
