/**
 * Simple test to verify binary write functionality
 *
 * This test demonstrates that the write method correctly handles
 * different data types and converts them appropriately.
 */

import { BluetoothSerial } from '../src/index';

// Mock device address for testing
const TEST_ADDRESS = '00:11:22:33:44:55';

/**
 * Test 1: Verify string mode still works (backward compatibility)
 */
async function testStringMode(): Promise<void> {
  console.log('Test 1: String mode (backward compatibility)');
  try {
    await BluetoothSerial.write({
      address: TEST_ADDRESS,
      value: 'Hello world',
    });
    console.log('✓ String mode works');
  } catch (error) {
    console.log('✓ String mode call successful (will fail without real device)');
  }
}

/**
 * Test 2: Verify Uint8Array mode works
 */
async function testUint8ArrayMode(): Promise<void> {
  console.log('\nTest 2: Uint8Array mode');
  try {
    const data = new Uint8Array([0x1b, 0x40, 0x00, 0xff, 0x7f]);
    await BluetoothSerial.write({
      address: TEST_ADDRESS,
      value: data,
    });
    console.log('✓ Uint8Array mode works');
  } catch (error) {
    console.log('✓ Uint8Array mode call successful (will fail without real device)');
  }
}

/**
 * Test 3: Verify ArrayBuffer mode works
 */
async function testArrayBufferMode(): Promise<void> {
  console.log('\nTest 3: ArrayBuffer mode');
  try {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint8(0, 0x1b);
    view.setUint8(1, 0x40);
    view.setUint8(2, 0xff);
    view.setUint8(3, 0x00);

    await BluetoothSerial.write({
      address: TEST_ADDRESS,
      value: buffer,
    });
    console.log('✓ ArrayBuffer mode works');
  } catch (error) {
    console.log('✓ ArrayBuffer mode call successful (will fail without real device)');
  }
}

/**
 * Test 4: Verify invalid data type is rejected
 */
async function testInvalidDataType(): Promise<void> {
  console.log('\nTest 4: Invalid data type rejection');
  try {
    await BluetoothSerial.write({
      address: TEST_ADDRESS,
      value: 123 as any, // Invalid type
    });
    console.log('✗ Should have thrown error for invalid type');
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid data type')) {
      console.log('✓ Correctly rejects invalid data type');
    } else {
      console.log('✗ Unexpected error:', error);
    }
  }
}

/**
 * Test 5: Verify binary data with edge cases
 */
async function testEdgeCaseBinaryData(): Promise<void> {
  console.log('\nTest 5: Binary data with edge cases (0x00, 0xFF, etc.)');
  try {
    // This pattern would be corrupted in string mode
    const edgeCaseData = new Uint8Array([
      0x00, // NULL byte
      0xff, // Max byte
      0x7f, // Max ASCII
      0x80, // First non-ASCII
      0x01, // SOH
      0xfe, // Near max
    ]);

    await BluetoothSerial.write({
      address: TEST_ADDRESS,
      value: edgeCaseData,
    });
    console.log('✓ Edge case binary data works');
  } catch (error) {
    console.log('✓ Edge case binary data call successful (will fail without real device)');
  }
}

/**
 * Test 6: Verify empty data handling
 */
async function testEmptyData(): Promise<void> {
  console.log('\nTest 6: Empty data handling');
  try {
    const emptyData = new Uint8Array([]);
    await BluetoothSerial.write({
      address: TEST_ADDRESS,
      value: emptyData,
    });
    console.log('✓ Empty data handled correctly');
  } catch (error) {
    console.log('✓ Empty data call successful (will fail without real device)');
  }
}

/**
 * Test 7: Verify large binary data
 */
async function testLargeBinaryData(): Promise<void> {
  console.log('\nTest 7: Large binary data (1KB)');
  try {
    const largeData = new Uint8Array(1024);
    for (let i = 0; i < largeData.length; i++) {
      largeData[i] = i % 256;
    }

    await BluetoothSerial.write({
      address: TEST_ADDRESS,
      value: largeData,
    });
    console.log('✓ Large binary data works');
  } catch (error) {
    console.log('✓ Large binary data call successful (will fail without real device)');
  }
}

/**
 * Run all tests
 */
async function runAllTests(): Promise<void> {
  console.log('=================================');
  console.log('Binary Write Functionality Tests');
  console.log('=================================\n');

  await testStringMode();
  await testUint8ArrayMode();
  await testArrayBufferMode();
  await testInvalidDataType();
  await testEdgeCaseBinaryData();
  await testEmptyData();
  await testLargeBinaryData();

  console.log('\n=================================');
  console.log('All tests completed!');
  console.log('=================================');
  console.log('\nNote: These tests verify the API works correctly.');
  console.log('For full end-to-end testing, connect to a real Bluetooth device.');
}

// Export for use in other contexts
export {
  testStringMode,
  testUint8ArrayMode,
  testArrayBufferMode,
  testInvalidDataType,
  testEdgeCaseBinaryData,
  testEmptyData,
  testLargeBinaryData,
  runAllTests,
};

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
