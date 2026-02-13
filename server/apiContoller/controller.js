const { Logger } = require("../Logger/logger");
const { getHelloWorld } = require("../services/hello-world");

/**
 * API Controller for Hello World
 * Handles the request and calls the service
 */
const getHelloWorldController = async (req, res) => {
  try {
    Logger.info(req, "Hello World API called");
    
    // Get Monday.com session token from header
    const mondaySessionToken = req.headers['x-monday-session-token'];
    
    if (mondaySessionToken) {
      Logger.info(req, `Monday.com Session Token received: ${mondaySessionToken}`);
    } else {
      Logger.warn(req, "Monday.com Session Token not found in request headers");
    }
    
    
    // Call the service
    const message = getHelloWorld();
    
    Logger.info(req, "Hello World service executed successfully");
    
    res.status(200).json({
      success: true,
      message: message
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
