#!/usr/bin/env node

/**
 * Standalone test to verify Latin-1 encoding behavior
 * This simulates the JavaScript-to-Java flow for binary data
 */

// Helper: Convert bytes to Latin-1 string (simulates JS side)
function bytesToLatin1String(bytes) {
  const CHUNK = 0x8000;
  let result = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    result += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return result;
}

// Helper: Display hex dump
function hexDump(bytes, maxBytes = 64) {
  const slice = bytes.slice(0, maxBytes);
  return Array.from(slice).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

// Helper: Simulate Java ISO-8859-1 decoding
function javaDecodeISO88591(latin1String) {
  const bytes = new Uint8Array(latin1String.length);
  for (let i = 0; i < latin1String.length; i++) {
    bytes[i] = latin1String.charCodeAt(i) & 0xFF;
  }
  return bytes;
}

console.log('=== Latin-1 Binary Passthrough Test ===\n');

// Test 1: Deterministic test buffer from requirements
console.log('Test 1: Deterministic test buffer');
const testBuffer = new Uint8Array([0x1B, 0x40, 0x1D, 0x76, 0x30, 0x00, 0x30, 0x00, 0x78, 0x00]);
console.log('Original bytes:', hexDump(testBuffer));

const latin1String = bytesToLatin1String(testBuffer);
console.log('Latin-1 string length:', latin1String.length);

const decoded = javaDecodeISO88591(latin1String);
console.log('Decoded bytes: ', hexDump(decoded));

const match1 = testBuffer.every((val, idx) => val === decoded[idx]);
console.log('Bytes preserved:', match1 ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 2: All byte values 0x00-0xFF
console.log('Test 2: All byte values 0x00-0xFF');
const allBytes = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  allBytes[i] = i;
}

const latin1All = bytesToLatin1String(allBytes);
const decodedAll = javaDecodeISO88591(latin1All);

const match2 = allBytes.every((val, idx) => val === decodedAll[idx]);
console.log('First 16 bytes: ', hexDump(allBytes.slice(0, 16)));
console.log('Decoded first:  ', hexDump(decodedAll.slice(0, 16)));
console.log('All 256 bytes preserved:', match2 ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 3: ESC/POS commands (realistic example)
console.log('Test 3: ESC/POS printer commands');
const escPosInit = new Uint8Array([
  0x1B, 0x40,       // ESC @ (Initialize printer)
  0x1B, 0x61, 0x01, // ESC a 1 (Center align)
  0x48, 0x65, 0x6C, 0x6C, 0x6F, // "Hello"
  0x0A              // Line feed
]);

console.log('ESC/POS commands:', hexDump(escPosInit));
const latin1EscPos = bytesToLatin1String(escPosInit);
const decodedEscPos = javaDecodeISO88591(latin1EscPos);
console.log('Decoded:        ', hexDump(decodedEscPos));

const match3 = escPosInit.every((val, idx) => val === decodedEscPos[idx]);
console.log('ESC/POS preserved:', match3 ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 4: Null bytes preservation (critical for ESC/POS)
console.log('Test 4: Null bytes (0x00) preservation');
const withNulls = new Uint8Array([0x1D, 0x76, 0x30, 0x00, 0x30, 0x00, 0x78, 0x00]);
console.log('With null bytes:', hexDump(withNulls));

const latin1Nulls = bytesToLatin1String(withNulls);
const decodedNulls = javaDecodeISO88591(latin1Nulls);
console.log('Decoded:        ', hexDump(decodedNulls));

const match4 = withNulls.every((val, idx) => val === decodedNulls[idx]);
console.log('Null bytes preserved:', match4 ? '✓ PASS' : '✗ FAIL');
console.log();

// Summary
const allPassed = match1 && match2 && match3 && match4;
console.log('=== Summary ===');
console.log(allPassed ? '✓ All tests PASSED' : '✗ Some tests FAILED');
console.log('\nThis validates that the Latin-1 encoding approach correctly');
console.log('preserves binary data through the JS-to-Java flow.');

process.exit(allPassed ? 0 : 1);
