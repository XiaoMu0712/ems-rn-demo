import { useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Modal, Text, TextInput, Title } from 'react-native-paper';

interface Receipt {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockReceipts: Receipt[] = [
  { id: '1', description: 'Lunch with client', amount: 45.0, date: '2024-01-15', status: 'pending' },
  { id: '2', description: 'Office supplies', amount: 89.99, date: '2024-01-14', status: 'approved' },
  { id: '3', description: 'Taxi fare', amount: 25.5, date: '2024-01-12', status: 'rejected' },
];

export default function ReceiptsScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReceipt, setNewReceipt] = useState({
    description: '',
    amount: '',
    date: '',
  });
  const router = useRouter();

  useLayoutEffect(() => {
    // 这里根据项目导航库调整，示例为 react-navigation
    // 由于 expo-router 可能不支持直接设置 headerRight，这里仅示意
    // 具体实现可能需要在 _layout.tsx 或其他地方统一处理
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#90A4AE';
    }
  };

  const handleAddReceipt = () => {
    if (!newReceipt.description || !newReceipt.amount || !newReceipt.date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const newId = (receipts.length + 1).toString();
    const amountNum = parseFloat(newReceipt.amount);
    if (isNaN(amountNum)) {
      Alert.alert('Error', 'Amount must be a number');
      return;
    }
    const newEntry: Receipt = {
      id: newId,
      description: newReceipt.description,
      amount: amountNum,
      date: newReceipt.date,
      status: 'pending',
    };
    setReceipts([newEntry, ...receipts]);
    setModalVisible(false);
    setNewReceipt({ description: '', amount: '', date: '' });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Title style={styles.title}>Receipts</Title>
        {receipts.map((receipt) => (
          <Card
            key={receipt.id}
            style={styles.card}
            onPress={() => router.push(`/receipt-detail?receiptId=${receipt.id}`)}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.info}>
                <Text style={styles.description}>{receipt.description}</Text>
                <Text style={styles.date}>{receipt.date}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.amount}>${receipt.amount.toFixed(2)}</Text>
                <Chip style={[styles.statusChip, { backgroundColor: getStatusColor(receipt.status) }]} textStyle={{ color: 'white' }}>
                  {receipt.status.toUpperCase()}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <Button
        mode="contained"
        icon="plus"
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        Add Receipt
      </Button>

      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
        <Title style={styles.modalTitle}>New Receipt</Title>
        <TextInput
          label="Description"
          value={newReceipt.description}
          onChangeText={(text) => setNewReceipt({ ...newReceipt, description: text })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Amount"
          value={newReceipt.amount}
          onChangeText={(text) => setNewReceipt({ ...newReceipt, amount: text })}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Date (YYYY-MM-DD)"
          value={newReceipt.date}
          onChangeText={(text) => setNewReceipt({ ...newReceipt, date: text })}
          mode="outlined"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleAddReceipt} style={styles.modalButton}>
          Save
        </Button>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollView: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1976D2' },
  card: { marginBottom: 12, elevation: 2, backgroundColor: '#FFFFFF' },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1 },
  description: { fontSize: 16, fontWeight: '600', color: '#1976D2' },
  date: { fontSize: 12, color: '#90A4AE' },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 18, fontWeight: '700', color: '#1976D2', marginBottom: 6 },
  statusChip: { paddingHorizontal: 10, borderRadius: 8 },
  addButton: { margin: 16 },
  modalContainer: { backgroundColor: '#FFFFFF', padding: 20, margin: 20, borderRadius: 8 },
  modalTitle: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 16 },
  modalButton: { marginTop: 8 },
});