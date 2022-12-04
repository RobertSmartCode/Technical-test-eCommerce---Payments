const AWS = require("aws-sdk");

const getCredits = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const result = await dynamodb.scan({ TableName: "CreditTable" }).promise();

  const credits = result.Items.filter(credit => credit.isActive===true);

  return {
    status: 200,
    body: {
      credits
    },
  };
};

module.exports = {
  getCredits
};
