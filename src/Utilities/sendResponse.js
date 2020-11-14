var Response = require("../Models/Response");

function sendResponse(data, message, times, code, res) {
    const response = new Response(message, data, times);
    res.status(code).send(response);    
}

module.exports = {
    sendResponse
}