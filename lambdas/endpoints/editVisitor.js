const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const { fullValidation } = require("../common/hooks");
const yup = require("yup");

const tableName = process.env.tableName;

const { setLocale } = yup;

setLocale({
  mixed: {
    notType: "the ${path} must be string",
    required: "name OR lastName are required",
  },
});

const bodySchema = yup.object().shape(
  {
    name: yup
      .string()
      .ensure()
      .when("lastName", {
        is: (lastName) => !lastName || lastName.length === 0,
        then: () => yup.string().required(),
        otherwise: () => yup.string(),
      }),
    lastName: yup
      .string()
      .ensure()
      .when("name", {
        is: (name) => !name || name.length === 0,
        then: () => yup.string().required(),
        otherwise: () => yup.string(),
      }),
  },
  [["name", "lastName"]]
);

const pathSchema = yup.object().shape({
  ID: yup.string().required(),
});

const handler = async (event) => {
  let ID = event.pathParameters.ID;

  // if (!ID) {
  //   return Responses._400({ message: "Missing the ID from the path" });
  // }

  const visitor = await Dynamo.get(ID, tableName);
  const { name: nameOrigin, lastName: lastNameOrigin } = visitor;

  let { name, lastName } = event.body;

  if (!name) {
    name = nameOrigin;
  }
  if (!lastName) {
    lastName = lastNameOrigin;
  }

  const res = await Dynamo.update({
    tableName,
    primaryKey: "ID",
    primaryKeyValue: ID,
    newName: name,
    newLastName: lastName,
  });

  // if (visitor) {
  //   const res = await Dynamo.update({
  //     tableName,
  //     primaryKey: "ID",
  //     primaryKeyValue: ID,
  //     updateKey: "name",
  //     updateValue: name,
  //   });
  // } else {
  //   return Responses._400({
  //     message: "There is no visitor with such ID in database",
  //   });
  // }

  return Responses._200({ name, lastName });
};

exports.handler = fullValidation({ bodySchema, pathSchema })(handler);
