/*! *****************************************************************************
Copyright (c) Rajesh Patel. All rights reserved.
RajeshMPatel@gmail.com
LICENSE: MIT. https://opensource.org/licenses/MIT
***************************************************************************** */

const Order = require('../order');
const Driver = require('../driver');

function runningAvg(avg, n, data) {
    return avg + (data-avg)/(n+1);
}

orderMap = new Map();
driverMap = new Map();

function findOrder(orderId) {
    let order = orderMap.get(orderId);
    if (typeof(order) == "undefined") {
        return null;
    }
    return order;
}

function getRandomIntInRange(begin, end) {
    return begin + Math.floor(Math.random() * (end-begin));
}

module.exports.runningAvg = runningAvg;
module.exports.findOrder = findOrder;
module.exports.getRandomIntInRange = getRandomIntInRange;

