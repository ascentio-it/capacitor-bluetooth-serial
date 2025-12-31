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

  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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
      return BluetoothSerialNative.write({ address, value: '', dataBase64 } as any);
    } else {
      throw new Error('Invalid data type for write. Expected string, ArrayBuffer, or Uint8Array.');
    }
  },
};

export * from './definitions';
export { BluetoothSerial };
