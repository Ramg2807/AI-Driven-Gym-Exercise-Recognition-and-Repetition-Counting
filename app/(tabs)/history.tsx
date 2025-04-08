import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useExerciseHistory } from '@/hooks/useExerciseHistory';

export default function HistoryScreen() {
  const exercises = useExerciseHistory((state) => state.exercises);

  return (
    <ScrollView style={styles.container}>
      {exercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>
            {exercise.exercise.toUpperCase()}
          </Text>
          <Text style={styles.exerciseDetails}>
            {new Date(exercise.timestamp).toLocaleString()}
          </Text>
          <Text style={styles.exerciseDetails}>
            Confidence: {exercise.confidence.toFixed(1)}%
          </Text>
          {exercise.reps && (
            <Text style={styles.exerciseDetails}>
              Reps: {exercise.reps}
            </Text>
          )}
        </View>
      ))}
      {exercises.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No exercises recorded yet
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  exerciseDetails: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
  },
});