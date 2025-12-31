'use strict';

var core = require('@capacitor/core');

const ON_BLUETOOTH_PERMISSION_RESULT_EVENT = 'onBluetoothPermissionResult';

const BluetoothSerialNative = core.registerPlugin('BluetoothSerial', {
  web: () =>
    Promise.resolve()
      .then(function () {
        return web;
      })
      .then((m) => new m.BluetoothSerialWeb()),
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

class OptionsRequiredError extends Error {
  constructor() {
    super('This method requires an options argument');
  }
}

class BluetoothSerialWeb extends core.WebPlugin {
  async checkBluetoothPermissions() {
    throw this.unavailable('checkBluetoothPermissions is not available on web.');
  }
  async getPairedDevices() {
    throw this.unavailable('getPairedDevices is not available on web.');
  }
  async isEnabled() {
    // not available on web
    return { enabled: true };
  }
  async canEnable() {
    // not available on web
    return { enabled: false };
  }
  async enable() {
    throw this.unavailable('enable is not available on web.');
  }
  disable() {
    throw this.unavailable('disable is not available on web.');
  }
  startEnabledNotifications() {
    throw this.unavailable('disable is not available on web.');
  }
  stopEnabledNotifications() {
    throw this.unavailable('disable is not available on web.');
  }
  async scan() {
    throw new Error('Method not implemented.');
  }
  async connect(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    throw new Error('Method not implemented.');
  }
  async connectInsecure(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    throw new Error('Method not implemented.');
  }
  async disconnect(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    throw new Error('Method not implemented.');
  }
  async isConnected(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    throw new Error('Method not implemented.');
  }
  async read(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    throw new Error('Method not implemented.');
  }
  async readUntil(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    throw new Error('Method not implemented.');
  }
  async write(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    // Validate that value is provided and is one of the supported types
    if (!options.value) {
      throw new Error('value is required');
    }
    if (
      typeof options.value !== 'string' &&
      !(options.value instanceof ArrayBuffer) &&
      !(options.value instanceof Uint8Array)
    ) {
      throw new Error('value must be string, ArrayBuffer, or Uint8Array');
    }
    throw new Error('Method not implemented.');
  }
  async startNotifications(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    throw new Error('Method not implemented.');
  }
  async stopNotifications(options) {
    if (!options) {
      return Promise.reject(new OptionsRequiredError());
    }
    throw new Error('Method not implemented.');
  }
}
new BluetoothSerialWeb();

var web = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  BluetoothSerialWeb: BluetoothSerialWeb,
});

exports.BluetoothSerial = BluetoothSerial;
exports.ON_BLUETOOTH_PERMISSION_RESULT_EVENT = ON_BLUETOOTH_PERMISSION_RESULT_EVENT;
//# sourceMappingURL=plugin.cjs.js.map
