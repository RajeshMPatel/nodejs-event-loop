
class Driver {
  constructor(id, startTime, pickupDelay) {
    this.id = id;
    this.startTime = startTime;
    this.pickupDelay = pickupDelay;
    this.pickupTime = 0;
    this.orderId = 0;
    this.arriveTime = 0;
  }

  get waitTime() {
    return this.pickupTime - this.arriveTime;
  }
}

module.exports = Driver;
