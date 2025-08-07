import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput, Title } from 'react-native-paper';

interface Receipt {
  id: string;
  vendor: string;
  amount: number;
  date: string;
}

const mockReceipts: Receipt[] = [
  {
    id: '1',
    vendor: 'Restaurant ABC',
    amount: 45.0,
    date: '2024-01-15'
  },
  {
    id: '2',
    vendor: 'Office Depot',
    amount: 89.99,
    date: '2024-01-14'
  },
  {
    id: '3',
    vendor: 'City Cab',
    amount: 25.5,
    date: '2024-01-12'
  },
];

export default function ReceiptDetailScreen() {
  const router = useRouter();
  const { receiptId, mode } = useLocalSearchParams<{ receiptId: string; mode: string }>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    vendor: '',
    amount: '',
    date: '',
  });

  const receipt = mockReceipts.find(r => r.id === receiptId) || mockReceipts[0];

  useEffect(() => {
    if (mode === 'new') {
      setIsEditMode(true);
      setFormData({
        vendor: '',
        amount: '',
        date: new Date().toISOString().split('T')[0], // 默认今天
      });
    } else {
      setFormData({
        vendor: receipt.vendor,
        amount: receipt.amount.toString(),
        date: receipt.date,
      });
    }
  }, [receiptId, mode, receipt]);

  const handleSave = () => {
    if (!formData.vendor || !formData.amount || !formData.date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum)) {
      Alert.alert('Error', 'Amount must be a number');
      return;
    }

    if (mode === 'new') {
      // 新增模式
      const newId = (mockReceipts.length + 1).toString();
      const newReceipt: Receipt = {
        id: newId,
        vendor: formData.vendor,
        amount: amountNum,
        date: formData.date,
      };
      mockReceipts.push(newReceipt);
      Alert.alert('Success', 'Receipt added successfully');
    } else {
      // 编辑模式
      const receiptIndex = mockReceipts.findIndex(r => r.id === receiptId);
      if (receiptIndex !== -1) {
        mockReceipts[receiptIndex] = {
          ...mockReceipts[receiptIndex],
          vendor: formData.vendor,
          amount: amountNum,
          date: formData.date,
        };
        Alert.alert('Success', 'Receipt updated successfully');
      }
    }

    router.back();
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    if (mode === 'new') {
      router.back();
    } else {
      setIsEditMode(false);
      // 重置表单数据为原始值
      setFormData({
        vendor: receipt.vendor,
        amount: receipt.amount.toString(),
        date: receipt.date,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {isEditMode ? (
          /* Edit Mode */
          <>
            <Card style={styles.formCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Receipt Information</Title>
                
                <TextInput
                  label="Vendor"
                  value={formData.vendor}
                  onChangeText={(text) => setFormData({ ...formData, vendor: text })}
                  mode="outlined"
                  style={styles.input}
                />
                
                <TextInput
                  label="Amount"
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                />
                
                <TextInput
                  label="Date"
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  mode="outlined"
                  style={styles.input}
                />
                
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    icon="camera"
                    onPress={() => Alert.alert('Camera', 'Camera functionality would go here')}
                    style={styles.actionButton}
                  >
                    Take Photo
                  </Button>
                  
                  <Button
                    mode="outlined"
                    icon="upload"
                    onPress={() => Alert.alert('Upload', 'Upload functionality would go here')}
                    style={styles.actionButton}
                  >
                    Upload File
                  </Button>
                </View>
                
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={styles.actionButton}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.actionButton}
                  >
                    Save
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </>
        ) : (
          /* View Mode */
          <>
            {/* Receipt Header */}
            <Card style={styles.headerCard}>
              <Card.Content>
                <View style={styles.headerRow}>
                  <View style={styles.headerInfo}>
                    <Title style={styles.title}>{receipt.vendor}</Title>
                    <Text style={styles.date}>{receipt.date}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Amount */}
            <Card style={styles.amountCard}>
              <Card.Content style={styles.amountContent}>
                <Text style={styles.amountLabel}>Amount</Text>
                <Text style={styles.amount}>${receipt.amount.toFixed(2)}</Text>
              </Card.Content>
            </Card>

            {/* Details */}
            <Card style={styles.detailsCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Details</Title>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{receipt.date}</Text>
                </View>
              </Card.Content>
            </Card>

            {/* Actions */}
            <Card style={styles.actionsCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Actions</Title>
                
                <View style={styles.actionsContainer}>
                  <Button
                    mode="outlined"
                    icon="pencil"
                    onPress={handleEdit}
                    style={styles.actionButton}
                  >
                    Edit
                  </Button>
                  
                  <Button
                    mode="outlined"
                    icon="delete"
                    onPress={() => Alert.alert('Delete', 'Delete receipt functionality would go here')}
                    style={[styles.actionButton, styles.deleteButton]}
                    textColor="#F44336"
                  >
                    Delete
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1976D2',
  },
  date: {
    fontSize: 14,
    color: '#90A4AE',
    marginBottom: 4,
  },
  amountCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  amountContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
    color: '#90A4AE',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  detailsCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1976D2',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#90A4AE',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.45,
  },
  deleteButton: {
    borderColor: '#F44336',
  },
  formCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});