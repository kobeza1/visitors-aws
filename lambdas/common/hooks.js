const {
  useHooks,
  logEvent,
  parseEvent,
  handleUnexpectedError,
} = require("lambda-hooks");

const withHooks = useHooks({
  before: [logEvent, parseEvent], // parseEvent parses the event so we no longer need JSON.parse and checking if event.pathParameters is true
  //   if (!event.pathParameters || !event.pathParameters.ID) now is if (!event.pathParameters.ID)
  after: [],
  onError: [handleUnexpectedError], // cathes anything that errors and is not handled with a handler,
  // will send a respond with error message
});

const bodyValidation = ({ bodySchema }) => {
  return useHooks(
    {
      before: [logEvent, parseEvent, validateEventBody],
      after: [],
      onError: [handleUnexpectedError],
    },
    { bodySchema }
  );
};

const fullValidation = ({ bodySchema, pathSchema }) => {
  return useHooks(
    {
      before: [logEvent, parseEvent, validateEventBody, validatePath],
      after: [],
      onError: [handleUnexpectedError],
    },
    { bodySchema, pathSchema }
  );
};

module.exports = {
  withHooks,
  bodyValidation,
  fullValidation,
};

const validateEventBody = async (state) => {
  const { bodySchema } = state.config;

  if (!bodySchema) {
    throw Error("Missing the required bodySchema");
  }

  try {
    const { event } = state;
    // await bodySchema.validate(event.body, { strict: true });
    await bodySchema.validate(event.body);
  } catch (error) {
    console.log("yup validation error of event.body", error);
    state.exit = true; // tells lambda hooks library to stop
    state.response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return state;
};

const validatePath = async (state) => {
  const { pathSchema } = state.config;

  if (!pathSchema) {
    throw Error("Missing the required pathSchema");
  }

  try {
    const { event } = state;
    // await pathSchema.validate(event.pathParameters, { strict: true });
    await pathSchema.validate(event.pathParameters);
  } catch (error) {
    console.log("yup validation error of path parameters", error);
    state.exit = true; // tells lambda hooks library to stop
    state.response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return state;
};
