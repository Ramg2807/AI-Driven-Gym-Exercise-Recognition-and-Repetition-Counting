import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useWindowFeatures } from '@/hooks/useWindowFeatures';
import { useExerciseClassifier } from '@/hooks/useExerciseClassifier';
import { useExerciseHistory } from '@/hooks/useExerciseHistory';

export default function LiveScreen() {
  const { isRecording, setIsRecording, features, isAvailable } = useWindowFeatures();
  const { prediction, isLoading, error, classify } = useExerciseClassifier();
  const addExercise = useExerciseHistory((state) => state.addExercise);
  const [apiConfig] = useState({
    endpoint: 'https://us-central1-aiplatform.googleapis.com/v1/projects/neat-veld-455922-b5/locations/us-central1/endpoints/5329417522225610752:predict',
    token: 'ya29.a0AZYkNZhleS4I26P63SMM79DjGGvvqfmm0ayNr0MJVm-M6dpkq64oqlgg92xXm9Zu2oo9PgTGF6JUJ07moPIBl0MhXCTrZQeFXIih3h3mlqv6s96XUonIPJsykmN_IsKR9u7EbWxEi74vmZliXacUXzoZylpvLnGEPSFi5RmfVE3NKFGpTF9JbPO_t8M4_maFTfSIb0ihOrc5kHBjk3huSaMAT6aNVYBN_xZ9IMXXPi8b4tBRAlmzZ86_AY7SglAMfM3q4JKCJpCaQ376O1MVOifRLATWR8fnblkZtR1zIjxtFQS_4kBu4Av30DOOxfgYbSJTapYvWFSroPKj_5M3j0BqqZDYw2dXlgva2398txcELzYWXm-AcXqf43vVgI-evDFQ0VUWSQs98XcaRnIhkyRQTT6Pj8xQ_FC_CQaCgYKAYASARASFQHGX2Miyq-K0K039gUcwpocuLjV5g0429'
  });

  useEffect(() => {
    if (features.features.length > 0 && isRecording) {
      classify(features, apiConfig.endpoint, apiConfig.token);
    }
  }, [features]);

  useEffect(() => {
    if (prediction) {
      addExercise(prediction);
    }
  }, [prediction]);

  useEffect(() => {
    return () => {
      if (isRecording) {
        setIsRecording(false);
      }
    };
  }, [isRecording]);

  // Ensure data points are valid numbers and within a reasonable range
  const getValidChartData = () => {
    const rawData = features.rawData?.accelerometer.slice(-10).map(d => d.y) || Array(10).fill(0);
    return rawData.map(value => {
      if (typeof value !== 'number' || !isFinite(value)) {
        return 0;
      }
      // Clamp values to prevent extreme numbers
      return Math.max(Math.min(value, 100), -100);
    });
  };

  const chartData = {
    labels: Array.from({ length: 10 }, (_, i) => i.toString()),
    datasets: [
      {
        data: getValidChartData(),
        color: () => '#60a5fa',
        strokeWidth: 2,
      },
    ],
  };

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        <View style={styles.predictionContainer}>
          <Text style={styles.errorText}>
            Sensors are not available on this device
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.predictionContainer}>
        {prediction && (
          <>
            <Text style={styles.exerciseText}>
              {prediction.exercise.toUpperCase()}
            </Text>
            <Text style={styles.confidenceText}>
              {prediction.confidence.toFixed(1)}% Confidence
            </Text>
            {prediction.reps && (
              <Text style={styles.repsText}>
                {prediction.reps} Reps
              </Text>
            )}
          </>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#1a1a1a',
            backgroundGradientFrom: '#1a1a1a',
            backgroundGradientTo: '#1a1a1a',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              stroke: '#60a5fa',
              strokeWidth: '2',
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: '#333',
            },
          }}
          bezier
          style={styles.chart}
          withDots={false}
          withShadow={false}
          segments={5}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.recordButton,
          isRecording && styles.recordingButton,
        ]}
        onPress={() => setIsRecording(!isRecording)}
      >
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  predictionContainer: {
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  exerciseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 18,
    color: '#60a5fa',
    marginBottom: 4,
  },
  repsText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  chartContainer: {
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recordButton: {
    backgroundColor: '#60a5fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#ef4444',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});