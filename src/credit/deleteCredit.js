const AWS = require("aws-sdk");

const deleteCredit = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

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
