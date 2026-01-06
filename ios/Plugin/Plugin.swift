import Foundation
import Capacitor
import os.log

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
    
    // Helper method for converting strings to Latin-1 encoded data
    // When implementing write functionality, use this to preserve binary ESC/POS data:
    //
    // guard let raw = receivedString.data(using: .isoLatin1) else {
    //     // Fallback to UTF-8 if Latin-1 encoding fails
    //     if let fallback = receivedString.data(using: .utf8) {
    //         // write to peripheral
    //     }
    //     return
    // }
    // // Optional: log first 64 bytes as hex for debugging
    // let hex = raw.prefix(64).map { String(format: "%02X", $0) }.joined(separator: " ")
    // os_log("BTSerial native-recv-hex: %@", hex)
    // // write raw to peripheral
}
