var Response = require("../Models/Response");

function sendResponse(data, message, code, res) {
    const response = new Response(data, message);
    res.status(code).send(response);    
}

module.exports = {
    sendResponse
}