package com.bluetoothserial;

import android.bluetooth.BluetoothDevice;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.Set;

public class BluetoothDeviceHelper implements Serializable {

    public static JSArray devicesToJSArray(Set<BluetoothDevice> devices) {
        JSArray devicesAsJson = new JSArray();

        for (BluetoothDevice device : devices) {
            devicesAsJson.put(deviceToJSObject(device));
        }

        return devicesAsJson;
    }

    public static JSObject deviceToJSObject(BluetoothDevice device) {
        JSObject json = new JSObject();
        json.put("name", device.getName());
        json.put("address", device.getAddress());
        json.put("id", device.getAddress());
        if (device.getBluetoothClass() != null) {
            json.put("class", device.getBluetoothClass().getDeviceClass());
        }
        return json;
    }

    public static byte[] toByteArray(String value) {
        if (value == null) {
            return new byte[0];
        }

        try {
            byte[] raw = value.getBytes("ISO-8859-1");
            // Optional debug: log first 64 bytes as hex (only when log level is INFO or lower)
            if (android.util.Log.isLoggable("BTSerial", android.util.Log.INFO)) {
                StringBuilder sb = new StringBuilder();
                int max = Math.min(raw.length, 64);
                for (int i = 0; i < max; i++) {
                    int b = raw[i] & 0xFF;
                    sb.append(Integer.toHexString(0x100 | b).substring(1).toUpperCase());
                    sb.append(' ');
                }
                android.util.Log.i("BTSerial", "native-recv-hex: " + sb.toString());
            }
            return raw;
        } catch (java.io.UnsupportedEncodingException e) {
            // Fallback to platform default if ISO-8859-1 is not available
            android.util.Log.w("BTSerial", "ISO-8859-1 encoding not supported, falling back to UTF-8", e);
            return value.getBytes(StandardCharsets.UTF_8);
        }
    }
}
