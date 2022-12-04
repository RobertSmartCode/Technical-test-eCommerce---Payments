const AWS = require("aws-sdk");
const yup = require("yup");

const schema = yup.object().shape({
  storeName: yup.string().required()
});


const updateStore = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { id } = event.pathParameters;

    const { storeName } = JSON.parse(event.body);

    schema.validate(storeName).catch(function (err) {
      err.storeName;
    });
    
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
  updateStore
};
