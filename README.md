# Node.js Event Loop

## Introduction

I have already created an [example](https://github.com/RajeshMPatel/event-loop) on how to use event loop for asynchronous programming using C++. Since node.js is a very popular event loop based framework, I decided to create another program that demonstrates how that can be done in node.js using javascript. The concepts are very similar and I will try to highlight the similarities as we go.

## Shopping Order lifecycle Example
This one implements a different example than the C++. Here I have implemented an order placement/fulfilment/delivery system for a shopping website. The idea is that people place orders, the fulfilment center fills the orders and delivery system picks up the order for delivery. It is sufficient to demonstrate the asynchronous programming principles using these mechanisms.

The orders can be placed at a random time. It takes a finite time to fulfil the order. Each order can take a different amount of time to fulfil. So an order could become available sooner even if it was placed later. The delivery system dispatches a driver to pick up one order at a time. This is obviously inefficient in the real-world scenario. However, I have tried to keep the example simple. The driver can also become available at a random time and it takes finite time for the driver to arrive at the fulfilment center to pick up the order. Also, the driver can either pick up a specific order or it can pick up the first available order ready for delivery. If the order is not ready, the driver will wait if it is waiting for the matching order.

This example can be implemented using C++ example I posted earlier. There you would post a message or fire off an event whenever either order is received, or order is fulfiled or delivery truck arrives. Each action would have a callback function that would get invoked when the event happens.

In node.js world, the idea is similar. Here, instead of post, we generate an event by implementing EventEmitter and calling emit. This will then invoke the callback function. There you do the processing as you would in C++ world. In both cases, we do not poll. We do not create a separate thread and wait in that thread. Events are generated and posted to the same thread which processes in the order the events are received.

The underlying framework for nodejs and boost asio is the same. They both use EPOLL, kQueue or IOCP mechanism in Linux, Mac and Windows platforms respectively. nodejs is single threaded as are some of the high performance written in C/C++ such as nginx. So we do not lose performance advantage and due to asynchrnous nature, it nodejs scales to a large number of event producers

## Implementation
### To run the program:
`node app.js`
or
`npm start`

The program will terminate once it processes all the orders
To terminate the program abruptly, use Ctrl+C
To run unit tests:
go to test folder
`npm test`

### Project structure:
The following project contains following classes


| File | Description |
| -------- | -------- |
| app.js   | Main class that runs the app. Reads config and data and then dispatches the orders and drivers     |
| orderManager.js   | Manages orders. Once orders are received, it fulfils them and delivers them to drivers. It also keeps track of statstics     |
| logger.js   | Abstraction for logging. In case we want to log to a file. There are a lot of possible improvements here such as log level, option to write to a file etc.     |
| order.js   | Simple class to store order information     |
| driver.js   | Simple class to store driver information     |
| test folder   | folder containing unit tests based on Mocha framework.|

### Configuration:
config.json file stores the necessary configuration to run the program. The configuration is in JSON format.

Currently, the configuration has only one has parameter for choosing if the fulfilment center should wait for the matching order or not. This can be easily extended to store configuration for developer or production system.

* **true** will wait until matching order is prepared
* **false** will pick up the first available order for delivery
 
### Unit Testing:
Used **mocha** Framework. I tried to minimize the external dependencies for this. The only external package used is mocha for testing. JSHint was used to check for compile time errors. 

### Some Notes:
* The code was checked for syntax errors using jshint
* Javascript engine ES6 is required to run this program
* Map is used to match orders quickly with drivers
* Array is used for FIFO queue

Here is the example of the output

```
⏚ # master ± npm start                                                              

> nodejs@1.0.0 start
> node app.js

-->dataRead. Number of orders = 100
-->orderReceived {"id":"order-0","name":"Chartreuse phone card","fulfilTime":13,"createTime":1642965723665,"FulfilledTime":0,"pickupTime":0,"driverId":1}
-->dispatchDriver {"id":1,"startTime":1642965723665,"pickupDelay":5.311608397365247,"pickupTime":0,"orderId":"order-0","arriveTime":0}
-->orderReceived {"id":"order-1","name":"CadetBlue match","fulfilTime":8,"createTime":1642965724171,"FulfilledTime":0,"pickupTime":0,"driverId":2}
-->dispatchDriver {"id":2,"startTime":1642965724171,"pickupDelay":11.05018445684847,"pickupTime":0,"orderId":"order-1","arriveTime":0}
-->orderReceived {"id":"order-2","name":"Olive photo","fulfilTime":11,"createTime":1642965724674,"FulfilledTime":0,"pickupTime":0,"driverId":3}
-->dispatchDriver {"id":3,"startTime":1642965724674,"pickupDelay":12.59137678765978,"pickupTime":0,"orderId":"order-2","arriveTime":0}
-->orderReceived {"id":"order-3","name":"RoyalBlue phone card","fulfilTime":9,"createTime":1642965725175,"FulfilledTime":0,"pickupTime":0,"driverId":4}
-->dispatchDriver {"id":4,"startTime":1642965725175,"pickupDelay":7.3637240801831645,"pickupTime":0,"orderId":"order-3","arriveTime":0}
-->orderReceived {"id":"order-4","name":"Aquamarine headphone","fulfilTime":7,"createTime":1642965725677,"FulfilledTime":0,"pickupTime":0,"driverId":5}
-->dispatchDriver {"id":5,"startTime":1642965725677,"pickupDelay":13.910029611785628,"pickupTime":0,"orderId":"order-4","arriveTime":0}
-->orderReceived {"id":"order-5","name":"LightPink watch","fulfilTime":7,"createTime":1642965726178,"FulfilledTime":0,"pickupTime":0,"driverId":6}
-->dispatchDriver {"id":6,"startTime":1642965726178,"pickupDelay":7.898608966677427,"pickupTime":0,"orderId":"order-5","arriveTime":0}
-->orderReceived {"id":"order-6","name":"DarkGreen glasses","fulfilTime":6,"createTime":1642965726680,"FulfilledTime":0,"pickupTime":0,"driverId":7}
-->dispatchDriver {"id":7,"startTime":1642965726680,"pickupDelay":14.506375491323265,"pickupTime":0,"orderId":"order-6","arriveTime":0}
-->orderReceived {"id":"order-7","name":"Chartreuse alarm clock","fulfilTime":10,"createTime":1642965727182,"FulfilledTime":0,"pickupTime":0,"driverId":8}
-->dispatchDriver {"id":8,"startTime":1642965727182,"pickupDelay":5.686130967224657,"pickupTime":0,"orderId":"order-7","arriveTime":0}
-->orderReceived {"id":"order-8","name":"Chartreuse tissue","fulfilTime":7,"createTime":1642965727683,"FulfilledTime":0,"pickupTime":0,"driverId":9}
-->dispatchDriver {"id":9,"startTime":1642965727683,"pickupDelay":14.41609275198179,"pickupTime":0,"orderId":"order-8","arriveTime":0}
-->orderReceived {"id":"order-9","name":"OliveDrab painkiller","fulfilTime":3,"createTime":1642965728185,"FulfilledTime":0,"pickupTime":0,"driverId":10}
-->dispatchDriver {"id":10,"startTime":1642965728185,"pickupDelay":4.76303234334401,"pickupTime":0,"orderId":"order-9","arriveTime":0}
-->orderReceived {"id":"order-10","name":"Silver player","fulfilTime":13,"createTime":1642965728687,"FulfilledTime":0,"pickupTime":0,"driverId":11}
-->dispatchDriver {"id":11,"startTime":1642965728687,"pickupDelay":12.74311080092473,"pickupTime":0,"orderId":"order-10","arriveTime":0}
-->driverArrived {"id":1,"startTime":1642965723665,"pickupDelay":5.311608397365247,"pickupTime":0,"orderId":"order-0","arriveTime":1642965728978}
-->orderReceived {"id":"order-11","name":"DarkMagenta headphone","fulfilTime":7,"createTime":1642965729192,"FulfilledTime":0,"pickupTime":0,"driverId":12}
-->dispatchDriver {"id":12,"startTime":1642965729192,"pickupDelay":11.53863338622849,"pickupTime":0,"orderId":"order-11","arriveTime":0}
-->orderReceived {"id":"order-12","name":"DimGrey laptop","fulfilTime":9,"createTime":1642965729696,"FulfilledTime":0,"pickupTime":0,"driverId":13}
-->dispatchDriver {"id":13,"startTime":1642965729696,"pickupDelay":14.163809671196484,"pickupTime":0,"orderId":"order-12","arriveTime":0}
-->orderReceived {"id":"order-13","name":"LightSlateGrey pen","fulfilTime":13,"createTime":1642965730198,"FulfilledTime":0,"pickupTime":0,"driverId":14}
-->dispatchDriver {"id":14,"startTime":1642965730198,"pickupDelay":3.424521899183932,"pickupTime":0,"orderId":"order-13","arriveTime":0}
-->orderReceived {"id":"order-14","name":"SlateGrey player","fulfilTime":12,"createTime":1642965730700,"FulfilledTime":0,"pickupTime":0,"driverId":15}
-->dispatchDriver {"id":15,"startTime":1642965730700,"pickupDelay":4.019350930647588,"pickupTime":0,"orderId":"order-14","arriveTime":0}
-->orderPrepared {"id":"order-9","name":"OliveDrab painkiller","fulfilTime":3,"createTime":1642965728185,"FulfilledTime":1642965731186,"pickupTime":0,"driverId":10}
-->UnMatched order pickedup OliveDrab painkiller, order-9 by driver 1 with order id order-0
-->orderReceived {"id":"order-15","name":"Magenta glasses","fulfilTime":6,"createTime":1642965731201,"FulfilledTime":0,"pickupTime":0,"driverId":16}
-->dispatchDriver {"id":16,"startTime":1642965731201,"pickupDelay":9.549832234413559,"pickupTime":0,"orderId":"order-15","arriveTime":0}
-->orderReceived {"id":"order-16","name":"MediumSlateBlue sunscreen","fulfilTime":5,"createTime":1642965731703,"FulfilledTime":0,"pickupTime":0,"driverId":17}
-->dispatchDriver {"id":17,"startTime":1642965731703,"pickupDelay":14.970217295066035,"pickupTime":0,"orderId":"order-16","arriveTime":0}
-->orderPrepared {"id":"order-1","name":"CadetBlue match","fulfilTime":8,"createTime":1642965724171,"FulfilledTime":1642965732177,"pickupTime":0,"driverId":2}
-->orderReceived {"id":"order-17","name":"Beige headphone","fulfilTime":5,"createTime":1642965732205,"FulfilledTime":0,"pickupTime":0,"driverId":18}
-->dispatchDriver {"id":18,"startTime":1642965732205,"pickupDelay":11.401815577526875,"pickupTime":0,"orderId":"order-17","arriveTime":0}
-->driverArrived {"id":4,"startTime":1642965725175,"pickupDelay":7.3637240801831645,"pickupTime":0,"orderId":"order-3","arriveTime":1642965732538}
-->UnMatched order pickedup CadetBlue match, order-1 by driver 4 with order id order-3
-->orderPrepared {"id":"order-4","name":"Aquamarine headphone","fulfilTime":7,"createTime":1642965725677,"FulfilledTime":1642965732678,"pickupTime":0,"driverId":5}
-->orderPrepared {"id":"order-6","name":"DarkGreen glasses","fulfilTime":6,"createTime":1642965726680,"FulfilledTime":1642965732681,"pickupTime":0,"driverId":7}
-->orderReceived {"id":"order-18","name":"Cornsilk button","fulfilTime":3,"createTime":1642965732707,"FulfilledTime":0,"pickupTime":0,"driverId":19}
-->dispatchDriver {"id":19,"startTime":1642965732707,"pickupDelay":9.021377273359303,"pickupTime":0,"orderId":"order-18","arriveTime":0}
-->driverArrived {"id":8,"startTime":1642965727182,"pickupDelay":5.686130967224657,"pickupTime":0,"orderId":"order-7","arriveTime":1642965732874}
-->UnMatched order pickedup Aquamarine headphone, order-4 by driver 8 with order id order-7
-->driverArrived {"id":10,"startTime":1642965728185,"pickupDelay":4.76303234334401,"pickupTime":0,"orderId":"order-9","arriveTime":1642965732948}
-->UnMatched order pickedup DarkGreen glasses, order-6 by driver 10 with order id order-9
-->orderPrepared {"id":"order-5","name":"LightPink watch","fulfilTime":7,"createTime":1642965726178,"FulfilledTime":1642965733184,"pickupTime":0,"driverId":6}
-->orderReceived {"id":"order-19","name":"Gold chewing gum","fulfilTime":2,"createTime":1642965733212,"FulfilledTime":0,"pickupTime":0,"driverId":20}
-->dispatchDriver {"id":20,"startTime":1642965733212,"pickupDelay":4.289470423729803,"pickupTime":0,"orderId":"order-19","arriveTime":0}
-->driverArrived {"id":14,"startTime":1642965730198,"pickupDelay":3.424521899183932,"pickupTime":0,"orderId":"order-13","arriveTime":1642965733627}
-->UnMatched order pickedup LightPink watch, order-5 by driver 14 with order id order-13
-->orderReceived {"id":"order-20","name":"HotPink phone card","fulfilTime":6,"createTime":1642965733712,"FulfilledTime":0,"pickupTime":0,"driverId":21}
-->dispatchDriver {"id":21,"startTime":1642965733712,"pickupDelay":4.792075740941239,"pickupTime":0,"orderId":"order-20","arriveTime":0}
-->driverArrived {"id":6,"startTime":1642965726178,"pickupDelay":7.898608966677427,"pickupTime":0,"orderId":"order-5","arriveTime":1642965734079}
-->orderPrepared {"id":"order-3","name":"RoyalBlue phone card","fulfilTime":9,"createTime":1642965725175,"FulfilledTime":1642965734179,"pickupTime":0,"driverId":4}
-->UnMatched order pickedup RoyalBlue phone card, order-3 by driver 6 with order id order-5
-->orderReceived {"id":"order-21","name":"DeepSkyBlue magazine","fulfilTime":4,"createTime":1642965734213,"FulfilledTime":0,"pickupTime":0,"driverId":22}
-->dispatchDriver {"id":22,"startTime":1642965734213,"pickupDelay":9.786747947950968,"pickupTime":0,"orderId":"order-21","arriveTime":0}
-->orderPrepared {"id":"order-8","name":"Chartreuse tissue","fulfilTime":7,"createTime":1642965727683,"FulfilledTime":1642965734689,"pickupTime":0,"driverId":9}
-->orderReceived {"id":"order-22","name":"DeepPink light bulb","fulfilTime":6,"createTime":1642965734718,"FulfilledTime":0,"pickupTime":0,"driverId":23}
-->dispatchDriver {"id":23,"startTime":1642965734718,"pickupDelay":8.914742638537028,"pickupTime":0,"orderId":"order-22","arriveTime":0}
-->driverArrived {"id":15,"startTime":1642965730700,"pickupDelay":4.019350930647588,"pickupTime":0,"orderId":"order-14","arriveTime":1642965734720}
-->UnMatched order pickedup Chartreuse tissue, order-8 by driver 15 with order id order-14
-->orderPrepared {"id":"order-19","name":"Gold chewing gum","fulfilTime":2,"createTime":1642965733212,"FulfilledTime":1642965735213,"pickupTime":0,"driverId":20}
-->orderReceived {"id":"order-23","name":"DarkSalmon comb","fulfilTime":1,"createTime":1642965735219,"FulfilledTime":0,"pickupTime":0,"driverId":24}
-->dispatchDriver {"id":24,"startTime":1642965735219,"pickupDelay":14.263203792362752,"pickupTime":0,"orderId":"order-23","arriveTime":0}
-->driverArrived {"id":2,"startTime":1642965724171,"pickupDelay":11.05018445684847,"pickupTime":0,"orderId":"order-1","arriveTime":1642965735222}
-->UnMatched order pickedup Gold chewing gum, order-19 by driver 2 with order id order-1
-->orderPrepared {"id":"order-2","name":"Olive photo","fulfilTime":11,"createTime":1642965724674,"FulfilledTime":1642965735674,"pickupTime":0,"driverId":3}
-->orderPrepared {"id":"order-18","name":"Cornsilk button","fulfilTime":3,"createTime":1642965732707,"FulfilledTime":1642965735709,"pickupTime":0,"driverId":19}
-->orderReceived {"id":"order-24","name":"DarkSeaGreen postcard","fulfilTime":3,"createTime":1642965735719,"FulfilledTime":0,"pickupTime":0,"driverId":25}
-->dispatchDriver {"id":25,"startTime":1642965735719,"pickupDelay":13.24465846783858,"pickupTime":0,"orderId":"order-24","arriveTime":0}
-->orderPrepared {"id":"order-11","name":"DarkMagenta headphone","fulfilTime":7,"createTime":1642965729192,"FulfilledTime":1642965736197,"pickupTime":0,"driverId":12}
-->orderPrepared {"id":"order-23","name":"DarkSalmon comb","fulfilTime":1,"createTime":1642965735219,"FulfilledTime":1642965736224,"pickupTime":0,"driverId":24}
-->orderReceived {"id":"order-25","name":"RebeccaPurple postcard","fulfilTime":6,"createTime":1642965736224,"FulfilledTime":0,"pickupTime":0,"driverId":26}
-->dispatchDriver {"id":26,"startTime":1642965736224,"pickupDelay":14.720369075256745,"pickupTime":0,"orderId":"order-25","arriveTime":0}
-->orderPrepared {"id":"order-0","name":"Chartreuse phone card","fulfilTime":13,"createTime":1642965723665,"FulfilledTime":1642965736667,"pickupTime":0,"driverId":1}
-->orderPrepared {"id":"order-16","name":"MediumSlateBlue sunscreen","fulfilTime":5,"createTime":1642965731703,"FulfilledTime":1642965736708,"pickupTime":0,"driverId":17}
-->orderReceived {"id":"order-26","name":"DarkGrey battery","fulfilTime":2,"createTime":1642965736728,"FulfilledTime":0,"pickupTime":0,"driverId":27}
-->dispatchDriver {"id":27,"startTime":1642965736728,"pickupDelay":7.096912577118325,"pickupTime":0,"orderId":"order-26","arriveTime":0}
-->orderPrepared {"id":"order-7","name":"Chartreuse alarm clock","fulfilTime":10,"createTime":1642965727182,"FulfilledTime":1642965737187,"pickupTime":0,"driverId":8}
-->orderPrepared {"id":"order-15","name":"Magenta glasses","fulfilTime":6,"createTime":1642965731201,"FulfilledTime":1642965737205,"pickupTime":0,"driverId":16}
-->orderPrepared {"id":"order-17","name":"Beige headphone","fulfilTime":5,"createTime":1642965732205,"FulfilledTime":1642965737205,"pickupTime":0,"driverId":18}
-->orderReceived {"id":"order-27","name":"Crimson postcard","fulfilTime":8,"createTime":1642965737231,"FulfilledTime":0,"pickupTime":0,"driverId":28}
-->dispatchDriver {"id":28,"startTime":1642965737231,"pickupDelay":10.198734579535156,"pickupTime":0,"orderId":"order-27","arriveTime":0}
-->driverArrived {"id":3,"startTime":1642965724674,"pickupDelay":12.59137678765978,"pickupTime":0,"orderId":"order-2","arriveTime":1642965737265}
-->UnMatched order pickedup Olive photo, order-2 by driver 3 with order id order-2
-->driverArrived {"id":20,"startTime":1642965733212,"pickupDelay":4.289470423729803,"pickupTime":0,"orderId":"order-19","arriveTime":1642965737503}
-->UnMatched order pickedup Cornsilk button, order-18 by driver 20 with order id order-19
-->orderReceived {"id":"order-28","name":"SeaShell file","fulfilTime":1,"createTime":1642965737735,"FulfilledTime":0,"pickupTime":0,"driverId":29}
-->dispatchDriver {"id":29,"startTime":1642965737735,"pickupDelay":7.7662162818958675,"pickupTime":0,"orderId":"order-28","arriveTime":0}
-->orderPrepared {"id":"order-21","name":"DeepSkyBlue magazine","fulfilTime":4,"createTime":1642965734213,"FulfilledTime":1642965738216,"pickupTime":0,"driverId":22}
-->orderReceived {"id":"order-29","name":"Orange watch","fulfilTime":12,"createTime":1642965738236,"FulfilledTime":0,"pickupTime":0,"driverId":30}
-->dispatchDriver {"id":30,"startTime":1642965738236,"pickupDelay":9.36568091034557,"pickupTime":0,"orderId":"order-29","arriveTime":0}
-->driverArrived {"id":21,"startTime":1642965733712,"pickupDelay":4.792075740941239,"pickupTime":0,"orderId":"order-20","arriveTime":1642965738504}
-->UnMatched order pickedup DarkMagenta headphone, order-11 by driver 21 with order id order-20
-->orderPrepared {"id":"order-12","name":"DimGrey laptop","fulfilTime":9,"createTime":1642965729696,"FulfilledTime":1642965738699,"pickupTime":0,"driverId":13}
-->orderPrepared {"id":"order-24","name":"DarkSeaGreen postcard","fulfilTime":3,"createTime":1642965735719,"FulfilledTime":1642965738723,"pickupTime":0,"driverId":25}
-->orderPrepared {"id":"order-26","name":"DarkGrey battery","fulfilTime":2,"createTime":1642965736728,"FulfilledTime":1642965738731,"pickupTime":0,"driverId":27}
-->orderPrepared {"id":"order-28","name":"SeaShell file","fulfilTime":1,"createTime":1642965737735,"FulfilledTime":1642965738736,"pickupTime":0,"driverId":29}
-->orderReceived {"id":"order-30","name":"DarkKhaki pen","fulfilTime":12,"createTime":1642965738737,"FulfilledTime":0,"pickupTime":0,"driverId":31}
-->dispatchDriver {"id":31,"startTime":1642965738737,"pickupDelay":10.887743410532561,"pickupTime":0,"orderId":"order-30","arriveTime":0}
-->orderReceived {"id":"order-31","name":"BlueViolet case","fulfilTime":11,"createTime":1642965739240,"FulfilledTime":0,"pickupTime":0,"driverId":32}
-->dispatchDriver {"id":32,"startTime":1642965739240,"pickupDelay":5.061013723711952,"pickupTime":0,"orderId":"order-31","arriveTime":0}
-->driverArrived {"id":5,"startTime":1642965725677,"pickupDelay":13.910029611785628,"pickupTime":0,"orderId":"order-4","arriveTime":1642965739587}
-->UnMatched order pickedup DarkSalmon comb, order-23 by driver 5 with order id order-4
-->orderPrepared {"id":"order-20","name":"HotPink phone card","fulfilTime":6,"createTime":1642965733712,"FulfilledTime":1642965739714,"pickupTime":0,"driverId":21}
-->orderReceived {"id":"order-32","name":"DarkCyan phone card","fulfilTime":5,"createTime":1642965739745,"FulfilledTime":0,"pickupTime":0,"driverId":33}
-->dispatchDriver {"id":33,"startTime":1642965739745,"pickupDelay":5.94528971651137,"pickupTime":0,"orderId":"order-32","arriveTime":0}
-->orderReceived {"id":"order-33","name":"Linen camera","fulfilTime":14,"createTime":1642965740250,"FulfilledTime":0,"pickupTime":0,"driverId":34}
-->dispatchDriver {"id":34,"startTime":1642965740250,"pickupDelay":14.336879102352565,"pickupTime":0,"orderId":"order-33","arriveTime":0}
-->orderPrepared {"id":"order-22","name":"DeepPink light bulb","fulfilTime":6,"createTime":1642965734718,"FulfilledTime":1642965740723,"pickupTime":0,"driverId":23}
-->driverArrived {"id":12,"startTime":1642965729192,"pickupDelay":11.53863338622849,"pickupTime":0,"orderId":"order-11","arriveTime":1642965740732}
-->UnMatched order pickedup Chartreuse phone card, order-0 by driver 12 with order id order-11
-->driverArrived {"id":16,"startTime":1642965731201,"pickupDelay":9.549832234413559,"pickupTime":0,"orderId":"order-15","arriveTime":1642965740751}
-->UnMatched order pickedup MediumSlateBlue sunscreen, order-16 by driver 16 with order id order-15
-->orderReceived {"id":"order-34","name":"Salmon sunscreen","fulfilTime":9,"createTime":1642965740751,"FulfilledTime":0,"pickupTime":0,"driverId":35}
-->dispatchDriver {"id":35,"startTime":1642965740751,"pickupDelay":12.19767099928837,"pickupTime":0,"orderId":"order-34","arriveTime":0}
-->driverArrived {"id":7,"startTime":1642965726680,"pickupDelay":14.506375491323265,"pickupTime":0,"orderId":"order-6","arriveTime":1642965741191}
-->UnMatched order pickedup Chartreuse alarm clock, order-7 by driver 7 with order id order-6
-->orderReceived {"id":"order-35","name":"LightSlateGrey wallet","fulfilTime":8,"createTime":1642965741252,"FulfilledTime":0,"pickupTime":0,"driverId":36}
-->dispatchDriver {"id":36,"startTime":1642965741252,"pickupDelay":13.974858104063,"pickupTime":0,"orderId":"order-35","arriveTime":0}
-->driverArrived {"id":11,"startTime":1642965728687,"pickupDelay":12.74311080092473,"pickupTime":0,"orderId":"order-10","arriveTime":1642965741435}
-->UnMatched order pickedup Magenta glasses, order-15 by driver 11 with order id order-10
-->orderPrepared {"id":"order-10","name":"Silver player","fulfilTime":13,"createTime":1642965728687,"FulfilledTime":1642965741692,"pickupTime":0,"driverId":11}
-->driverArrived {"id":19,"startTime":1642965732707,"pickupDelay":9.021377273359303,"pickupTime":0,"orderId":"order-18","arriveTime":1642965741731}
-->UnMatched order pickedup Beige headphone, order-17 by driver 19 with order id order-18
-->orderReceived {"id":"order-36","name":"Pink file","fulfilTime":13,"createTime":1642965741753,"FulfilledTime":0,"pickupTime":0,"driverId":37}
-->dispatchDriver {"id":37,"startTime":1642965741753,"pickupDelay":3.248999361031461,"pickupTime":0,"orderId":"order-36","arriveTime":0}
-->driverArrived {"id":9,"startTime":1642965727683,"pickupDelay":14.41609275198179,"pickupTime":0,"orderId":"order-8","arriveTime":1642965742102}
-->UnMatched order pickedup DeepSkyBlue magazine, order-21 by driver 9 with order id order-8
-->orderPrepared {"id":"order-25","name":"RebeccaPurple postcard","fulfilTime":6,"createTime":1642965736224,"FulfilledTime":1642965742223,"pickupTime":0,"driverId":26}
-->orderReceived {"id":"order-37","name":"Yellow wallet","fulfilTime":1,"createTime":1642965742255,"FulfilledTime":0,"pickupTime":0,"driverId":38}
-->dispatchDriver {"id":38,"startTime":1642965742255,"pickupDelay":14.302039316566695,"pickupTime":0,"orderId":"order-37","arriveTime":0}
-->orderPrepared {"id":"order-14","name":"SlateGrey player","fulfilTime":12,"createTime":1642965730700,"FulfilledTime":1642965742702,"pickupTime":0,"driverId":15}
-->orderReceived {"id":"order-38","name":"SandyBrown postcard","fulfilTime":14,"createTime":1642965742756,"FulfilledTime":0,"pickupTime":0,"driverId":39}
-->dispatchDriver {"id":39,"startTime":1642965742756,"pickupDelay":4.771512249104647,"pickupTime":0,"orderId":"order-38","arriveTime":0}
-->orderPrepared {"id":"order-13","name":"LightSlateGrey pen","fulfilTime":13,"createTime":1642965730198,"FulfilledTime":1642965743202,"pickupTime":0,"driverId":14}
-->orderPrepared {"id":"order-37","name":"Yellow wallet","fulfilTime":1,"createTime":1642965742255,"FulfilledTime":1642965743256,"pickupTime":0,"driverId":38}
-->orderReceived {"id":"order-39","name":"Maroon lipstick","fulfilTime":7,"createTime":1642965743256,"FulfilledTime":0,"pickupTime":0,"driverId":40}
-->dispatchDriver {"id":40,"startTime":1642965743256,"pickupDelay":6.930757323577632,"pickupTime":0,"orderId":"order-39","arriveTime":0}
-->driverArrived {"id":18,"startTime":1642965732205,"pickupDelay":11.401815577526875,"pickupTime":0,"orderId":"order-17","arriveTime":1642965743606}
-->UnMatched order pickedup DimGrey laptop, order-12 by driver 18 with order id order-17
-->driverArrived {"id":23,"startTime":1642965734718,"pickupDelay":8.914742638537028,"pickupTime":0,"orderId":"order-22","arriveTime":1642965743636}
-->UnMatched order pickedup DarkSeaGreen postcard, order-24 by driver 23 with order id order-22
-->orderReceived {"id":"order-40","name":"LightCoral comb","fulfilTime":1,"createTime":1642965743762,"FulfilledTime":0,"pickupTime":0,"driverId":41}
-->dispatchDriver {"id":41,"startTime":1642965743762,"pickupDelay":12.67917068540374,"pickupTime":0,"orderId":"order-40","arriveTime":0}
-->driverArrived {"id":27,"startTime":1642965736728,"pickupDelay":7.096912577118325,"pickupTime":0,"orderId":"order-26","arriveTime":1642965743825}
-->UnMatched order pickedup DarkGrey battery, order-26 by driver 27 with order id order-26
-->driverArrived {"id":13,"startTime":1642965729696,"pickupDelay":14.163809671196484,"pickupTime":0,"orderId":"order-12","arriveTime":1642965743860}
-->UnMatched order pickedup SeaShell file, order-28 by driver 13 with order id order-12
-->driverArrived {"id":22,"startTime":1642965734213,"pickupDelay":9.786747947950968,"pickupTime":0,"orderId":"order-21","arriveTime":1642965744003}
-->UnMatched order pickedup HotPink phone card, order-20 by driver 22 with order id order-21
-->orderReceived {"id":"order-41","name":"SlateGrey postcard","fulfilTime":8,"createTime":1642965744266,"FulfilledTime":0,"pickupTime":0,"driverId":42}
-->dispatchDriver {"id":42,"startTime":1642965744266,"pickupDelay":12.927615603933134,"pickupTime":0,"orderId":"order-41","arriveTime":0}
-->driverArrived {"id":32,"startTime":1642965739240,"pickupDelay":5.061013723711952,"pickupTime":0,"orderId":"order-31","arriveTime":1642965744303}
-->UnMatched order pickedup DeepPink light bulb, order-22 by driver 32 with order id order-31
-->orderPrepared {"id":"order-32","name":"DarkCyan phone card","fulfilTime":5,"createTime":1642965739745,"FulfilledTime":1642965744747,"pickupTime":0,"driverId":33}
-->orderPrepared {"id":"order-40","name":"LightCoral comb","fulfilTime":1,"createTime":1642965743762,"FulfilledTime":1642965744766,"pickupTime":0,"driverId":41}
-->orderReceived {"id":"order-42","name":"NavajoWhite button","fulfilTime":11,"createTime":1642965744767,"FulfilledTime":0,"pickupTime":0,"driverId":43}
-->dispatchDriver {"id":43,"startTime":1642965744767,"pickupDelay":13.142766627500396,"pickupTime":0,"orderId":"order-42","arriveTime":0}
-->driverArrived {"id":37,"startTime":1642965741753,"pickupDelay":3.248999361031461,"pickupTime":0,"orderId":"order-36","arriveTime":1642965745004}
-->UnMatched order pickedup Silver player, order-10 by driver 37 with order id order-36
-->orderPrepared {"id":"order-27","name":"Crimson postcard","fulfilTime":8,"createTime":1642965737231,"FulfilledTime":1642965745235,"pickupTime":0,"driverId":28}
-->orderReceived {"id":"order-43","name":"Gray rubber","fulfilTime":8,"createTime":1642965745271,"FulfilledTime":0,"pickupTime":0,"driverId":44}
-->dispatchDriver {"id":44,"startTime":1642965745271,"pickupDelay":12.828542020345758,"pickupTime":0,"orderId":"order-43","arriveTime":0}
-->driverArrived {"id":29,"startTime":1642965737735,"pickupDelay":7.7662162818958675,"pickupTime":0,"orderId":"order-28","arriveTime":1642965745501}
-->UnMatched order pickedup RebeccaPurple postcard, order-25 by driver 29 with order id order-28
-->driverArrived {"id":33,"startTime":1642965739745,"pickupDelay":5.94528971651137,"pickupTime":0,"orderId":"order-32","arriveTime":1642965745696}
-->UnMatched order pickedup SlateGrey player, order-14 by driver 33 with order id order-32
-->orderReceived {"id":"order-44","name":"Maroon lipstick","fulfilTime":0,"createTime":1642965745772,"FulfilledTime":0,"pickupTime":0,"driverId":45}
-->dispatchDriver {"id":45,"startTime":1642965745772,"pickupDelay":4.792831688828985,"pickupTime":0,"orderId":"order-44","arriveTime":0}
-->orderPrepared {"id":"order-44","name":"Maroon lipstick","fulfilTime":0,"createTime":1642965745772,"FulfilledTime":1642965745773,"pickupTime":0,"driverId":45}
-->orderReceived {"id":"order-45","name":"DarkViolet case","fulfilTime":13,"createTime":1642965746278,"FulfilledTime":0,"pickupTime":0,"driverId":46}
-->dispatchDriver {"id":46,"startTime":1642965746278,"pickupDelay":8.191072366271023,"pickupTime":0,"orderId":"order-45","arriveTime":0}
-->driverArrived {"id":17,"startTime":1642965731703,"pickupDelay":14.970217295066035,"pickupTime":0,"orderId":"order-16","arriveTime":1642965746672}
-->UnMatched order pickedup LightSlateGrey pen, order-13 by driver 17 with order id order-16
-->orderReceived {"id":"order-46","name":"BlueViolet battery","fulfilTime":12,"createTime":1642965746781,"FulfilledTime":0,"pickupTime":0,"driverId":47}
-->dispatchDriver {"id":47,"startTime":1642965746781,"pickupDelay":3.178496781611809,"pickupTime":0,"orderId":"order-46","arriveTime":0}
-->orderReceived {"id":"order-47","name":"RoyalBlue mobile phone","fulfilTime":5,"createTime":1642965747282,"FulfilledTime":0,"pickupTime":0,"driverId":48}
-->dispatchDriver {"id":48,"startTime":1642965747282,"pickupDelay":8.850614646236568,"pickupTime":0,"orderId":"order-47","arriveTime":0}
-->driverArrived {"id":28,"startTime":1642965737231,"pickupDelay":10.198734579535156,"pickupTime":0,"orderId":"order-27","arriveTime":1642965747432}
-->UnMatched order pickedup Yellow wallet, order-37 by driver 28 with order id order-27
-->driverArrived {"id":39,"startTime":1642965742756,"pickupDelay":4.771512249104647,"pickupTime":0,"orderId":"order-38","arriveTime":1642965747527}
-->UnMatched order pickedup DarkCyan phone card, order-32 by driver 39 with order id order-38
-->driverArrived {"id":30,"startTime":1642965738236,"pickupDelay":9.36568091034557,"pickupTime":0,"orderId":"order-29","arriveTime":1642965747606}
-->UnMatched order pickedup LightCoral comb, order-40 by driver 30 with order id order-29
-->orderReceived {"id":"order-48","name":"Aquamarine key","fulfilTime":1,"createTime":1642965747784,"FulfilledTime":0,"pickupTime":0,"driverId":49}
-->dispatchDriver {"id":49,"startTime":1642965747784,"pickupDelay":9.802589792801111,"pickupTime":0,"orderId":"order-48","arriveTime":0}
-->orderReceived {"id":"order-49","name":"Maroon container","fulfilTime":13,"createTime":1642965748285,"FulfilledTime":0,"pickupTime":0,"driverId":50}
-->dispatchDriver {"id":50,"startTime":1642965748285,"pickupDelay":7.269575663965297,"pickupTime":0,"orderId":"order-49","arriveTime":0}
-->orderPrepared {"id":"order-48","name":"Aquamarine key","fulfilTime":1,"createTime":1642965747784,"FulfilledTime":1642965748789,"pickupTime":0,"driverId":49}
-->orderReceived {"id":"order-50","name":"Ivory purse","fulfilTime":2,"createTime":1642965748789,"FulfilledTime":0,"pickupTime":0,"driverId":51}
-->dispatchDriver {"id":51,"startTime":1642965748789,"pickupDelay":5.802858273067521,"pickupTime":0,"orderId":"order-50","arriveTime":0}
-->driverArrived {"id":25,"startTime":1642965735719,"pickupDelay":13.24465846783858,"pickupTime":0,"orderId":"order-24","arriveTime":1642965748966}
-->UnMatched order pickedup Crimson postcard, order-27 by driver 25 with order id order-24
-->orderPrepared {"id":"order-35","name":"LightSlateGrey wallet","fulfilTime":8,"createTime":1642965741252,"FulfilledTime":1642965749252,"pickupTime":0,"driverId":36}
-->orderReceived {"id":"order-51","name":"DarkOrange wallet","fulfilTime":5,"createTime":1642965749289,"FulfilledTime":0,"pickupTime":0,"driverId":52}
-->dispatchDriver {"id":52,"startTime":1642965749289,"pickupDelay":10.065772479687183,"pickupTime":0,"orderId":"order-51","arriveTime":0}
-->driverArrived {"id":24,"startTime":1642965735219,"pickupDelay":14.263203792362752,"pickupTime":0,"orderId":"order-23","arriveTime":1642965749486}
-->UnMatched order pickedup Maroon lipstick, order-44 by driver 24 with order id order-23
-->driverArrived {"id":31,"startTime":1642965738737,"pickupDelay":10.887743410532561,"pickupTime":0,"orderId":"order-30","arriveTime":1642965749627}
-->UnMatched order pickedup Aquamarine key, order-48 by driver 31 with order id order-30
-->orderPrepared {"id":"order-34","name":"Salmon sunscreen","fulfilTime":9,"createTime":1642965740751,"FulfilledTime":1642965749752,"pickupTime":0,"driverId":35}
-->orderReceived {"id":"order-52","name":"DarkRed pen","fulfilTime":7,"createTime":1642965749791,"FulfilledTime":0,"pickupTime":0,"driverId":53}
-->dispatchDriver {"id":53,"startTime":1642965749791,"pickupDelay":14.991042599386349,"pickupTime":0,"orderId":"order-52","arriveTime":0}
-->driverArrived {"id":47,"startTime":1642965746781,"pickupDelay":3.178496781611809,"pickupTime":0,"orderId":"order-46","arriveTime":1642965749959}
-->UnMatched order pickedup LightSlateGrey wallet, order-35 by driver 47 with order id order-46
-->driverArrived {"id":40,"startTime":1642965743256,"pickupDelay":6.930757323577632,"pickupTime":0,"orderId":"order-39","arriveTime":1642965750192}
-->UnMatched order pickedup Salmon sunscreen, order-34 by driver 40 with order id order-39
-->orderPrepared {"id":"order-29","name":"Orange watch","fulfilTime":12,"createTime":1642965738236,"FulfilledTime":1642965750241,"pickupTime":0,"driverId":30}
-->orderPrepared {"id":"order-31","name":"BlueViolet case","fulfilTime":11,"createTime":1642965739240,"FulfilledTime":1642965750242,"pickupTime":0,"driverId":32}
-->orderPrepared {"id":"order-39","name":"Maroon lipstick","fulfilTime":7,"createTime":1642965743256,"FulfilledTime":1642965750259,"pickupTime":0,"driverId":40}
-->orderReceived {"id":"order-53","name":"GreenYellow brush","fulfilTime":9,"createTime":1642965750292,"FulfilledTime":0,"pickupTime":0,"driverId":54}
-->dispatchDriver {"id":54,"startTime":1642965750292,"pickupDelay":11.115664625466273,"pickupTime":0,"orderId":"order-53","arriveTime":0}
-->driverArrived {"id":45,"startTime":1642965745772,"pickupDelay":4.792831688828985,"pickupTime":0,"orderId":"order-44","arriveTime":1642965750568}
-->UnMatched order pickedup Orange watch, order-29 by driver 45 with order id order-44
-->orderPrepared {"id":"order-30","name":"DarkKhaki pen","fulfilTime":12,"createTime":1642965738737,"FulfilledTime":1642965750742,"pickupTime":0,"driverId":31}
-->orderPrepared {"id":"order-50","name":"Ivory purse","fulfilTime":2,"createTime":1642965748789,"FulfilledTime":1642965750792,"pickupTime":0,"driverId":51}
-->orderReceived {"id":"order-54","name":"MidnightBlue pencil","fulfilTime":13,"createTime":1642965750792,"FulfilledTime":0,"pickupTime":0,"driverId":55}
-->dispatchDriver {"id":55,"startTime":1642965750792,"pickupDelay":12.69358006949329,"pickupTime":0,"orderId":"order-54","arriveTime":0}
-->driverArrived {"id":26,"startTime":1642965736224,"pickupDelay":14.720369075256745,"pickupTime":0,"orderId":"order-25","arriveTime":1642965750944}
-->UnMatched order pickedup BlueViolet case, order-31 by driver 26 with order id order-25
-->orderReceived {"id":"order-55","name":"PaleGoldenRod postcard","fulfilTime":13,"createTime":1642965751298,"FulfilledTime":0,"pickupTime":0,"driverId":56}
-->dispatchDriver {"id":56,"startTime":1642965751298,"pickupDelay":7.359348172811425,"pickupTime":0,"orderId":"order-55","arriveTime":0}
-->orderReceived {"id":"order-56","name":"DarkViolet light bulb","fulfilTime":13,"createTime":1642965751802,"FulfilledTime":0,"pickupTime":0,"driverId":57}
-->dispatchDriver {"id":57,"startTime":1642965751802,"pickupDelay":7.477011399596433,"pickupTime":0,"orderId":"order-56","arriveTime":0}
-->orderPrepared {"id":"order-41","name":"SlateGrey postcard","fulfilTime":8,"createTime":1642965744266,"FulfilledTime":1642965752268,"pickupTime":0,"driverId":42}
-->orderPrepared {"id":"order-47","name":"RoyalBlue mobile phone","fulfilTime":5,"createTime":1642965747282,"FulfilledTime":1642965752285,"pickupTime":0,"driverId":48}
-->orderReceived {"id":"order-57","name":"Crimson dictionary","fulfilTime":12,"createTime":1642965752303,"FulfilledTime":0,"pickupTime":0,"driverId":58}
-->dispatchDriver {"id":58,"startTime":1642965752303,"pickupDelay":14.937955844111885,"pickupTime":0,"orderId":"order-57","arriveTime":0}
-->orderReceived {"id":"order-58","name":"Wheat key","fulfilTime":6,"createTime":1642965752803,"FulfilledTime":0,"pickupTime":0,"driverId":59}
-->dispatchDriver {"id":59,"startTime":1642965752803,"pickupDelay":10.010400589347793,"pickupTime":0,"orderId":"order-58","arriveTime":0}
-->driverArrived {"id":35,"startTime":1642965740751,"pickupDelay":12.19767099928837,"pickupTime":0,"orderId":"order-34","arriveTime":1642965752954}
-->UnMatched order pickedup Maroon lipstick, order-39 by driver 35 with order id order-34
-->orderPrepared {"id":"order-43","name":"Gray rubber","fulfilTime":8,"createTime":1642965745271,"FulfilledTime":1642965753274,"pickupTime":0,"driverId":44}
-->orderReceived {"id":"order-59","name":"Olive camera","fulfilTime":14,"createTime":1642965753305,"FulfilledTime":0,"pickupTime":0,"driverId":60}
-->dispatchDriver {"id":60,"startTime":1642965753305,"pickupDelay":4.0597836844003306,"pickupTime":0,"orderId":"order-59","arriveTime":0}
-->orderReceived {"id":"order-60","name":"MintCream light bulb","fulfilTime":12,"createTime":1642965753807,"FulfilledTime":0,"pickupTime":0,"driverId":61}
-->dispatchDriver {"id":61,"startTime":1642965753807,"pickupDelay":13.019079692608985,"pickupTime":0,"orderId":"order-60","arriveTime":0}
-->orderPrepared {"id":"order-33","name":"Linen camera","fulfilTime":14,"createTime":1642965740250,"FulfilledTime":1642965754254,"pickupTime":0,"driverId":34}
-->orderPrepared {"id":"order-51","name":"DarkOrange wallet","fulfilTime":5,"createTime":1642965749289,"FulfilledTime":1642965754292,"pickupTime":0,"driverId":52}
-->orderReceived {"id":"order-61","name":"DarkGreen scissors","fulfilTime":2,"createTime":1642965754309,"FulfilledTime":0,"pickupTime":0,"driverId":62}
-->dispatchDriver {"id":62,"startTime":1642965754309,"pickupDelay":3.6279456220364414,"pickupTime":0,"orderId":"order-61","arriveTime":0}
-->driverArrived {"id":46,"startTime":1642965746278,"pickupDelay":8.191072366271023,"pickupTime":0,"orderId":"order-45","arriveTime":1642965754474}
-->UnMatched order pickedup DarkKhaki pen, order-30 by driver 46 with order id order-45
-->driverArrived {"id":34,"startTime":1642965740250,"pickupDelay":14.336879102352565,"pickupTime":0,"orderId":"order-33","arriveTime":1642965754588}
-->UnMatched order pickedup Ivory purse, order-50 by driver 34 with order id order-33
-->driverArrived {"id":51,"startTime":1642965748789,"pickupDelay":5.802858273067521,"pickupTime":0,"orderId":"order-50","arriveTime":1642965754591}
-->UnMatched order pickedup SlateGrey postcard, order-41 by driver 51 with order id order-50
-->orderPrepared {"id":"order-36","name":"Pink file","fulfilTime":13,"createTime":1642965741753,"FulfilledTime":1642965754755,"pickupTime":0,"driverId":37}
-->orderReceived {"id":"order-62","name":"Sienna lighter","fulfilTime":4,"createTime":1642965754809,"FulfilledTime":0,"pickupTime":0,"driverId":63}
-->dispatchDriver {"id":63,"startTime":1642965754809,"pickupDelay":14.675557325402941,"pickupTime":0,"orderId":"order-62","arriveTime":0}
-->driverArrived {"id":36,"startTime":1642965741252,"pickupDelay":13.974858104063,"pickupTime":0,"orderId":"order-35","arriveTime":1642965755229}
-->UnMatched order pickedup RoyalBlue mobile phone, order-47 by driver 36 with order id order-35
-->orderReceived {"id":"order-63","name":"LemonChiffon key","fulfilTime":8,"createTime":1642965755312,"FulfilledTime":0,"pickupTime":0,"driverId":64}
-->dispatchDriver {"id":64,"startTime":1642965755312,"pickupDelay":7.495878224794569,"pickupTime":0,"orderId":"order-63","arriveTime":0}
-->driverArrived {"id":50,"startTime":1642965748285,"pickupDelay":7.269575663965297,"pickupTime":0,"orderId":"order-49","arriveTime":1642965755556}
-->UnMatched order pickedup Gray rubber, order-43 by driver 50 with order id order-49
-->orderPrepared {"id":"order-42","name":"NavajoWhite button","fulfilTime":11,"createTime":1642965744767,"FulfilledTime":1642965755768,"pickupTime":0,"driverId":43}
-->orderReceived {"id":"order-64","name":"RebeccaPurple cigarette","fulfilTime":11,"createTime":1642965755813,"FulfilledTime":0,"pickupTime":0,"driverId":65}
-->dispatchDriver {"id":65,"startTime":1642965755813,"pickupDelay":14.271983910143561,"pickupTime":0,"orderId":"order-64","arriveTime":0}
-->driverArrived {"id":48,"startTime":1642965747282,"pickupDelay":8.850614646236568,"pickupTime":0,"orderId":"order-47","arriveTime":1642965756132}
-->UnMatched order pickedup Linen camera, order-33 by driver 48 with order id order-47
-->orderPrepared {"id":"order-61","name":"DarkGreen scissors","fulfilTime":2,"createTime":1642965754309,"FulfilledTime":1642965756313,"pickupTime":0,"driverId":62}
-->orderReceived {"id":"order-65","name":"LightGrey pen","fulfilTime":3,"createTime":1642965756313,"FulfilledTime":0,"pickupTime":0,"driverId":66}
-->dispatchDriver {"id":66,"startTime":1642965756313,"pickupDelay":14.611685494982577,"pickupTime":0,"orderId":"order-65","arriveTime":0}
-->driverArrived {"id":41,"startTime":1642965743762,"pickupDelay":12.67917068540374,"pickupTime":0,"orderId":"order-40","arriveTime":1642965756446}
-->UnMatched order pickedup DarkOrange wallet, order-51 by driver 41 with order id order-40
-->driverArrived {"id":38,"startTime":1642965742255,"pickupDelay":14.302039316566695,"pickupTime":0,"orderId":"order-37","arriveTime":1642965756557}
-->UnMatched order pickedup Pink file, order-36 by driver 38 with order id order-37
-->orderPrepared {"id":"order-38","name":"SandyBrown postcard","fulfilTime":14,"createTime":1642965742756,"FulfilledTime":1642965756761,"pickupTime":0,"driverId":39}
-->orderPrepared {"id":"order-52","name":"DarkRed pen","fulfilTime":7,"createTime":1642965749791,"FulfilledTime":1642965756796,"pickupTime":0,"driverId":53}
-->orderReceived {"id":"order-66","name":"DarkMagenta magazine","fulfilTime":11,"createTime":1642965756813,"FulfilledTime":0,"pickupTime":0,"driverId":67}
-->dispatchDriver {"id":67,"startTime":1642965756813,"pickupDelay":8.494556592621716,"pickupTime":0,"orderId":"order-66","arriveTime":0}
-->driverArrived {"id":42,"startTime":1642965744266,"pickupDelay":12.927615603933134,"pickupTime":0,"orderId":"order-41","arriveTime":1642965757198}
-->UnMatched order pickedup NavajoWhite button, order-42 by driver 42 with order id order-41
-->orderReceived {"id":"order-67","name":"OliveDrab camera","fulfilTime":7,"createTime":1642965757314,"FulfilledTime":0,"pickupTime":0,"driverId":68}
-->dispatchDriver {"id":68,"startTime":1642965757314,"pickupDelay":14.058160417208418,"pickupTime":0,"orderId":"order-67","arriveTime":0}
-->driverArrived {"id":60,"startTime":1642965753305,"pickupDelay":4.0597836844003306,"pickupTime":0,"orderId":"order-59","arriveTime":1642965757364}
-->UnMatched order pickedup DarkGreen scissors, order-61 by driver 60 with order id order-59
-->driverArrived {"id":49,"startTime":1642965747784,"pickupDelay":9.802589792801111,"pickupTime":0,"orderId":"order-48","arriveTime":1642965757589}
-->UnMatched order pickedup SandyBrown postcard, order-38 by driver 49 with order id order-48
-->orderReceived {"id":"order-68","name":"SpringGreen lighter","fulfilTime":12,"createTime":1642965757815,"FulfilledTime":0,"pickupTime":0,"driverId":69}
-->dispatchDriver {"id":69,"startTime":1642965757815,"pickupDelay":7.082251722656645,"pickupTime":0,"orderId":"order-68","arriveTime":0}
-->driverArrived {"id":43,"startTime":1642965744767,"pickupDelay":13.142766627500396,"pickupTime":0,"orderId":"order-42","arriveTime":1642965757910}
-->UnMatched order pickedup DarkRed pen, order-52 by driver 43 with order id order-42
-->driverArrived {"id":62,"startTime":1642965754309,"pickupDelay":3.6279456220364414,"pickupTime":0,"orderId":"order-61","arriveTime":1642965757937}
-->driverArrived {"id":44,"startTime":1642965745271,"pickupDelay":12.828542020345758,"pickupTime":0,"orderId":"order-43","arriveTime":1642965758104}
-->orderReceived {"id":"order-69","name":"Lime pen","fulfilTime":9,"createTime":1642965758316,"FulfilledTime":0,"pickupTime":0,"driverId":70}
-->dispatchDriver {"id":70,"startTime":1642965758316,"pickupDelay":8.625560430757044,"pickupTime":0,"orderId":"order-69","arriveTime":0}
-->driverArrived {"id":56,"startTime":1642965751298,"pickupDelay":7.359348172811425,"pickupTime":0,"orderId":"order-55","arriveTime":1642965758663}
-->orderPrepared {"id":"order-46","name":"BlueViolet battery","fulfilTime":12,"createTime":1642965746781,"FulfilledTime":1642965758782,"pickupTime":0,"driverId":47}
-->UnMatched order pickedup BlueViolet battery, order-46 by driver 62 with order id order-61
-->orderPrepared {"id":"order-58","name":"Wheat key","fulfilTime":6,"createTime":1642965752803,"FulfilledTime":1642965758805,"pickupTime":0,"driverId":59}
-->UnMatched order pickedup Wheat key, order-58 by driver 44 with order id order-43
-->orderPrepared {"id":"order-62","name":"Sienna lighter","fulfilTime":4,"createTime":1642965754809,"FulfilledTime":1642965758809,"pickupTime":0,"driverId":63}
-->UnMatched order pickedup Sienna lighter, order-62 by driver 56 with order id order-55
-->orderReceived {"id":"order-70","name":"MediumVioletRed battery","fulfilTime":12,"createTime":1642965758818,"FulfilledTime":0,"pickupTime":0,"driverId":71}
-->dispatchDriver {"id":71,"startTime":1642965758818,"pickupDelay":14.115434301300926,"pickupTime":0,"orderId":"order-70","arriveTime":0}
-->orderPrepared {"id":"order-45","name":"DarkViolet case","fulfilTime":13,"createTime":1642965746278,"FulfilledTime":1642965759282,"pickupTime":0,"driverId":46}
-->driverArrived {"id":57,"startTime":1642965751802,"pickupDelay":7.477011399596433,"pickupTime":0,"orderId":"order-56","arriveTime":1642965759282}
-->UnMatched order pickedup DarkViolet case, order-45 by driver 57 with order id order-56
-->orderPrepared {"id":"order-53","name":"GreenYellow brush","fulfilTime":9,"createTime":1642965750292,"FulfilledTime":1642965759293,"pickupTime":0,"driverId":54}
-->orderPrepared {"id":"order-65","name":"LightGrey pen","fulfilTime":3,"createTime":1642965756313,"FulfilledTime":1642965759317,"pickupTime":0,"driverId":66}
-->orderReceived {"id":"order-71","name":"NavajoWhite alarm clock","fulfilTime":6,"createTime":1642965759318,"FulfilledTime":0,"pickupTime":0,"driverId":72}
-->dispatchDriver {"id":72,"startTime":1642965759318,"pickupDelay":3.9622728916532672,"pickupTime":0,"orderId":"order-71","arriveTime":0}
-->driverArrived {"id":52,"startTime":1642965749289,"pickupDelay":10.065772479687183,"pickupTime":0,"orderId":"order-51","arriveTime":1642965759357}
-->UnMatched order pickedup GreenYellow brush, order-53 by driver 52 with order id order-51
-->orderReceived {"id":"order-72","name":"LawnGreen brush","fulfilTime":10,"createTime":1642965759820,"FulfilledTime":0,"pickupTime":0,"driverId":73}
-->dispatchDriver {"id":73,"startTime":1642965759820,"pickupDelay":9.960161346197527,"pickupTime":0,"orderId":"order-72","arriveTime":0}
-->orderReceived {"id":"order-73","name":"AntiqueWhite bottle","fulfilTime":10,"createTime":1642965760320,"FulfilledTime":0,"pickupTime":0,"driverId":74}
-->dispatchDriver {"id":74,"startTime":1642965760320,"pickupDelay":9.513137396744545,"pickupTime":0,"orderId":"order-73","arriveTime":0}
-->orderReceived {"id":"order-74","name":"Gold mobile phone","fulfilTime":9,"createTime":1642965760824,"FulfilledTime":0,"pickupTime":0,"driverId":75}
-->dispatchDriver {"id":75,"startTime":1642965760824,"pickupDelay":13.337906967922734,"pickupTime":0,"orderId":"order-74","arriveTime":0}
-->orderPrepared {"id":"order-49","name":"Maroon container","fulfilTime":13,"createTime":1642965748285,"FulfilledTime":1642965761285,"pickupTime":0,"driverId":50}
-->orderReceived {"id":"order-75","name":"Navy chewing gum","fulfilTime":2,"createTime":1642965761327,"FulfilledTime":0,"pickupTime":0,"driverId":76}
-->dispatchDriver {"id":76,"startTime":1642965761327,"pickupDelay":11.321499690391247,"pickupTime":0,"orderId":"order-75","arriveTime":0}
-->driverArrived {"id":54,"startTime":1642965750292,"pickupDelay":11.115664625466273,"pickupTime":0,"orderId":"order-53","arriveTime":1642965761409}
-->UnMatched order pickedup LightGrey pen, order-65 by driver 54 with order id order-53
-->orderReceived {"id":"order-76","name":"LightSalmon laptop","fulfilTime":14,"createTime":1642965761833,"FulfilledTime":0,"pickupTime":0,"driverId":77}
-->dispatchDriver {"id":77,"startTime":1642965761833,"pickupDelay":4.787548962141935,"pickupTime":0,"orderId":"order-76","arriveTime":0}
-->orderReceived {"id":"order-77","name":"Silver wallet","fulfilTime":11,"createTime":1642965762336,"FulfilledTime":0,"pickupTime":0,"driverId":78}
-->dispatchDriver {"id":78,"startTime":1642965762336,"pickupDelay":8.167588198188023,"pickupTime":0,"orderId":"order-77","arriveTime":0}
-->driverArrived {"id":64,"startTime":1642965755312,"pickupDelay":7.495878224794569,"pickupTime":0,"orderId":"order-63","arriveTime":1642965762810}
-->UnMatched order pickedup Maroon container, order-49 by driver 64 with order id order-63
-->driverArrived {"id":59,"startTime":1642965752803,"pickupDelay":10.010400589347793,"pickupTime":0,"orderId":"order-58","arriveTime":1642965762813}
-->orderReceived {"id":"order-78","name":"Brown lighter","fulfilTime":6,"createTime":1642965762838,"FulfilledTime":0,"pickupTime":0,"driverId":79}
-->dispatchDriver {"id":79,"startTime":1642965762838,"pickupDelay":13.981086207720255,"pickupTime":0,"orderId":"order-78","arriveTime":0}
-->driverArrived {"id":72,"startTime":1642965759318,"pickupDelay":3.9622728916532672,"pickupTime":0,"orderId":"order-71","arriveTime":1642965763285}
-->orderPrepared {"id":"order-63","name":"LemonChiffon key","fulfilTime":8,"createTime":1642965755312,"FulfilledTime":1642965763316,"pickupTime":0,"driverId":64}
-->UnMatched order pickedup LemonChiffon key, order-63 by driver 59 with order id order-58
-->orderPrepared {"id":"order-75","name":"Navy chewing gum","fulfilTime":2,"createTime":1642965761327,"FulfilledTime":1642965763328,"pickupTime":0,"driverId":76}
-->UnMatched order pickedup Navy chewing gum, order-75 by driver 72 with order id order-71
-->orderReceived {"id":"order-79","name":"Indigo coin","fulfilTime":12,"createTime":1642965763340,"FulfilledTime":0,"pickupTime":0,"driverId":80}
-->dispatchDriver {"id":80,"startTime":1642965763340,"pickupDelay":12.350276844708008,"pickupTime":0,"orderId":"order-79","arriveTime":0}
-->driverArrived {"id":55,"startTime":1642965750792,"pickupDelay":12.69358006949329,"pickupTime":0,"orderId":"order-54","arriveTime":1642965763485}
-->orderPrepared {"id":"order-54","name":"MidnightBlue pencil","fulfilTime":13,"createTime":1642965750792,"FulfilledTime":1642965763794,"pickupTime":0,"driverId":55}
-->UnMatched order pickedup MidnightBlue pencil, order-54 by driver 55 with order id order-54
-->orderReceived {"id":"order-80","name":"PaleVioletRed phone card","fulfilTime":14,"createTime":1642965763845,"FulfilledTime":0,"pickupTime":0,"driverId":81}
-->dispatchDriver {"id":81,"startTime":1642965763845,"pickupDelay":13.72211664277884,"pickupTime":0,"orderId":"order-80","arriveTime":0}
-->orderPrepared {"id":"order-55","name":"PaleGoldenRod postcard","fulfilTime":13,"createTime":1642965751298,"FulfilledTime":1642965764303,"pickupTime":0,"driverId":56}
-->orderPrepared {"id":"order-57","name":"Crimson dictionary","fulfilTime":12,"createTime":1642965752303,"FulfilledTime":1642965764303,"pickupTime":0,"driverId":58}
-->orderPrepared {"id":"order-67","name":"OliveDrab camera","fulfilTime":7,"createTime":1642965757314,"FulfilledTime":1642965764317,"pickupTime":0,"driverId":68}
-->orderReceived {"id":"order-81","name":"HoneyDew coin","fulfilTime":3,"createTime":1642965764346,"FulfilledTime":0,"pickupTime":0,"driverId":82}
-->dispatchDriver {"id":82,"startTime":1642965764346,"pickupDelay":4.63376284272915,"pickupTime":0,"orderId":"order-81","arriveTime":0}
-->driverArrived {"id":53,"startTime":1642965749791,"pickupDelay":14.991042599386349,"pickupTime":0,"orderId":"order-52","arriveTime":1642965764786}
-->UnMatched order pickedup PaleGoldenRod postcard, order-55 by driver 53 with order id order-52
-->orderPrepared {"id":"order-56","name":"DarkViolet light bulb","fulfilTime":13,"createTime":1642965751802,"FulfilledTime":1642965764803,"pickupTime":0,"driverId":57}
-->orderReceived {"id":"order-82","name":"DarkGray clip","fulfilTime":8,"createTime":1642965764852,"FulfilledTime":0,"pickupTime":0,"driverId":83}
-->dispatchDriver {"id":83,"startTime":1642965764852,"pickupDelay":10.780480941440523,"pickupTime":0,"orderId":"order-82","arriveTime":0}
-->driverArrived {"id":69,"startTime":1642965757815,"pickupDelay":7.082251722656645,"pickupTime":0,"orderId":"order-68","arriveTime":1642965764902}
-->UnMatched order pickedup Crimson dictionary, order-57 by driver 69 with order id order-68
-->driverArrived {"id":67,"startTime":1642965756813,"pickupDelay":8.494556592621716,"pickupTime":0,"orderId":"order-66","arriveTime":1642965765308}
-->UnMatched order pickedup OliveDrab camera, order-67 by driver 67 with order id order-66
-->orderPrepared {"id":"order-71","name":"NavajoWhite alarm clock","fulfilTime":6,"createTime":1642965759318,"FulfilledTime":1642965765320,"pickupTime":0,"driverId":72}
-->orderReceived {"id":"order-83","name":"NavajoWhite packet","fulfilTime":13,"createTime":1642965765353,"FulfilledTime":0,"pickupTime":0,"driverId":84}
-->dispatchDriver {"id":84,"startTime":1642965765353,"pickupDelay":5.736542328729399,"pickupTime":0,"orderId":"order-83","arriveTime":0}
-->orderPrepared {"id":"order-60","name":"MintCream light bulb","fulfilTime":12,"createTime":1642965753807,"FulfilledTime":1642965765810,"pickupTime":0,"driverId":61}
-->orderReceived {"id":"order-84","name":"Black alarm clock","fulfilTime":12,"createTime":1642965765859,"FulfilledTime":0,"pickupTime":0,"driverId":85}
-->dispatchDriver {"id":85,"startTime":1642965765859,"pickupDelay":14.06787078565656,"pickupTime":0,"orderId":"order-84","arriveTime":0}
-->orderReceived {"id":"order-85","name":"DarkGray light bulb","fulfilTime":14,"createTime":1642965766364,"FulfilledTime":0,"pickupTime":0,"driverId":86}
-->dispatchDriver {"id":86,"startTime":1642965766364,"pickupDelay":9.543919611167166,"pickupTime":0,"orderId":"order-85","arriveTime":0}
-->driverArrived {"id":77,"startTime":1642965761833,"pickupDelay":4.787548962141935,"pickupTime":0,"orderId":"order-76","arriveTime":1642965766621}
-->UnMatched order pickedup DarkViolet light bulb, order-56 by driver 77 with order id order-76
-->orderPrepared {"id":"order-64","name":"RebeccaPurple cigarette","fulfilTime":11,"createTime":1642965755813,"FulfilledTime":1642965766814,"pickupTime":0,"driverId":65}
-->driverArrived {"id":61,"startTime":1642965753807,"pickupDelay":13.019079692608985,"pickupTime":0,"orderId":"order-60","arriveTime":1642965766826}
-->UnMatched order pickedup NavajoWhite alarm clock, order-71 by driver 61 with order id order-60
-->orderReceived {"id":"order-86","name":"Ivory notebook","fulfilTime":10,"createTime":1642965766865,"FulfilledTime":0,"pickupTime":0,"driverId":87}
-->dispatchDriver {"id":87,"startTime":1642965766865,"pickupDelay":5.501804814749996,"pickupTime":0,"orderId":"order-86","arriveTime":0}
-->driverArrived {"id":70,"startTime":1642965758316,"pickupDelay":8.625560430757044,"pickupTime":0,"orderId":"order-69","arriveTime":1642965766944}
-->UnMatched order pickedup MintCream light bulb, order-60 by driver 70 with order id order-69
-->driverArrived {"id":58,"startTime":1642965752303,"pickupDelay":14.937955844111885,"pickupTime":0,"orderId":"order-57","arriveTime":1642965767239}
-->UnMatched order pickedup RebeccaPurple cigarette, order-64 by driver 58 with order id order-57
-->orderPrepared {"id":"order-59","name":"Olive camera","fulfilTime":14,"createTime":1642965753305,"FulfilledTime":1642965767306,"pickupTime":0,"driverId":60}
-->orderPrepared {"id":"order-69","name":"Lime pen","fulfilTime":9,"createTime":1642965758316,"FulfilledTime":1642965767316,"pickupTime":0,"driverId":70}
-->orderPrepared {"id":"order-81","name":"HoneyDew coin","fulfilTime":3,"createTime":1642965764346,"FulfilledTime":1642965767348,"pickupTime":0,"driverId":82}
-->orderReceived {"id":"order-87","name":"Grey wallet","fulfilTime":14,"createTime":1642965767371,"FulfilledTime":0,"pickupTime":0,"driverId":88}
-->dispatchDriver {"id":88,"startTime":1642965767371,"pickupDelay":10.973522302926881,"pickupTime":0,"orderId":"order-87","arriveTime":0}
-->orderPrepared {"id":"order-66","name":"DarkMagenta magazine","fulfilTime":11,"createTime":1642965756813,"FulfilledTime":1642965767815,"pickupTime":0,"driverId":67}
-->orderReceived {"id":"order-88","name":"SaddleBrown clip","fulfilTime":13,"createTime":1642965767873,"FulfilledTime":0,"pickupTime":0,"driverId":89}
-->dispatchDriver {"id":89,"startTime":1642965767873,"pickupDelay":11.63255618189947,"pickupTime":0,"orderId":"order-88","arriveTime":0}
-->orderReceived {"id":"order-89","name":"LightSeaGreen battery","fulfilTime":10,"createTime":1642965768373,"FulfilledTime":0,"pickupTime":0,"driverId":90}
-->dispatchDriver {"id":90,"startTime":1642965768373,"pickupDelay":14.230856882266721,"pickupTime":0,"orderId":"order-89","arriveTime":0}
-->orderPrepared {"id":"order-78","name":"Brown lighter","fulfilTime":6,"createTime":1642965762838,"FulfilledTime":1642965768840,"pickupTime":0,"driverId":79}
-->orderReceived {"id":"order-90","name":"LightPink pen","fulfilTime":0,"createTime":1642965768875,"FulfilledTime":0,"pickupTime":0,"driverId":91}
-->dispatchDriver {"id":91,"startTime":1642965768875,"pickupDelay":10.476313282286334,"pickupTime":0,"orderId":"order-90","arriveTime":0}
-->orderPrepared {"id":"order-90","name":"LightPink pen","fulfilTime":0,"createTime":1642965768875,"FulfilledTime":1642965768876,"pickupTime":0,"driverId":91}
-->driverArrived {"id":82,"startTime":1642965764346,"pickupDelay":4.63376284272915,"pickupTime":0,"orderId":"order-81","arriveTime":1642965768983}
-->UnMatched order pickedup Olive camera, order-59 by driver 82 with order id order-81
-->orderReceived {"id":"order-91","name":"MintCream player","fulfilTime":8,"createTime":1642965769375,"FulfilledTime":0,"pickupTime":0,"driverId":92}
-->dispatchDriver {"id":92,"startTime":1642965769375,"pickupDelay":13.35546351231375,"pickupTime":0,"orderId":"order-91","arriveTime":0}
-->driverArrived {"id":63,"startTime":1642965754809,"pickupDelay":14.675557325402941,"pickupTime":0,"orderId":"order-62","arriveTime":1642965769484}
-->UnMatched order pickedup Lime pen, order-69 by driver 63 with order id order-62
-->driverArrived {"id":73,"startTime":1642965759820,"pickupDelay":9.960161346197527,"pickupTime":0,"orderId":"order-72","arriveTime":1642965769783}
-->UnMatched order pickedup HoneyDew coin, order-81 by driver 73 with order id order-72
-->orderPrepared {"id":"order-68","name":"SpringGreen lighter","fulfilTime":12,"createTime":1642965757815,"FulfilledTime":1642965769820,"pickupTime":0,"driverId":69}
-->orderPrepared {"id":"order-72","name":"LawnGreen brush","fulfilTime":10,"createTime":1642965759820,"FulfilledTime":1642965769820,"pickupTime":0,"driverId":73}
-->orderPrepared {"id":"order-74","name":"Gold mobile phone","fulfilTime":9,"createTime":1642965760824,"FulfilledTime":1642965769826,"pickupTime":0,"driverId":75}
-->driverArrived {"id":74,"startTime":1642965760320,"pickupDelay":9.513137396744545,"pickupTime":0,"orderId":"order-73","arriveTime":1642965769835}
-->UnMatched order pickedup DarkMagenta magazine, order-66 by driver 74 with order id order-73
-->orderReceived {"id":"order-92","name":"DarkMagenta dictionary","fulfilTime":14,"createTime":1642965769878,"FulfilledTime":0,"pickupTime":0,"driverId":93}
-->dispatchDriver {"id":93,"startTime":1642965769878,"pickupDelay":4.943582178384805,"pickupTime":0,"orderId":"order-92","arriveTime":0}
-->driverArrived {"id":65,"startTime":1642965755813,"pickupDelay":14.271983910143561,"pickupTime":0,"orderId":"order-64","arriveTime":1642965770086}
-->UnMatched order pickedup Brown lighter, order-78 by driver 65 with order id order-64
-->orderPrepared {"id":"order-73","name":"AntiqueWhite bottle","fulfilTime":10,"createTime":1642965760320,"FulfilledTime":1642965770324,"pickupTime":0,"driverId":74}
-->orderReceived {"id":"order-93","name":"DarkTurquoise umbrella","fulfilTime":3,"createTime":1642965770382,"FulfilledTime":0,"pickupTime":0,"driverId":94}
-->dispatchDriver {"id":94,"startTime":1642965770382,"pickupDelay":14.0049020611582,"pickupTime":0,"orderId":"order-93","arriveTime":0}
-->driverArrived {"id":78,"startTime":1642965762336,"pickupDelay":8.167588198188023,"pickupTime":0,"orderId":"order-77","arriveTime":1642965770508}
-->UnMatched order pickedup LightPink pen, order-90 by driver 78 with order id order-77
-->orderPrepared {"id":"order-70","name":"MediumVioletRed battery","fulfilTime":12,"createTime":1642965758818,"FulfilledTime":1642965770819,"pickupTime":0,"driverId":71}
-->orderReceived {"id":"order-94","name":"Chocolate rubber","fulfilTime":2,"createTime":1642965770883,"FulfilledTime":0,"pickupTime":0,"driverId":95}
-->dispatchDriver {"id":95,"startTime":1642965770883,"pickupDelay":3.6773025566084723,"pickupTime":0,"orderId":"order-94","arriveTime":0}
-->driverArrived {"id":66,"startTime":1642965756313,"pickupDelay":14.611685494982577,"pickupTime":0,"orderId":"order-65","arriveTime":1642965770924}
-->UnMatched order pickedup SpringGreen lighter, order-68 by driver 66 with order id order-65
-->driverArrived {"id":84,"startTime":1642965765353,"pickupDelay":5.736542328729399,"pickupTime":0,"orderId":"order-83","arriveTime":1642965771091}
-->UnMatched order pickedup LawnGreen brush, order-72 by driver 84 with order id order-83
-->driverArrived {"id":68,"startTime":1642965757314,"pickupDelay":14.058160417208418,"pickupTime":0,"orderId":"order-67","arriveTime":1642965771375}
-->UnMatched order pickedup Gold mobile phone, order-74 by driver 68 with order id order-67
-->orderReceived {"id":"order-95","name":"DarkGrey sunscreen","fulfilTime":8,"createTime":1642965771384,"FulfilledTime":0,"pickupTime":0,"driverId":96}
-->dispatchDriver {"id":96,"startTime":1642965771384,"pickupDelay":13.305377837828146,"pickupTime":0,"orderId":"order-95","arriveTime":0}
-->orderReceived {"id":"order-96","name":"Magenta wallet","fulfilTime":4,"createTime":1642965771890,"FulfilledTime":0,"pickupTime":0,"driverId":97}
-->dispatchDriver {"id":97,"startTime":1642965771890,"pickupDelay":11.474566526985406,"pickupTime":0,"orderId":"order-96","arriveTime":0}
-->driverArrived {"id":87,"startTime":1642965766865,"pickupDelay":5.501804814749996,"pickupTime":0,"orderId":"order-86","arriveTime":1642965772372}
-->UnMatched order pickedup AntiqueWhite bottle, order-73 by driver 87 with order id order-86
-->orderReceived {"id":"order-97","name":"Black comb","fulfilTime":6,"createTime":1642965772392,"FulfilledTime":0,"pickupTime":0,"driverId":98}
-->dispatchDriver {"id":98,"startTime":1642965772392,"pickupDelay":5.873209936620047,"pickupTime":0,"orderId":"order-97","arriveTime":0}
-->driverArrived {"id":76,"startTime":1642965761327,"pickupDelay":11.321499690391247,"pickupTime":0,"orderId":"order-75","arriveTime":1642965772652}
-->UnMatched order pickedup MediumVioletRed battery, order-70 by driver 76 with order id order-75
-->orderPrepared {"id":"order-82","name":"DarkGray clip","fulfilTime":8,"createTime":1642965764852,"FulfilledTime":1642965772854,"pickupTime":0,"driverId":83}
-->orderPrepared {"id":"order-94","name":"Chocolate rubber","fulfilTime":2,"createTime":1642965770883,"FulfilledTime":1642965772887,"pickupTime":0,"driverId":95}
-->orderReceived {"id":"order-98","name":"LightGray light bulb","fulfilTime":6,"createTime":1642965772893,"FulfilledTime":0,"pickupTime":0,"driverId":99}
-->dispatchDriver {"id":99,"startTime":1642965772893,"pickupDelay":5.491485696215632,"pickupTime":0,"orderId":"order-98","arriveTime":0}
-->driverArrived {"id":71,"startTime":1642965758818,"pickupDelay":14.115434301300926,"pickupTime":0,"orderId":"order-70","arriveTime":1642965772938}
-->UnMatched order pickedup DarkGray clip, order-82 by driver 71 with order id order-70
-->orderPrepared {"id":"order-77","name":"Silver wallet","fulfilTime":11,"createTime":1642965762336,"FulfilledTime":1642965773341,"pickupTime":0,"driverId":78}
-->orderPrepared {"id":"order-93","name":"DarkTurquoise umbrella","fulfilTime":3,"createTime":1642965770382,"FulfilledTime":1642965773385,"pickupTime":0,"driverId":94}
-->orderReceived {"id":"order-99","name":"Silver toothbrush","fulfilTime":3,"createTime":1642965773393,"FulfilledTime":0,"pickupTime":0,"driverId":100}
-->dispatchDriver {"id":100,"startTime":1642965773393,"pickupDelay":7.198700409379789,"pickupTime":0,"orderId":"order-99","arriveTime":0}
-->driverArrived {"id":75,"startTime":1642965760824,"pickupDelay":13.337906967922734,"pickupTime":0,"orderId":"order-74","arriveTime":1642965774166}
-->UnMatched order pickedup Chocolate rubber, order-94 by driver 75 with order id order-74
-->driverArrived {"id":95,"startTime":1642965770883,"pickupDelay":3.6773025566084723,"pickupTime":0,"orderId":"order-94","arriveTime":1642965774561}
-->UnMatched order pickedup Silver wallet, order-77 by driver 95 with order id order-94
-->driverArrived {"id":93,"startTime":1642965769878,"pickupDelay":4.943582178384805,"pickupTime":0,"orderId":"order-92","arriveTime":1642965774825}
-->UnMatched order pickedup DarkTurquoise umbrella, order-93 by driver 93 with order id order-92
-->orderPrepared {"id":"order-79","name":"Indigo coin","fulfilTime":12,"createTime":1642965763340,"FulfilledTime":1642965775345,"pickupTime":0,"driverId":80}
-->driverArrived {"id":83,"startTime":1642965764852,"pickupDelay":10.780480941440523,"pickupTime":0,"orderId":"order-82","arriveTime":1642965775632}
-->UnMatched order pickedup Indigo coin, order-79 by driver 83 with order id order-82
-->driverArrived {"id":80,"startTime":1642965763340,"pickupDelay":12.350276844708008,"pickupTime":0,"orderId":"order-79","arriveTime":1642965775695}
-->orderPrepared {"id":"order-76","name":"LightSalmon laptop","fulfilTime":14,"createTime":1642965761833,"FulfilledTime":1642965775835,"pickupTime":0,"driverId":77}
-->UnMatched order pickedup LightSalmon laptop, order-76 by driver 80 with order id order-79
-->orderPrepared {"id":"order-96","name":"Magenta wallet","fulfilTime":4,"createTime":1642965771890,"FulfilledTime":1642965775895,"pickupTime":0,"driverId":97}
-->driverArrived {"id":86,"startTime":1642965766364,"pickupDelay":9.543919611167166,"pickupTime":0,"orderId":"order-85","arriveTime":1642965775907}
-->UnMatched order pickedup Magenta wallet, order-96 by driver 86 with order id order-85
-->orderPrepared {"id":"order-99","name":"Silver toothbrush","fulfilTime":3,"createTime":1642965773393,"FulfilledTime":1642965776395,"pickupTime":0,"driverId":100}
-->driverArrived {"id":79,"startTime":1642965762838,"pickupDelay":13.981086207720255,"pickupTime":0,"orderId":"order-78","arriveTime":1642965776819}
-->UnMatched order pickedup Silver toothbrush, order-99 by driver 79 with order id order-78
-->orderPrepared {"id":"order-86","name":"Ivory notebook","fulfilTime":10,"createTime":1642965766865,"FulfilledTime":1642965776871,"pickupTime":0,"driverId":87}
-->orderPrepared {"id":"order-91","name":"MintCream player","fulfilTime":8,"createTime":1642965769375,"FulfilledTime":1642965777375,"pickupTime":0,"driverId":92}
-->driverArrived {"id":81,"startTime":1642965763845,"pickupDelay":13.72211664277884,"pickupTime":0,"orderId":"order-80","arriveTime":1642965777569}
-->UnMatched order pickedup Ivory notebook, order-86 by driver 81 with order id order-80
-->orderPrepared {"id":"order-80","name":"PaleVioletRed phone card","fulfilTime":14,"createTime":1642965763845,"FulfilledTime":1642965777847,"pickupTime":0,"driverId":81}
-->orderPrepared {"id":"order-84","name":"Black alarm clock","fulfilTime":12,"createTime":1642965765859,"FulfilledTime":1642965777861,"pickupTime":0,"driverId":85}
-->driverArrived {"id":98,"startTime":1642965772392,"pickupDelay":5.873209936620047,"pickupTime":0,"orderId":"order-97","arriveTime":1642965778270}
-->UnMatched order pickedup MintCream player, order-91 by driver 98 with order id order-97
-->driverArrived {"id":88,"startTime":1642965767371,"pickupDelay":10.973522302926881,"pickupTime":0,"orderId":"order-87","arriveTime":1642965778347}
-->UnMatched order pickedup PaleVioletRed phone card, order-80 by driver 88 with order id order-87
-->orderPrepared {"id":"order-83","name":"NavajoWhite packet","fulfilTime":13,"createTime":1642965765353,"FulfilledTime":1642965778355,"pickupTime":0,"driverId":84}
-->orderPrepared {"id":"order-89","name":"LightSeaGreen battery","fulfilTime":10,"createTime":1642965768373,"FulfilledTime":1642965778374,"pickupTime":0,"driverId":90}
-->driverArrived {"id":99,"startTime":1642965772893,"pickupDelay":5.491485696215632,"pickupTime":0,"orderId":"order-98","arriveTime":1642965778386}
-->UnMatched order pickedup Black alarm clock, order-84 by driver 99 with order id order-98
-->orderPrepared {"id":"order-97","name":"Black comb","fulfilTime":6,"createTime":1642965772392,"FulfilledTime":1642965778394,"pickupTime":0,"driverId":98}
-->orderPrepared {"id":"order-98","name":"LightGray light bulb","fulfilTime":6,"createTime":1642965772893,"FulfilledTime":1642965778897,"pickupTime":0,"driverId":99}
-->driverArrived {"id":91,"startTime":1642965768875,"pickupDelay":10.476313282286334,"pickupTime":0,"orderId":"order-90","arriveTime":1642965779351}
-->UnMatched order pickedup NavajoWhite packet, order-83 by driver 91 with order id order-90
-->orderPrepared {"id":"order-95","name":"DarkGrey sunscreen","fulfilTime":8,"createTime":1642965771384,"FulfilledTime":1642965779386,"pickupTime":0,"driverId":96}
-->driverArrived {"id":89,"startTime":1642965767873,"pickupDelay":11.63255618189947,"pickupTime":0,"orderId":"order-88","arriveTime":1642965779508}
-->UnMatched order pickedup LightSeaGreen battery, order-89 by driver 89 with order id order-88
-->driverArrived {"id":85,"startTime":1642965765859,"pickupDelay":14.06787078565656,"pickupTime":0,"orderId":"order-84","arriveTime":1642965779926}
-->UnMatched order pickedup Black comb, order-97 by driver 85 with order id order-84
-->orderPrepared {"id":"order-85","name":"DarkGray light bulb","fulfilTime":14,"createTime":1642965766364,"FulfilledTime":1642965780365,"pickupTime":0,"driverId":86}
-->driverArrived {"id":100,"startTime":1642965773393,"pickupDelay":7.198700409379789,"pickupTime":0,"orderId":"order-99","arriveTime":1642965780592}
-->UnMatched order pickedup LightGray light bulb, order-98 by driver 100 with order id order-99
-->orderPrepared {"id":"order-88","name":"SaddleBrown clip","fulfilTime":13,"createTime":1642965767873,"FulfilledTime":1642965780877,"pickupTime":0,"driverId":89}
-->orderPrepared {"id":"order-87","name":"Grey wallet","fulfilTime":14,"createTime":1642965767371,"FulfilledTime":1642965781372,"pickupTime":0,"driverId":88}
-->driverArrived {"id":90,"startTime":1642965768373,"pickupDelay":14.230856882266721,"pickupTime":0,"orderId":"order-89","arriveTime":1642965782607}
-->UnMatched order pickedup DarkGrey sunscreen, order-95 by driver 90 with order id order-89
-->driverArrived {"id":92,"startTime":1642965769375,"pickupDelay":13.35546351231375,"pickupTime":0,"orderId":"order-91","arriveTime":1642965782734}
-->UnMatched order pickedup DarkGray light bulb, order-85 by driver 92 with order id order-91
-->driverArrived {"id":97,"startTime":1642965771890,"pickupDelay":11.474566526985406,"pickupTime":0,"orderId":"order-96","arriveTime":1642965783368}
-->UnMatched order pickedup SaddleBrown clip, order-88 by driver 97 with order id order-96
-->orderPrepared {"id":"order-92","name":"DarkMagenta dictionary","fulfilTime":14,"createTime":1642965769878,"FulfilledTime":1642965783878,"pickupTime":0,"driverId":93}
-->driverArrived {"id":94,"startTime":1642965770382,"pickupDelay":14.0049020611582,"pickupTime":0,"orderId":"order-93","arriveTime":1642965784385}
-->UnMatched order pickedup Grey wallet, order-87 by driver 94 with order id order-93
-->driverArrived {"id":96,"startTime":1642965771384,"pickupDelay":13.305377837828146,"pickupTime":0,"orderId":"order-95","arriveTime":1642965784694}
-->UnMatched order pickedup DarkMagenta dictionary, order-92 by driver 96 with order id order-95
Number of orders delivered = 100
Average Order Wait Time = 1786 ms
Average Driver Wait Time = 50 ms
Average Order Prep Time = 8010 ms
Average Driver Delay = 9746 ms
```
