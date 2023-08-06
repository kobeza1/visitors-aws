const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const { bodyValidation } = require("../common/hooks");
const yup = require("yup");

const tableName = process.env.tableName;

const bodySchema = yup.object().shape({
  ID: yup.string().required(),
  name: yup.string().required(),
  lastName: yup.string().required(),
  createDate: yup.string(),
});

const handler = async (event) => {
  // const { ID: IDfromDB } = event.body.ID;
  // const visitor = await Dynamo.getNoError(IDfromDB, tableName);

  // if (visitor) {
  //   return Responses._400({ error: "This ID is already taken" });
  // }

  // creating date at backend

  // const date = new Date().toString();
  // const writeData = { ...event.body, createDate: date };

  // code before hooks

  // if (!ID || typeof ID !== "string") {
  //   return Responses._400({ error: "There must be ID and it must be string" });
  // }

  //   const newVisitor = await Dynamo.write(visitor, tableName).catch((err) => {
  //     console.log("Error in Dynamo WRITE", err);
  //     return null;
  //   });

  const newVisitor = await Dynamo.write(event.body, tableName);

  if (!newVisitor) {
    return Responses._400({ message: "Failed to write a visitor by ID" });
  }

  return Responses._200({ newVisitor: event.body });
};

exports.handler = bodyValidation({ bodySchema })(handler);
