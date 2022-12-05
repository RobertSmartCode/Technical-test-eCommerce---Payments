const AWS = require("aws-sdk");


const updateUser = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  const { email } = JSON.parse(event.body);


 // Validate email
 emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
 
 if (!emailRegex.test(email) || email.length == 0) {
  return  {body: {
    message: `Enter a valid email`
  }
}} 

  await dynamodb
    .update({
      TableName: "UserTable",
      Key: { id },
      UpdateExpression: "set email = :email",
      ExpressionAttributeValues: {
        ":email": email
      },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "user updated",
    }),
  };
};

module.exports = {
  updateUser
};
