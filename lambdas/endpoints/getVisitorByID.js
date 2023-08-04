const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const { withHooks } = require("../common/hooks");

const tableName = process.env.tableName;

const handler = async (event) => {
  let ID = event.pathParameters.ID;

  if (!ID) {
    return Responses._400({ message: "missing the ID from the path" });
  }

  const visitor = await Dynamo.get(ID, tableName);

  if (!visitor) {
    return Responses._400({ message: "Failed to get a visitor by ID" });
  }

  return Responses._200({ visitor });
};

exports.handler = withHooks(handler);

// const Responses = require("../common/API_Responses");

// module.exports.handler = async (event) => {
//   console.log("event", event);

//   if (!event.pathParameters || !event.pathParameters.ID) {
//     return Responses._400({ message: "missing the ID from the path" });
//   }

//   let ID = event.pathParameters.ID;
//   if (data[ID]) {
//     return Responses._200(data[ID]);
//   }
//   return Responses._400({ message: "no ID in the data" });
// };
