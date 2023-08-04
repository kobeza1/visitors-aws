const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const { withHooks } = require("../common/hooks");

const tableName = process.env.tableName;

const handler = async (event) => {
  console.log("event", event);

  let ID = event.pathParameters.ID;

  if (!ID) {
    return Responses._400({ message: "Missing the ID from the path" });
  }

  //   const visitor = await Dynamo.get(ID, tableName).catch((err) => {
  //     console.log("Error in Dynamo GET", err);
  //     return null;
  //   });

  const visitor = await Dynamo.get(ID, tableName);

  if (visitor) {
    const res = await Dynamo.delete(ID, tableName);
  } else {
    return Responses._400({
      message: "There is no visitor with such ID in database",
    });
  }

  return Responses._200({ visitor });
};

exports.handler = withHooks(handler);
