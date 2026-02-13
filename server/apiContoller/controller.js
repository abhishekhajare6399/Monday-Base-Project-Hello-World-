const { Logger } = require("../Logger/logger");
const { getHelloWorld } = require("../services/hello-world");

/**
 * API Controller for Hello World
 * Handles the request and calls the service
 */
const getHelloWorldController = async (req, res) => {
  try {

    const result = await getHelloWorld(req, res);
    
    Logger.info(req, "Hello World service executed successfully");
    
    res.status(200).json({
      success: true,
      message: result.message,
      mondayUser: result.mondayUser
    });
  } catch (error) {
    Logger.error(req, `Hello World API error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getHelloWorldController
};
