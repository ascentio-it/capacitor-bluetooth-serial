import { registerPlugin } from '@capacitor/core';

import type { BluetoothSerialPlugin, BluetoothWriteOptions } from './definitions';

const BluetoothSerialNative = registerPlugin<BluetoothSerialPlugin>('BluetoothSerial', {
  web: () => import('./web').then((m) => new m.BluetoothSerialWeb()),
});

/**
 * Helper function to convert ArrayBuffer or Uint8Array to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let bytes: Uint8Array;
  if (buffer instanceof ArrayBuffer) {
    bytes = new Uint8Array(buffer);
  } else {
    bytes = buffer;
  }

  // For better performance with large binary data, use Array.from instead of string concatenation
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Internal interface for native call with dataBase64
 */
interface NativeWriteOptions {
  address: string;
  value?: string;
  dataBase64?: string;
}

/**
 * Wrapper around the native plugin that handles binary data conversion
 */
const BluetoothSerial: BluetoothSerialPlugin = {
  ...BluetoothSerialNative,

  /**
   * Write data to a Bluetooth device.
   * Supports string (legacy), ArrayBuffer, and Uint8Array.
   * Binary data is converted to base64 for transport to native layer.
   */
  write: async (options: BluetoothWriteOptions): Promise<void> => {
    const { address, value } = options;

    if (typeof value === 'string') {
      // Legacy string mode - pass through as-is
      return BluetoothSerialNative.write({ address, value });
    } else if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
      // Binary mode - convert to base64 and send with different key
      const dataBase64 = arrayBufferToBase64(value);
      // Call native with dataBase64 parameter instead of value
      const nativeOptions: NativeWriteOptions = { address, value: '', dataBase64 };
      return (BluetoothSerialNative.write as (options: NativeWriteOptions) => Promise<void>)(nativeOptions);
    } else {
      throw new Error('Invalid data type for write. Expected string, ArrayBuffer, or Uint8Array.');
    }
  },
};

export * from './definitions';
export { BluetoothSerial };
