// class constructor
function Response(message, data, success) {
    this.message = message;
    this.data = data;
    this.success = success;
}

// export the class
module.exports = Response;
