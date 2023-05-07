import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, createEffect, onMount  } from 'solid-js';

async function getOpenedDevice() {
  const devices = await navigator.hid.getDevices();
  console.log(devices.find(d => d.vendorId === 0xFEED && d.productId === 0x2320&& d.usage==0x61 && d.usagePage==0xFF60));
  let device = devices.find(d => d.vendorId === 0xFEED && d.productId === 0x2320&& d.collections && d.collections.length && d.collections[0].usage==0x61);

  if (!device) {
    device = await navigator.hid.requestDevice({
      filters: [{ vendorId: 0xFEED, productId: 0x2320 , usage: 0x61, usagePage: 0xFF60}],
    });
    device = device[0];
  }

  if (!device.opened) {
    await device.open();
    device.addEventListener("inputreport", (event) => {
      const { data, device, reportId } = event;

      console.log(data, device, reportId);
    });
  }
  let reportId = 0;
  // Create the report buffer.
  // let reportData = new Uint8Array([0, 1]);
  // await device.sendReport(0, reportData);
  // console.log(device);
  return device;
}

async function turnLed(ledNum, state) {
  const device = await getOpenedDevice();
  let reportData = new Uint8Array([1, ledNum, state]);
  await device.sendReport(0, reportData);
}

async function resetLeds() {
  const device = await getOpenedDevice();
  let reportData = new Uint8Array([0, 0]);
  await device.sendReport(0, reportData);
}

function App() {
  const [playPause, setPlayPause] = createSignal(false);
  const [ledNumber, setLedNumber] = createSignal(0);
  let videoContext;
  onMount(async () => {
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
    // const device = await getOpenedDevice();
    // console.log(device);
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
  });
  // Working only with volume = 0
  return (
    <div class={styles.App}>
      <input type="number" value={ledNumber()} onChange={(e) => setLedNumber(parseInt(e.target.value))}></input>
      <button onClick={async () => await getOpenedDevice()}> Pair </button>
      <button onClick={async () => turnLed(ledNumber(), 1)}> Turn on </button>
      <button onClick={async () => turnLed(ledNumber(), 0)}> Turn off </button>
      <button onClick={async () => resetLeds()}> Reset </button>
      {/* <img src={logo} class={styles.logo} alt="logo" /> */}
    </div>

  );[]
}

export default App;
