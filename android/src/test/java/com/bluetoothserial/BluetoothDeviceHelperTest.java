package com.bluetoothserial;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * Unit tests for BluetoothDeviceHelper Latin-1 encoding behavior
 */
public class BluetoothDeviceHelperTest {

    @Test
    public void toByteArray_withDeterministicTestBuffer_preservesBinaryData() {
        // Test buffer from requirements: 1B 40 1D 76 30 00 30 00 78 00
        // Create a Latin-1 string from these bytes
        byte[] expectedBytes = new byte[] {
            (byte) 0x1B,
            (byte) 0x40,
            (byte) 0x1D,
            (byte) 0x76,
            (byte) 0x30,
            (byte) 0x00,
            (byte) 0x30,
            (byte) 0x00,
            (byte) 0x78,
            (byte) 0x00
        };

        // Convert bytes to Latin-1 string (simulating what JS would do)
        StringBuilder latin1String = new StringBuilder();
        for (byte b : expectedBytes) {
            latin1String.append((char) (b & 0xFF));
        }

        // Convert back using our helper
        byte[] actualBytes = BluetoothDeviceHelper.toByteArray(latin1String.toString());

        // Verify bytes are preserved exactly
        assertArrayEquals("Bytes should be preserved through Latin-1 encoding", expectedBytes, actualBytes);
    }

    @Test
    public void toByteArray_withNullValue_returnsEmptyArray() {
        byte[] result = BluetoothDeviceHelper.toByteArray(null);
        assertNotNull("Result should not be null", result);
        assertEquals("Result should be empty array", 0, result.length);
    }

    @Test
    public void toByteArray_withAllByteValues_preservesFullRange() {
        // Test that all byte values 0x00-0xFF are preserved
        byte[] expectedBytes = new byte[256];
        StringBuilder latin1String = new StringBuilder();

        for (int i = 0; i < 256; i++) {
            expectedBytes[i] = (byte) i;
            latin1String.append((char) i);
        }

        byte[] actualBytes = BluetoothDeviceHelper.toByteArray(latin1String.toString());

        assertEquals("All 256 byte values should be preserved", 256, actualBytes.length);
        assertArrayEquals("All byte values 0x00-0xFF should be preserved through Latin-1", expectedBytes, actualBytes);
    }

    @Test
    public void toByteArray_withPrintableAscii_preservesData() {
        String testString = "Hello World!";
        byte[] result = BluetoothDeviceHelper.toByteArray(testString);

        // Verify ASCII is preserved
        assertEquals('H', result[0]);
        assertEquals('e', result[1]);
        assertEquals('!', result[11]);
    }
}
