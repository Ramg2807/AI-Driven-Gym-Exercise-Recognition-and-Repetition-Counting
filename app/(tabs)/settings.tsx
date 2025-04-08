import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useExerciseHistory } from '@/hooks/useExerciseHistory';

export default function SettingsScreen() {
  const clearHistory = useExerciseHistory((state) => state.clearHistory);
  const [apiEndpoint, setApiEndpoint] = useState('https://us-central1-aiplatform.googleapis.com/v1/projects/neat-veld-455922-b5/locations/us-central1/endpoints/5329417522225610752:predict');
  const [apiToken, setApiToken] = useState('ya29.a0AZYkNZhleS4I26P63SMM79DjGGvvqfmm0ayNr0MJVm-M6dpkq64oqlgg92xXm9Zu2oo9PgTGF6JUJ07moPIBl0MhXCTrZQeFXIih3h3mlqv6s96XUonIPJsykmN_IsKR9u7EbWxEi74vmZliXacUXzoZylpvLnGEPSFi5RmfVE3NKFGpTF9JbPO_t8M4_maFTfSIb0ihOrc5kHBjk3huSaMAT6aNVYBN_xZ9IMXXPi8b4tBRAlmzZ86_AY7SglAMfM3q4JKCJpCaQ376O1MVOifRLATWR8fnblkZtR1zIjxtFQS_4kBu4Av30DOOxfgYbSJTapYvWFSroPKj_5M3j0BqqZDYw2dXlgva2398txcELzYWXm-AcXqf43vVgI-evDFQ0VUWSQs98XcaRnIhkyRQTT6Pj8xQ_FC_CQaCgYKAYASARASFQHGX2Miyq-K0K039gUcwpocuLjV5g0429');

  const handleSave = () => {
    // In a real app, you'd want to persist these values
    console.log('Saving settings:', { apiEndpoint, apiToken });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>API Endpoint</Text>
          <TextInput
            style={styles.input}
            value={apiEndpoint}
            onChangeText={setApiEndpoint}
            placeholder="Enter API endpoint"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>API Token</Text>
          <TextInput
            style={styles.input}
            value={apiToken}
            onChangeText={setApiToken}
            placeholder="Enter API token"
            placeholderTextColor="#666"
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={clearHistory}
        >
          <Text style={styles.buttonText}>Clear Exercise History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  section: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#60a5fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});