const BOX_VENDOR_ID = 0xFEED;
const BOX_PRODUCT_ID = 0x2320;
const QMK_HID_RAW_USAGE = 0x61;
const QMK_HID_RAW_USAGE_PAGE = 0xFF60;

async function getOpenedDevice() {
  const devices = await navigator.hid.getDevices();
  let device = devices.find(
    (d: any) => (
      d.vendorId === BOX_VENDOR_ID && d.productId === BOX_PRODUCT_ID &&
      d.collections && d.collections.length &&
      d.collections[0].usage == QMK_HID_RAW_USAGE
    )
  );

  if (!device) {
    device = await navigator.hid.requestDevice({
      filters: [{
        vendorId: BOX_VENDOR_ID, productId: BOX_PRODUCT_ID ,
        usage: QMK_HID_RAW_USAGE, usagePage: QMK_HID_RAW_USAGE_PAGE
      }],
    });
    device = device[0];
  }

  if (!device) {
    return null;
  }
  if (!device.opened) {
    await device.open();
    device.addEventListener("inputreport", (event) => {
      const { data, device, reportId } = event;
    });
  }
  return device;
}

export async function turnLed(ledNum: number, state: boolean) {
  const device = await getOpenedDevice();
  if (!device) return;
  let reportData = new Uint8Array([1, ledNum, state ? 1 : 0]);
  await device.sendReport(0, reportData);
}

export async function resetLeds() {
  const device = await getOpenedDevice();
  if (!device) return;
  let reportData = new Uint8Array([0, 0]);
  await device.sendReport(0, reportData);
}