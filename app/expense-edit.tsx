import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  IconButton,
  List,
  Menu,
  Text,
  TextInput,
  Title
} from 'react-native-paper';

export default function ExpenseEditScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const expenseId = params.id;

  // Mock expense data - in real app this would come from API based on ID
  const mockExpenseData = {
    id: expenseId,
    description: 'Business Lunch',
    amount: '45.50',
    date: '2025-03-04',
    category: 'Meals',
    status: 'Approved',
    comment: 'Client meeting lunch',
    receipts: [
      {
        id: 1,
        name: 'Restaurant Receipt',
        date: 'Mar 4, 2025',
        amount: '$45.50',
        type: 'image/jpeg'
      }
    ]
  };

  // Mock different expense data based on ID
  const getExpenseData = (id: string | string[]) => {
    const expenseId = Array.isArray(id) ? id[0] : id;
    switch (expenseId) {
      case '1':
        return {
          id: expenseId,
          description: 'Business Lunch',
          amount: '45.50',
          date: '2025-03-04',
          category: 'Meals',
          status: 'Approved',
          comment: 'Client meeting lunch',
          receipts: [
            {
              id: 1,
              name: 'Restaurant Receipt',
              date: 'Mar 4, 2025',
              amount: '$45.50',
              type: 'image/jpeg'
            }
          ]
        };
      case '2':
        return {
          id: expenseId,
          description: 'Taxi to Airport',
          amount: '35.00',
          date: '2025-03-03',
          category: 'Transportation',
          status: 'Pending',
          comment: 'Airport transfer',
          receipts: [
            {
              id: 2,
              name: 'Taxi Receipt',
              date: 'Mar 3, 2025',
              amount: '$35.00',
              type: 'image/png'
            }
          ]
        };
      case '3':
        return {
          id: expenseId,
          description: 'Hotel Stay',
          amount: '165.00',
          date: '2025-03-02',
          category: 'Accommodation',
          status: 'Approved',
          comment: 'Business trip accommodation',
          receipts: [
            {
              id: 3,
              name: 'Hotel Invoice',
              date: 'Mar 2, 2025',
              amount: '$165.00',
              type: 'application/pdf'
            },
            {
              id: 4,
              name: 'Hotel Parking Receipt',
              date: 'Mar 2, 2025',
              amount: '$15.00',
              type: 'image/jpeg'
            }
          ]
        };
      default:
        return mockExpenseData;
    }
  };

  const currentExpenseData = getExpenseData(expenseId || '1');

  const [description, setDescription] = useState(currentExpenseData.description);
  const [amount, setAmount] = useState(currentExpenseData.amount);
  const [date, setDate] = useState(currentExpenseData.date);
  const [category, setCategory] = useState(currentExpenseData.category);
  const [comment, setComment] = useState(currentExpenseData.comment);
  const [receipts, setReceipts] = useState(currentExpenseData.receipts);
  const [newReceiptName, setNewReceiptName] = useState('');
  const [newReceiptAmount, setNewReceiptAmount] = useState('');
  const [newReceiptType, setNewReceiptType] = useState('image/jpeg');
  const [menuVisible, setMenuVisible] = useState<{[key: number]: boolean}>({});
  const [addMenuVisible, setAddMenuVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Edit Expense',
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          iconColor="#1976D2"
          size={24}
          onPress={() => router.back()}
        />
      ),
    });
  }, [navigation, router]);

  const handleSave = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    console.log('Expense saved:', {
      id: expenseId,
      description,
      amount,
      date,
      category,
      comment,
      receipts
    });
    Alert.alert('Success', 'Expense updated successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            console.log('Expense deleted:', expenseId);
            router.back();
          }
        }
      ]
    );
  };

  const handleAddReceipt = (type: 'photo' | 'upload_photo' | 'upload_file', name: string) => {
    const receiptTypes = {
      photo: 'image/jpeg',
      upload_photo: 'image/jpeg', 
      upload_file: 'application/pdf'
    };

    const receiptNames = {
      photo: name || 'Camera Photo',
      upload_photo: name || 'Uploaded Photo',
      upload_file: name || 'Uploaded File'
    };

    const newReceipt = {
      id: Math.max(...receipts.map(r => r.id), 0) + 1,
      name: receiptNames[type],
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      amount: '$0.00',
      type: receiptTypes[type]
    };

    setReceipts([...receipts, newReceipt]);
    setAddMenuVisible(false);
    
    // Simulate the action
    console.log(`${type} action triggered for receipt:`, newReceipt);
  };

  const handleDeleteReceipt = (receiptId: number) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setReceipts(currentReceipts =>
              currentReceipts.filter(r => r.id !== receiptId)
            );
            setMenuVisible(prev => {
              const newState = { ...prev };
              delete newState[receiptId];
              return newState;
            });
          },
        },
      ]
    );
  };

  const toggleMenu = (receiptId: number) => {
    setMenuVisible(prev => ({
      ...prev,
      [receiptId]: !prev[receiptId]
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Expense Details Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Expense Details</Title>
              <View style={[styles.statusBadge, 
                currentExpenseData.status === 'Approved' ? styles.approvedBadge :
                currentExpenseData.status === 'Pending' ? styles.pendingBadge :
                styles.rejectedBadge]}>
                <Text style={[styles.statusBadgeText, 
                  currentExpenseData.status === 'Approved' ? styles.approvedText :
                  currentExpenseData.status === 'Pending' ? styles.pendingText :
                  styles.rejectedText]}>
                  {currentExpenseData.status}
                </Text>
              </View>
            </View>
            
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              left={<TextInput.Icon icon="currency-usd" />}
            />
            
            <TextInput
              label="Date"
              value={date}
              onChangeText={setDate}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="calendar" />}
            />
            
            <TextInput
              label="Category"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="tag" />}
            />
            
            <TextInput
              label="Comment"
              value={comment}
              onChangeText={setComment}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="comment-text" />}
            />
          </Card.Content>
        </Card>

        {/* Receipts Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.receiptHeader}>
              <Title style={styles.cardTitle}>Related Receipts ({receipts.length})</Title>
              <Menu
                visible={addMenuVisible}
                onDismiss={() => setAddMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="plus"
                    iconColor="#3b82f6"
                    size={24}
                    onPress={() => setAddMenuVisible(true)}
                    style={styles.addReceiptButton}
                  />
                }
                theme={{ colors: { elevation: { level2: '#ffffff' } } }}
              >
                <Menu.Item
                  onPress={() => handleAddReceipt('photo', '')}
                  title="Take Photo"
                  leadingIcon="camera"
                />
                <Menu.Item
                  onPress={() => handleAddReceipt('upload_photo', '')}
                  title="Upload Photo"
                  leadingIcon="image"
                />
                <Menu.Item
                  onPress={() => handleAddReceipt('upload_file', '')}
                  title="Upload File"
                  leadingIcon="file-upload"
                />
              </Menu>
            </View>
            
            {receipts.length === 0 ? (
               <View style={styles.emptyReceiptsContainer}>
                 <Text style={styles.emptyReceiptsText}>No receipts added yet</Text>
                 <Text style={styles.emptyReceiptsSubtext}>Tap the + button to take a photo or upload a file</Text>
               </View>
            ) : (
              receipts.map((receipt, index) => (
                <View key={receipt.id} style={styles.receiptItemContainer}>
                  <List.Item
                    title={receipt.name}
                    description={`${receipt.date} • ${receipt.amount}`}
                    titleStyle={styles.receiptItemTitle}
                    descriptionStyle={styles.receiptItemDescription}
                    left={props => (
                      <View style={styles.receiptIconContainer}>
                        <List.Icon 
                          {...props} 
                          icon={receipt.type.includes('pdf') ? 'file-pdf-box' : 'image'}
                          color="#059669"
                        />
                      </View>
                    )}
                    right={props => (
                      <Menu
                        visible={menuVisible[receipt.id] || false}
                        onDismiss={() => toggleMenu(receipt.id)}
                        anchor={
                          <IconButton
                            icon="dots-vertical"
                            iconColor="#64748b"
                            size={20}
                            onPress={() => toggleMenu(receipt.id)}
                          />
                        }
                      >
                        <Menu.Item
                          onPress={() => {
                            console.log('View receipt:', receipt.id);
                            setMenuVisible({});
                          }}
                          title="View"
                          leadingIcon="eye"
                        />
                        <Menu.Item
                          onPress={() => handleDeleteReceipt(receipt.id)}
                          title="Delete"
                          leadingIcon="delete"
                          titleStyle={{ color: '#ef4444' }}
                        />
                      </Menu>
                    )}
                    onPress={() => console.log('View receipt:', receipt.id)}
                    style={[
                      styles.receiptItem,
                      index < receipts.length - 1 && styles.receiptItemBorder
                    ]}
                  />
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>



      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={[styles.actionButton, styles.deleteButton]}
          labelStyle={styles.deleteButtonText}
          icon="delete"
        >
          Delete
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={[styles.actionButton, styles.saveButton]}
          labelStyle={styles.saveButtonText}
          icon="content-save"
        >
          Save
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565C0',
    flex: 1,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  approvedBadge: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  approvedText: {
    color: '#16a34a',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  pendingText: {
    color: '#f59e0b',
  },
  rejectedBadge: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  rejectedText: {
    color: '#ef4444',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
  },
  deleteButton: {
    borderColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#1976D2',
    elevation: 3,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  receiptItemContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  receiptItem: {
    paddingHorizontal: 0,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  receiptItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  receiptItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 2,
  },
  receiptItemDescription: {
    fontSize: 12,
    color: '#90A4AE',
  },
  receiptIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    marginRight: 4,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addReceiptButton: {
    margin: 0,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
  },
  emptyReceiptsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyReceiptsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#90A4AE',
    marginBottom: 8,
  },
  emptyReceiptsSubtext: {
    fontSize: 14,
    color: '#B0BEC5',
    textAlign: 'center',
  },

});