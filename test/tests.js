
var expect = require('chai').expect;
var tests = require('./test_functions');
const Order = require('../order');
const Driver = require('../driver');


describe('testRunningAvg()', function () {
  it('Efficient Running Average', function () {
    avg = 0;
    rAvg = 0;
    total = 0;
    for (let i=1; i<10; i++) {
        data = 10*i;
        total += data;
        avg = total/i;
        rAvg = tests.runningAvg(rAvg, i-1, data);
        expect(avg).to.be.equal(rAvg);
    }
  });
});

describe('testMapFind()', function () {
  it('Test Find Items in Map', function () {

    // generate order and driver data
    for (let i=0; i<10; i++) {
        let id = "order-" + i;
        let name = "name-" + id;
        let fulfilTime = 10;
        let order = new Order(id, name, fulfilTime);

        let driver = new Driver(i, order.createTime, 10);
        driver.orderId = order.id;
        order.driverId = driver.id;
    
        orderMap.set(order.id, order);
        driverMap.set(driver.id, driver);
    }

    console.log("\tTest: Find non-existing order. Should return null");
    let order = tests.findOrder("5");
    expect(order).to.be.equal(null);

    console.log("\tTest: Find existing order. Should return order");
    order = tests.findOrder("order-5");
    expect(order.name).to.be.equal("name-order-5");
    
    console.log("\tTest: Delete existing order. Then find should return null");
    orderMap.delete("order-5");
    console.log("\tTest: Finding after deleting");
    order = tests.findOrder("order-5");
    expect(order).to.be.equal(null);
  
  });
});

describe('testGenerateRandomNumberInRange()', function () {
  it('Generates a random number in range', function () {
    for (let i=10; i< 20; i++) {
      let n = tests.getRandomIntInRange(5, i);
      expect(n).to.be.within(5, i);
    }
  });
  let n = tests.getRandomIntInRange(1, 1);
  expect(n).to.be.equal(1);
});

describe('testFIFO()', function () {
  it('Test FIFO Queue', function () {
    q = [];
    for (let i=0; i< 20; i++) {
      q.push(i);
    }

    expect(q[0]).to.be.equal(0);
    let n = q.shift();
    expect(n).to.be.equal(0);
    expect(q[0]).to.be.equal(1);
  });
});
