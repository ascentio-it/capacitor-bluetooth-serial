# Binary Payload Support - Implementation Summary

## Overview
This PR adds support for binary payloads (ArrayBuffer/Uint8Array) to the Bluetooth Serial plugin's `write()` method. This prevents data corruption when sending printer bitmaps, ESC/POS commands, or other binary data.

## Problem Statement
The previous implementation only accepted string-typed payloads for data writes. Sending printer bitmap/logo binary as a JavaScript string caused UTF-8/UTF-16 re-encoding on the bridge/native side, which corrupted arbitrary binary data (e.g., ESC/POS bitmaps).

## Solution
- Modified the plugin API to accept ArrayBuffer and Uint8Array in addition to strings
- Binary payloads are converted to base64 in JavaScript before being sent to native
- Native platforms decode base64 to raw bytes and write them directly without re-encoding
- Maintained full backward compatibility with existing string-based API

## Technical Implementation

### JavaScript/TypeScript Layer
- Updated `BluetoothWriteOptions.value` to accept `string | ArrayBuffer | Uint8Array`
- Created a wrapper function that:
  - Detects the data type
  - Converts binary data to base64 using optimized algorithm
  - Sends base64 to native with `dataBase64` parameter
  - Passes strings through unchanged for backward compatibility

### Android (Java)
- Modified `write()` method in `BluetoothSerialPlugin.java`
- Checks for `dataBase64` parameter first
- Decodes base64 to byte array using `android.util.Base64`
- Writes raw bytes to Bluetooth socket
- Falls back to string mode if `dataBase64` not present

### iOS (Swift)
- Added `write()` method implementation in `Plugin.swift`
- Handles both `dataBase64` and `value` parameters
- Decodes base64 to Data using `Data(base64Encoded:)`
- Note: Full Bluetooth implementation not completed as plugin primarily targets Android

## Usage Examples

### Basic Binary Write
```typescript
import { BluetoothSerial } from '@ascentio-it/capacitor-bluetooth-serial';

// Send ESC/POS printer initialization
const escPosInit = new Uint8Array([0x1B, 0x40]);
await BluetoothSerial.write({
  address: '00:11:22:33:44:55',
  value: escPosInit,
});
```

### Complex Binary Data
```typescript
// Send a test pattern with edge case bytes
const testPattern = new Uint8Array([0x00, 0xFF, 0x7F, 0x80, 0x01, 0xFE]);
await BluetoothSerial.write({
  address: '00:11:22:33:44:55',
  value: testPattern,
});
```

### Using ArrayBuffer
```typescript
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);
view.setUint8(0, 0x1B);
view.setUint8(1, 0x40);

await BluetoothSerial.write({
  address: '00:11:22:33:44:55',
  value: buffer,
});
```

### Legacy String Mode (Still Works)
```typescript
await BluetoothSerial.write({
  address: '00:11:22:33:44:55',
  value: 'Hello world',
});
```

## Migration Guide

### Before (String Mode - May Corrupt Binary Data)
```typescript
// This may corrupt binary data due to UTF-8 encoding
BluetoothSerial.write({
  address: '00:11:22:33:44:55',
  value: '\x1B\x40',
});
```

### After (Binary Mode - Preserves Data Integrity)
```typescript
// This ensures data is sent as raw bytes
const command = new Uint8Array([0x1B, 0x40]);
BluetoothSerial.write({
  address: '00:11:22:33:44:55',
  value: command,
});
```

## Backward Compatibility
- ✅ All existing code using string values continues to work
- ✅ No breaking changes to API
- ✅ Binary mode is opt-in by passing ArrayBuffer/Uint8Array
- ✅ String mode behavior unchanged

## Testing
- ✅ TypeScript builds successfully
- ✅ ESLint passes with no errors
- ✅ Prettier formatting applied
- ✅ CodeQL security scan: 0 vulnerabilities
- ⚠️ Android build skipped (network issues in sandbox environment)
- 📝 Manual testing recommended for:
  - Sending binary data to actual Bluetooth devices
  - Verifying byte integrity with test pattern [0x00, 0xFF, 0x7F]
  - Printer commands (ESC/POS)

## Files Changed
- `src/definitions.ts` - Updated interface
- `src/index.ts` - Added wrapper and conversion logic
- `src/web.ts` - Updated signature
- `android/.../BluetoothSerialPlugin.java` - Native implementation
- `android/.../KeyConstants.java` - Added DATA_BASE64 constant
- `ios/Plugin/Plugin.swift` - Added write method
- `ios/Plugin/Plugin.m` - Registered write method
- `README.md` - Comprehensive documentation
- `package.json` - Version bump to 7.6.0
- `examples/binary-write-example.ts` - Example code

## Version
- Updated from 7.5.3 to 7.6.0 (minor version, backward compatible)

## Security
- No vulnerabilities detected by CodeQL scanner
- Base64 encoding/decoding properly handles edge cases
- Input validation in place for data type checking
- Legacy string path still available but documented with warnings

## Performance Considerations
- Base64 conversion uses optimized spread operator instead of loop
- Minimal overhead for string mode (pass-through)
- Binary mode adds base64 encoding step (necessary for bridge transport)

## Next Steps
1. Merge this PR
2. Test with actual Bluetooth devices
3. Verify printer bitmap/logo functionality
4. Consider adding automated tests if test infrastructure exists
5. Update changelog/release notes

## Questions or Issues?
See the comprehensive examples in `examples/binary-write-example.ts` and the README for more details.
