const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const { withHooks } = require("../common/hooks");

const tableName = process.env.tableName;

const handler = async (event) => {
  const visitors = await Dynamo.scan(tableName);

  if (!visitors) {
    return Responses._400({ message: "Failed to get visitors" });
  }

  return Responses._200({ visitors });
};

exports.handler = withHooks(handler);
