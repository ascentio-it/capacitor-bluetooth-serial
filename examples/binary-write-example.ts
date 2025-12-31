/**
 * Example demonstrating binary payload support for Bluetooth writes
 *
 * This example shows how to send binary data (printer commands, bitmaps, etc.)
 * to a Bluetooth device without data corruption from character encoding.
 */

import { BluetoothSerial } from '@ascentio-it/capacitor-bluetooth-serial';

// Example device address (replace with your device)
const PRINTER_ADDRESS = '00:11:22:33:44:55';

/**
 * Example 1: Send ESC/POS printer initialization command
 */
export async function initializePrinter(): Promise<void> {
  // ESC @ - Initialize printer
  const escPosInit = new Uint8Array([0x1b, 0x40]);

  await BluetoothSerial.write({
    address: PRINTER_ADDRESS,
    value: escPosInit,
  });

  console.log('Printer initialized');
}

/**
 * Example 2: Send a test pattern to verify binary data integrity
 * This sends bytes [0x00, 0xFF, 0x7F] which would be corrupted in string mode
 */
export async function sendBinaryTestPattern(): Promise<void> {
  // Test pattern with edge case bytes
  const testPattern = new Uint8Array([0x00, 0xff, 0x7f, 0x80, 0x01, 0xfe]);

  await BluetoothSerial.write({
    address: PRINTER_ADDRESS,
    value: testPattern,
  });

  console.log(
    'Binary test pattern sent:',
    Array.from(testPattern)
      .map((b) => `0x${b.toString(16).padStart(2, '0')}`)
      .join(', '),
  );
}

/**
 * Example 3: Send printer text with ESC/POS formatting
 */
export async function printFormattedText(text: string): Promise<void> {
  // ESC/POS commands for bold text
  const boldOn = new Uint8Array([0x1b, 0x45, 0x01]); // ESC E 1
  const boldOff = new Uint8Array([0x1b, 0x45, 0x00]); // ESC E 0
  const lineFeed = new Uint8Array([0x0a]); // LF

  // Convert text to bytes
  const textBytes = new TextEncoder().encode(text);

  // Combine commands and text
  const totalLength = boldOn.length + textBytes.length + boldOff.length + lineFeed.length;
  const combined = new Uint8Array(totalLength);

  let offset = 0;
  combined.set(boldOn, offset);
  offset += boldOn.length;
  combined.set(textBytes, offset);
  offset += textBytes.length;
  combined.set(boldOff, offset);
  offset += boldOff.length;
  combined.set(lineFeed, offset);

  await BluetoothSerial.write({
    address: PRINTER_ADDRESS,
    value: combined,
  });

  console.log('Formatted text sent to printer');
}

/**
 * Example 4: Send a bitmap to a printer
 * This demonstrates sending larger binary payloads
 */
export async function sendBitmap(bitmapData: Uint8Array): Promise<void> {
  // ESC/POS bitmap command header (simplified example)
  const width = 48; // bytes per line
  const height = bitmapData.length / width;

  // GS v 0 - Print raster bitmap
  const header = new Uint8Array([
    0x1d,
    0x76,
    0x30,
    0x00, // GS v 0 m
    width & 0xff,
    (width >> 8) & 0xff, // xL xH (width in bytes)
    height & 0xff,
    (height >> 8) & 0xff, // yL yH (height)
  ]);

  // Combine header and bitmap data
  const combined = new Uint8Array(header.length + bitmapData.length);
  combined.set(header, 0);
  combined.set(bitmapData, header.length);

  await BluetoothSerial.write({
    address: PRINTER_ADDRESS,
    value: combined,
  });

  console.log(`Bitmap sent: ${bitmapData.length} bytes`);
}

/**
 * Example 5: Legacy string mode (for backward compatibility)
 * Note: This may corrupt binary data and is not recommended for binary protocols
 */
export async function sendStringLegacy(text: string): Promise<void> {
  await BluetoothSerial.write({
    address: PRINTER_ADDRESS,
    value: text, // String mode
  });

  console.log('String sent (legacy mode)');
}

/**
 * Example 6: Using ArrayBuffer directly
 */
export async function sendUsingArrayBuffer(): Promise<void> {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);

  // Write some binary data
  view.setUint8(0, 0x1b);
  view.setUint8(1, 0x40);
  view.setUint8(2, 0xff);
  view.setUint8(3, 0x00);

  await BluetoothSerial.write({
    address: PRINTER_ADDRESS,
    value: buffer, // ArrayBuffer
  });

  console.log('Data sent using ArrayBuffer');
}

/**
 * Complete example: Connect, send data, and disconnect
 */
export async function completeExample(): Promise<void> {
  try {
    // Connect to device
    console.log('Connecting to printer...');
    await BluetoothSerial.connect({ address: PRINTER_ADDRESS });
    console.log('Connected!');

    // Initialize printer
    await initializePrinter();

    // Send test pattern
    await sendBinaryTestPattern();

    // Print formatted text
    await printFormattedText('Hello from Capacitor Bluetooth!');

    // Disconnect
    console.log('Disconnecting...');
    await BluetoothSerial.disconnect({ address: PRINTER_ADDRESS });
    console.log('Disconnected!');
  } catch (error) {
    console.error('Error in complete example:', error);
  }
}
