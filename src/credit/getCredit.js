const AWS = require("aws-sdk");

const getCredit = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  const result = await dynamodb
    .get({
      TableName: "CreditTable",
      Key: { id },
    })
    .promise();

  const credit = result.Item;

  return {
    status: 200,
    body: credit
  };
};

module.exports = {
  getCredit 
};
