var HID = require('node-hid');
var devices = HID.devices();
var deviceInfo = devices.find( function(d) {
  if (d.vendorId=== 0xfeed && d.productId===0x2320 && d.usage==0x61 && d.usagePage==0xFF60)  {
    console.log(d)
  }
});
var deviceInfo = devices.find( function(d) {
  return d.vendorId=== 0xfeed && d.productId===0x2320&& d.usage==0x61 && d.usagePage==0xFF60;
});
if( deviceInfo ) {
  console.log('connecting to', deviceInfo);
  var device = new HID.HID( deviceInfo.path );
  console.log(device.write([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
  // ... use device
}
// var devices = HID.devices();
// console.log(devices);

// vendorId 0xFEED,
// productId: 0x2320,

// //
// var device = new HID.HID('/dev/hidraw17');
// device.write([0x00, 0x01, 0x01, 0x05, 0xff, 0xff]);


// let deviceFilter = { vendorId: 0xFEED, productId: 0x2320};
// let requestParams = { filters: [deviceFilter] };
// let outputReportId = 0x01;
// let outputReport = new Uint8Array([42]);

// function handleConnectedDevice(e) {
//   console.log("Device connected: " + e.device.productName);
// }

// function handleDisconnectedDevice(e) {
//   console.log("Device disconnected: " + e.device.productName);
// }

// function handleInputReport(e) {
//   console.log(e.device.productName + ": got input report " + e.reportId);
//   console.log(new Uint8Array(e.data.buffer));
// }

// navigator.hid.addEventListener("connect", handleConnectedDevice);
// navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);

// navigator.hid.requestDevice(requestParams).then((devices) => {
//   if (devices.length == 0) return;
//   devices[0].open().then(() => {
//     console.log("Opened device: " + device.productName);
//     device.addEventListener("inputreport", handleInputReport);
//     device.sendReport(outputReportId, outputReport).then(() => {
//       console.log("Sent output report " + outputReportId);
//     });
//   });
// });