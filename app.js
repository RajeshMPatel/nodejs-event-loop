
const logger = require('./logger');
const OrderManager = require('./orderManager');
const Order = require('./order');
const Driver = require('./driver');
const fs = require('fs');

// In nodejs, we have to keep the event loop running. This is possible
// as long as there is a pending event. For our purpose, we create an event
// that is 11 days away. In production, it should be infinite time. 
// This event loop will terminate after 11 days. If we need to make it quit
// earlier, we should clear timeout when we want to quit. We do that with
// shutdown command.
const runTimer = setTimeout(function keepAlive(){}, 1.0e+9);

class App {
  constructor() {
    this.shuttingdown = false;
    this.nextDriverId = 1;
    this.orderManager = null;
    this.orders = null;
    this.orderReceiveInterval = 500;
    this.configPath = './config.json';
    this.dataPath = './orders-data.json';
    this.matchOrderWDriver = false;
  }

    // This is called to cleanup. It is a graceful shutdown on Ctrl+C.
    // All pending events are processed before the program quits.
    cleanup() {
      this.shuttingdown = true;
      // logger.log(`Done... ${this.shuttingdown}`);
      // logger.log("Processing all pending events");
    }
    
    _getRandomInRange(begin, end) {
      return begin + Math.random() * (end-begin);
    }
    
    _dataRead(orders) {
      logger.log(`-->dataRead. Number of orders = ${orders.length}`);
      this.orders = orders;
      // console.log(orders);
      setTimeout(this._receiveOrder.bind(this), this.orderReceiveInterval);
    }

    _readProgramConfig() {
      try {
        const fileData = fs.readFileSync(this.configPath, {encoding:'utf8', flag:'r'});
        const config = JSON.parse(fileData);
        return config;
      } catch(err) {
        logger.log(err);
        return null;
      }
    }

    _readOrderData() {
      this._jsonReader(this.dataPath, (err, objects) => {
        if (err) {
          logger.log(err);
          shutdown();
          return;
        }
    
        if (objects.length > 0) {
          setTimeout(this._dataRead.bind(this), 0, objects);
        }
      });
    }

    // This is the main function. It starts by reading config and reads data
    // It then processes each order until the last order is processed. 
    run() {
      let config = this._readProgramConfig();
      if (null === config) {
        shutdown();
        return;
      }

      this.matchOrderWDriver = config.match_driver_w_order;
      this.orderManager = new OrderManager(this.matchOrderWDriver);

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
      
      this._readOrderData();
    }

    _receiveOrder() {
      // logger.log(`-->receiveOrder`);
      if (this.shuttingdown) {
        // logger.log('<--receiveOrder: shutting down');
        return;
      }

      if (this.orders.length === 0)
      {
        shutdown();
        // logger.log('<--receiveOrder: finished processing orders');
        return;
      }
    
      let orderInfo = this.orders.shift();
      let order = new Order(orderInfo.id, orderInfo.name, orderInfo.fulfilTime);
    
      // send order for preparation and comeback after fulfilTime. We call that orderPrepared Event
      let pickupDelay = this._getRandomInRange(3, 15);
      let driver = new Driver(this.nextDriverId, order.createTime, pickupDelay);
      this.nextDriverId++;
      driver.orderId = order.id;

      order.driverId = driver.id;

      this.orderManager.orderReceived(order);
      this.orderManager.dispatchDriver(driver);
  
      if (!this.shuttingdown)
        setTimeout(this._receiveOrder.bind(this), this.orderReceiveInterval);
      //logger.log('<--receiveOrder');
    }
    
    _jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          return cb && cb(err);
        }
        try {
          const object = JSON.parse(fileData);
          return cb && cb(null, object);
        } catch(err1) {
          return cb && cb(err1);
        }
      });
    }
}

var myApp = new App();
myApp.run();

function shutdown() {
  clearTimeout(runTimer);
  myApp.cleanup();
}

