var Response = require("../Models/Response");

function sendResponse(data, message, success, code, res) {
    const response = new Response(message, data, success);
    res.status(code).send(response);    
}

module.exports = {
    sendResponse
}