import { useState } from 'react';
import { WindowFeatures } from './useWindowFeatures';

interface Prediction {
  exercise: string;
  confidence: number;
  reps?: number;
}

const EXERCISE_LABELS = ['unknown', 'push-up', 'squat', 'rest'];

export function useExerciseClassifier() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classify = async (features: WindowFeatures, apiEndpoint: string, apiToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Flatten and combine sensor data into a single array of features
      const combinedFeatures = features.rawData.accelerometer.map((accel, index) => {
        const gyro = features.rawData.gyroscope[index] || { x: 0, y: 0, z: 0 };
        return [
          accel.x, accel.y, accel.z,
          gyro.x, gyro.y, gyro.z
        ];
      });

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          instances: [combinedFeatures]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Simplified prediction handling
      const predictions = Array.isArray(data.predictions) ? data.predictions[0] : [];
      const maxProb = Math.max(...predictions);
      const maxIndex = predictions.indexOf(maxProb);

      // Basic rep counting based on acceleration peaks
      const verticalAccel = features.rawData.accelerometer.map(d => Math.abs(d.y));
      const repCount = Math.floor(
        verticalAccel.reduce((sum, val) => sum + val, 0) / verticalAccel.length * 2
      );

      setPrediction({
        exercise: EXERCISE_LABELS[maxIndex],
        confidence: maxProb * 100,
        reps: repCount > 0 ? repCount : undefined,
      });
    } catch (err) {
      console.error('Classification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to classify exercise');
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prediction,
    isLoading,
    error,
    classify,
  };
}