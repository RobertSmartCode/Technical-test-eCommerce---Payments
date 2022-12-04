const AWS = require("aws-sdk");

const getStore = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  const result = await dynamodb
    .get({
      TableName: "StoreTable",
      Key: { id },
    })
    .promise();

  const store = result.Item;

  return {
    status: 200,
    body: store
  };
};

module.exports = {
  getStore
};
