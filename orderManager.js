
const logger = require('./logger');

class OrderManager {
  constructor(match_order_w_driver) {
    // The FIFO queue is used if orders are not matched
    this.driverQueue = [];
    this.preparedOrderQueue = [];
    // Map is used if order and driver need to match
    this.pendingOrderMap = new Map();
    this.pendingDriverMap = new Map();

    this.ordersDelivered = 0;
    this.averageOrderTime = 0;
    this.averageOrderFulfilTime = 0;
    this.avaerageDriverDelay = 0;
    this.averageDriverWaitTime = 0;
    this.averageOrderWaitTime = 0;
    this.matchOrderWDriver = match_order_w_driver;
    this.ordersReceived = 0;
  }
    
  // When a new order is received, this function is called. It creates an event to be generated
  // after fulfilTime when order was supposed to be ready.
  orderReceived(order) {
    logger.log(`-->orderReceived ${JSON.stringify(order)}`);
    this.ordersReceived++;
    // send order for preparation and comeback after fulfilTime. We call that orderPrepared Event
    setTimeout(this._orderPrepared.bind(this), 1000* order.fulfilTime, order);
  }

  _findDriver(order) {
    let driver = this.pendingDriverMap.get(order.driverId);
    if (typeof(driver) == "undefined") {
      return null;
    }
    return driver;
  }
    
  _findOrder(driver) {
    let order = this.pendingOrderMap.get(driver.orderId);
    if (typeof(order) == "undefined") {
      return null;
    }
    return order;
  }

  // Event generated when order is prepared
  _orderPrepared(order) {
    order.FulfilledTime = Date.now();
    logger.log(`-->orderPrepared ${JSON.stringify(order)}`);
    if (this.matchOrderWDriver) {
      let driver = this._findDriver(order);
      if (null !== driver) {
        this._pickupMatchedOrder(driver, order);
        this.pendingDriverMap.delete(driver.id);
      } else{
        // Order not ready yet. Will push order in the map
        // logger.log(`orderPrepared: inserting orderId = ${order.id} in the map`);
        this.pendingOrderMap.set(order.id, order);
      }
    } else {
      this.preparedOrderQueue.push(order);
      this._pickupUnMatchedOrder();
    }
  }
    
  // When a new driver is dispatched, this function is called. It creates an event to be generated
  // after pickupDelay when driver was supposed to arrive to pick up order.
  dispatchDriver(driver) {
    logger.log(`-->dispatchDriver ${JSON.stringify(driver)}`);
    setTimeout(this._driverArrived.bind(this), 1000* driver.pickupDelay, driver);
  }

  _driverArrived(driver) {
    driver.arriveTime = Date.now();
    logger.log(`-->driverArrived ${JSON.stringify(driver)}`);
    if (this.matchOrderWDriver) {
      let order = this._findOrder(driver);
      if (null !== order) {
        this._pickupMatchedOrder(driver, order);
        this.pendingOrderMap.delete(order.id);
      } else {
        // Order not ready yet. Will push driver in the map
        // logger.log(`orderPrepared: inserting driverId = ${driver.id} in the map`);
        this.pendingDriverMap.set(driver.id, driver);
      }
    } else {
        this.driverQueue.push(driver);
        this._pickupUnMatchedOrder();
    }
  }

  _pickupMatchedOrder(driver, order) {
    // both prepared order queue and driver queue should be non-empty
    const now = Date.now();
    driver.pickupTime = now;
    order.pickupTime = now;
    // We have driver and order so deliver it right away
    logger.log(`-->Matched order pickedup ${order.name}, ${order.id} by driver ${driver.id} with order id ${driver.orderId}`);
    this._updateStats(order, driver);
  }

  _pickupUnMatchedOrder() {
    // both prepared order queue and driver queue should be non-empty
    if (this.driverQueue.length > 0 && this.preparedOrderQueue.length > 0) {
      // This logic will change when we have to match driver with order
      const now = Date.now();
      let driver = this.driverQueue.shift();
      let oldorder = this.preparedOrderQueue.shift();

      driver.pickupTime = now;
      oldorder.pickupTime = now;
      // We have driver and order so deliver it right away
      logger.log(`-->UnMatched order pickedup ${oldorder.name}, ${oldorder.id} by driver ${driver.id} with order id ${driver.orderId}`);
      this._updateStats(oldorder, driver);
    }
  }

  _updateStats(order, driver) {
    // logger.log(`-->updateStats`);
    // do statistics here
    this.ordersDelivered++;
    //const orderTime = order.getPickupTime() - order.getCreateTime();
    //this.averageOrderTime = this.averageOrderTime + (orderTime - this.averageOrderTime)/this.ordersDelivered;

    this.averageDriverWaitTime = this.averageDriverWaitTime + (driver.waitTime-this.averageDriverWaitTime)/this.ordersDelivered;
    this.averageOrderWaitTime = this.averageOrderWaitTime + (order.waitTime-this.averageOrderWaitTime)/this.ordersDelivered;

    this.averageOrderFulfilTime = this.averageOrderFulfilTime + (1000*order.fulfilTime - this.averageOrderFulfilTime)/this.ordersDelivered;
    this.avaerageDriverDelay = this.avaerageDriverDelay + (1000*driver.pickupDelay - this.avaerageDriverDelay)/this.ordersDelivered;


    // logger.log(`Order ${order.id} was picked up by ${driver.id} in ${orderTime}`);
    //logger.log(`Order TotalTime (ms) = ${order.getPickupTime() - order.getCreateTime()}`);
    if (this.ordersReceived === this.ordersDelivered) {
      logger.log(`Number of orders delivered = ${this.ordersDelivered}`);
      logger.log(`Average Order Wait Time = ${Math.trunc(this.averageOrderWaitTime)} ms`);
      logger.log(`Average Driver Wait Time = ${Math.trunc(this.averageDriverWaitTime)} ms`);
      logger.log(`Average Order Prep Time = ${Math.trunc(this.averageOrderFulfilTime)} ms`);
      logger.log(`Average Driver Delay = ${Math.trunc(this.avaerageDriverDelay)} ms`);
    }
  }
}

module.exports = OrderManager;

