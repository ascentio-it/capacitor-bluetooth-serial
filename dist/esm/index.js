import { registerPlugin } from '@capacitor/core';
const BluetoothSerialNative = registerPlugin('BluetoothSerial', {
  web: () => import('./web').then((m) => new m.BluetoothSerialWeb()),
});
/**
 * Helper function to convert ArrayBuffer or Uint8Array to base64 string
 */
function arrayBufferToBase64(buffer) {
  let bytes;
  if (buffer instanceof ArrayBuffer) {
    bytes = new Uint8Array(buffer);
  } else {
    bytes = buffer;
  }
  // For better performance with large binary data, use Array.from instead of string concatenation
  return btoa(String.fromCharCode(...bytes));
}
/**
 * Wrapper around the native plugin that handles binary data conversion
 */
const BluetoothSerial = {
  ...BluetoothSerialNative,
  /**
   * Write data to a Bluetooth device.
   * Supports string (legacy), ArrayBuffer, and Uint8Array.
   * Binary data is converted to base64 for transport to native layer.
   */
  write: async (options) => {
    const { address, value } = options;
    if (typeof value === 'string') {
      // Legacy string mode - pass through as-is
      return BluetoothSerialNative.write({ address, value });
    } else if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
      // Binary mode - convert to base64 and send with different key
      const dataBase64 = arrayBufferToBase64(value);
      // Call native with dataBase64 parameter instead of value
      const nativeOptions = { address, value: '', dataBase64 };
      return BluetoothSerialNative.write(nativeOptions);
    } else {
      throw new Error('Invalid data type for write. Expected string, ArrayBuffer, or Uint8Array.');
    }
  },
};
export * from './definitions';
export { BluetoothSerial };
//# sourceMappingURL=index.js.map
