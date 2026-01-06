'use strict';

var core = require('@capacitor/core');

const ON_BLUETOOTH_PERMISSION_RESULT_EVENT = 'onBluetoothPermissionResult';

const BluetoothSerial = core.registerPlugin('BluetoothSerial', {
  web: () =>
    Promise.resolve()
      .then(function () {
        return web;
      })
      .then((m) => new m.BluetoothSerialWeb()),
});

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
