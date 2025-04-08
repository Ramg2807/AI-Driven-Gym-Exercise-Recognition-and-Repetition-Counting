import { useEffect, useRef, useState } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Platform } from 'react-native';

const WINDOW_SIZE = 50;
const UPDATE_INTERVAL = Platform.OS === 'web' ? 100 : 50;

interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface WindowFeatures {
  features: number[][];
  rawData: {
    accelerometer: SensorData[];
    gyroscope: SensorData[];
  };
}

export function useWindowFeatures() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const accelerometerData = useRef<SensorData[]>([]);
  const gyroscopeData = useRef<SensorData[]>([]);
  const [features, setFeatures] = useState<WindowFeatures>({
    features: [],
    rawData: { accelerometer: [], gyroscope: [] }
  });

  // Check sensor availability
  useEffect(() => {
    let mounted = true;

    const checkAvailability = async () => {
      try {
        const [accelAvailable, gyroAvailable] = await Promise.all([
          Accelerometer.isAvailableAsync(),
          Gyroscope.isAvailableAsync()
        ]);

        if (mounted) {
          setIsAvailable(accelAvailable && gyroAvailable);
        }
      } catch (error) {
        console.error('Error checking sensor availability:', error);
        if (mounted) {
          setIsAvailable(false);
        }
      }
    };

    checkAvailability();

    return () => {
      mounted = false;
      Accelerometer.removeAllListeners();
      Gyroscope.removeAllListeners();
    };
  }, []);

  const processData = () => {
    if (accelerometerData.current.length < WINDOW_SIZE || 
        gyroscopeData.current.length < WINDOW_SIZE) {
      return;
    }

    const recentAccel = accelerometerData.current.slice(-WINDOW_SIZE);
    const recentGyro = gyroscopeData.current.slice(-WINDOW_SIZE);

    // Simplified feature calculation
    const features = recentAccel.map((accel, i) => {
      const gyro = recentGyro[i] || { x: 0, y: 0, z: 0 };
      return [accel.x, accel.y, accel.z, gyro.x, gyro.y, gyro.z];
    });

    setFeatures({
      features,
      rawData: {
        accelerometer: recentAccel,
        gyroscope: recentGyro
      }
    });
  };

  useEffect(() => {
    if (!isAvailable || !isRecording) {
      return;
    }

    let mounted = true;
    let accelSubscription: ReturnType<typeof Accelerometer.addListener> | null = null;
    let gyroSubscription: ReturnType<typeof Gyroscope.addListener> | null = null;

    const startSensors = async () => {
      try {
        await Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
        await Gyroscope.setUpdateInterval(UPDATE_INTERVAL);

        // Reset data buffers
        accelerometerData.current = [];
        gyroscopeData.current = [];

        accelSubscription = Accelerometer.addListener(data => {
          if (!mounted) return;
          accelerometerData.current = [
            ...accelerometerData.current,
            { ...data, timestamp: Date.now() }
          ].slice(-WINDOW_SIZE);
          processData();
        });

        gyroSubscription = Gyroscope.addListener(data => {
          if (!mounted) return;
          gyroscopeData.current = [
            ...gyroscopeData.current,
            { ...data, timestamp: Date.now() }
          ].slice(-WINDOW_SIZE);
          processData();
        });
      } catch (error) {
        console.error('Error starting sensors:', error);
      }
    };

    startSensors();

    return () => {
      mounted = false;
      accelSubscription?.remove();
      gyroSubscription?.remove();
    };
  }, [isRecording, isAvailable]);

  return {
    isRecording,
    setIsRecording,
    features,
    isAvailable,
  };
}