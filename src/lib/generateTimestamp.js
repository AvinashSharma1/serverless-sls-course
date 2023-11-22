const timestamp = new Date().toISOString().replace(/[^0-9a-z]/g, '').substring(2, 14); // Adjust the length as needed

module.exports = timestamp;
