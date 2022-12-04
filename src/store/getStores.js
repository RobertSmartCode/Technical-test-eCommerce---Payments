const AWS = require("aws-sdk");

const getStores = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const result = await dynamodb.scan({ TableName: "StoreTable" }).promise();

  const store = result.Items.filter(store => store.isActive===true);

  return {
    status: 200,
    body: {
      store
    },
  };
};

module.exports = {
  getStores 
};
