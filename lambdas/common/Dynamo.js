const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
  async scan(TableName) {
    const params = {
      TableName,
    };

    const data = await documentClient.scan(params).promise();

    if (!data || !data.Items) {
      throw Error(`There was an error fetching the data from ${TableName}`);
    }
    console.log(data);
    return data.Items;
  },

  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data for ID of ${ID} from ${TableName}`
      );
    }
    console.log(data);
    return data.Item;
  },

  async getNoError(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const data = await documentClient.get(params).promise();
    return data.Item;
  },

  async write(data, TableName) {
    if (!data.ID) {
      throw Error(`There is no ID in the data`);
    }

    const params = {
      TableName,
      Item: data,
      ConditionExpression: "attribute_not_exists(ID)",
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error(
        `There was an error inserting ${data} into in table ${TableName}`
      );
    }

    // if (!res) {
    //   throw Error(
    //     `There was an error inserting ID of ${data.ID} into in table ${TableName}`
    //   );
    // }

    return data; // data = newVisitor
  },

  async delete(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const res = await documentClient.delete(params).promise();

    if (!res) {
      throw Error(
        `There was an error deleting visitor from the table ${TableName}`
      );
    }
    return res;
  },

  update: async ({
    tableName,
    primaryKey,
    primaryKeyValue,
    newName,
    newLastName,
  }) => {
    const params = {
      TableName: tableName,
      Key: { [primaryKey]: primaryKeyValue },
      // UpdateExpression: `set ${updateKey} = :updateValue`,
      // ExpressionAttributeValues: {
      //   ":updateValue": updateValue,
      // },

      UpdateExpression: `SET #first_name = :newName, lastName = :newLastName`,
      ExpressionAttributeValues: {
        ":newName": newName,
        ":newLastName": newLastName,
      },
      ExpressionAttributeNames: {
        "#first_name": "name",
      },
    };

    return documentClient.update(params).promise();
  },
};

module.exports = Dynamo;
