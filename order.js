
class Order {
    constructor(id, name, fulfilTime) {
        this.id = id;
        this.name = name;
        this.fulfilTime = fulfilTime;
        this.createTime = Date.now();
        this.FulfilledTime = 0;
        this.pickupTime = 0;
        this.driverId = 0;
    }

    get waitTime() {
        return this.pickupTime - this.FulfilledTime;
    }
}

module.exports = Order;
