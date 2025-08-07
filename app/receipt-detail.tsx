import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, Text, Title } from 'react-native-paper';

interface Receipt {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  merchant?: string;
  category?: string;
  notes?: string;
}

const mockReceipts: Receipt[] = [
  { 
    id: '1', 
    description: 'Lunch with client', 
    amount: 45.0, 
    date: '2024-01-15', 
    status: 'pending',
    merchant: 'Restaurant ABC',
    category: 'Meals',
    notes: 'Business lunch with potential client'
  },
  { 
    id: '2', 
    description: 'Office supplies', 
    amount: 89.99, 
    date: '2024-01-14', 
    status: 'approved',
    merchant: 'Office Depot',
    category: 'Office Supplies',
    notes: 'Printer ink and paper'
  },
  { 
    id: '3', 
    description: 'Taxi fare', 
    amount: 25.5, 
    date: '2024-01-12', 
    status: 'rejected',
    merchant: 'City Cab',
    category: 'Transportation',
    notes: 'From office to client site'
  },
];

export default function ReceiptDetailScreen() {
  const router = useRouter();
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();
  
  const receipt = mockReceipts.find(r => r.id === receiptId) || mockReceipts[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#90A4AE';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Receipt Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <Title style={styles.title}>{receipt.description}</Title>
                <Text style={styles.date}>{receipt.date}</Text>
                {receipt.merchant && (
                  <Text style={styles.merchant}>Merchant: {receipt.merchant}</Text>
                )}
              </View>
              <Chip 
                style={[styles.statusChip, { backgroundColor: getStatusColor(receipt.status) }]} 
                textStyle={{ color: 'white' }}
              >
                {receipt.status.toUpperCase()}
              </Chip>
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
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{receipt.category || 'Uncategorized'}</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{receipt.date}</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Chip 
                style={[styles.detailStatusChip, { backgroundColor: getStatusColor(receipt.status) }]} 
                textStyle={{ color: 'white' }}
              >
                {receipt.status.toUpperCase()}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Notes */}
        {receipt.notes && (
          <Card style={styles.notesCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Notes</Title>
              <Text style={styles.notesText}>{receipt.notes}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Actions</Title>
            
            <View style={styles.actionsContainer}>
              <Button
                mode="outlined"
                icon="pencil"
                onPress={() => Alert.alert('Edit', 'Edit receipt functionality would go here')}
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
  merchant: {
    fontSize: 14,
    color: '#90A4AE',
  },
  statusChip: {
    alignSelf: 'flex-start',
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
  detailStatusChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 12,
  },
  notesCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
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
});