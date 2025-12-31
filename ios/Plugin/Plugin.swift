import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(BluetoothSerial)
public class BluetoothSerial: CAPPlugin {

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": value
        ])
    }
    
    @objc func write(_ call: CAPPluginCall) {
        guard let address = call.getString("address") else {
            call.reject("Device address property is required")
            return
        }
        
        var data: Data?
        
        // Check if binary data (base64) is provided
        if let dataBase64 = call.getString("dataBase64"), !dataBase64.isEmpty {
            // Decode base64 to raw bytes for binary data
            data = Data(base64Encoded: dataBase64)
            if data == nil {
                call.reject("Invalid base64 data")
                return
            }
            NSLog("Writing \(data!.count) bytes of binary data")
        } else if let value = call.getString("value") {
            // Legacy string mode - convert string to UTF-8 bytes
            data = value.data(using: .utf8)
            NSLog("Writing string value: \(value)")
        } else {
            call.reject("Either 'value' or 'dataBase64' must be provided")
            return
        }
        
        // iOS implementation note: Actual Bluetooth write would go here
        // This plugin primarily supports Android, so iOS is not fully implemented
        // In a full implementation, this would write to CBPeripheral or output stream
        
        call.reject("Bluetooth write not fully implemented on iOS. This plugin primarily supports Android.")
    }
}
