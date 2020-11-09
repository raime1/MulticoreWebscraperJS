var Response = require("../Models/Response");

function sendResponse(data, message, code, res) {
    const response = new Response(message, data);
    res.status(code).send(response);    
}

module.exports = {
    sendResponse
}