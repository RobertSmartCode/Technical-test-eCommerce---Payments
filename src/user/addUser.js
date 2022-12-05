const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");

const addUser = async (event) => {
  
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { email } = event.body;

 // Validate email
 emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
 
 if (!emailRegex.test(email) || email.length == 0) {
  return  {body: {
    message: `Enter a valid email`
  }
}} 

  const users = await dynamodb.scan({ TableName: "UserTable" }).promise();

  const user = users.Items.find(user => user.email===email);

  if(user){
    return  {body: {
      message: `User ${email} is already registered`
    }
  }
  }
  const id = v4();
 
  const newUser = {
    id,
    isActive:true,
    email
    
  };

  await dynamodb
    .put({
      TableName: "UserTable",
      Item: newUser,
    })
    .promise();

  return {
    newUser
  };
};

module.exports = {
  addUser: middy(addUser).use(httpJSONBodyParser())
};
