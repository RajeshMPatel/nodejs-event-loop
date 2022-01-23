
// Add abstraction layer for logging so we can have flexibility on
// where to log. Here we are logging to console. We could
// choose to log to a file instead.

// NOTE: Ideally you want to implement log levels. I will if I have 
// time. The important thing here is the abstraction.

// We can also use bunyan and other sophisticated loggers.

function log(message) {
  //const now = Date.now();
  //console.log(`${now}: ${message}`);
  console.log(message);
}

module.exports.log = log;
