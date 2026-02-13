const fetchMondayUserDetails = require("./fetchMondayUserDetails");
const { Logger } = require("../Logger/logger");

/**
 * Hello World Service
 * Returns a greeting message and Monday user details
 */
const getHelloWorld = async (req, res) => {
  const userDetails = await fetchMondayUserDetails(req, res);
  Logger.info(req, `User details: ${JSON.stringify(userDetails)}`);
  return {
    message: "Hello World " + userDetails.name,
    mondayUser: userDetails
  };
};

module.exports = {
  getHelloWorld
};
