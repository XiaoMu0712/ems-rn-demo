import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Button,
  Card,
  IconButton,
  List,
  Surface,
  Text,
  Title
} from 'react-native-paper';

export default function ReportDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  // 获取来源页面参数
  const sourcePage = params.sourcePage as string || '/(tabs)/expenses';
  
  // Mock report data - in real app this would come from params or API
  const reportData = {
    name: params.name || '3.4.25 Report',
    date: params.date || 'Mar 4, 2025',
    businessPurpose: params.businessPurpose || '',
    comment: params.comment || '',
    status: 'Not Submitted',
    reimbursableTotal: '$245.50'
  };

  // Mock expenses data with associated receipts
  const mockExpenses = [
    {
      id: 1,
      description: 'Business Lunch',
      amount: '$45.50',
      date: 'Mar 4, 2025',
      category: 'Meals',
      status: 'Approved',
      receipts: [
        {
          id: 1,
          name: 'Restaurant Receipt',
          date: 'Mar 4, 2025',
          amount: '$45.50',
          type: 'image/jpeg'
        }
      ]
    },
    {
      id: 2,
      description: 'Taxi to Airport',
      amount: '$35.00',
      date: 'Mar 3, 2025',
      category: 'Transportation',
      status: 'Pending',
      receipts: [
        {
          id: 2,
          name: 'Taxi Receipt',
          date: 'Mar 3, 2025',
          amount: '$35.00',
          type: 'image/png'
        }
      ]
    },
    {
      id: 3,
      description: 'Hotel Stay',
      amount: '$165.00',
      date: 'Mar 2, 2025',
      category: 'Accommodation',
      status: 'Approved',
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
    }
  ];

  // Get all receipts from expenses
  const mockReceipts = mockExpenses.flatMap(expense => 
    expense.receipts.map(receipt => ({
      ...receipt,
      expenseId: expense.id,
      expenseDescription: expense.description
    }))
  );

  // Mock comments data
  const mockComments = [
    {
      id: 1,
      author: 'John Smith',
      content: 'Please provide additional documentation for the hotel expenses.',
      date: 'Mar 5, 2025',
      time: '10:30 AM',
      type: 'request'
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      content: 'All receipts have been uploaded and verified.',
      date: 'Mar 5, 2025',
      time: '2:15 PM',
      type: 'update'
    },
    {
      id: 3,
      author: 'Mike Davis',
      content: 'Approved for processing. Expected reimbursement within 5 business days.',
      date: 'Mar 6, 2025',
      time: '9:45 AM',
      type: 'approval'
    }
  ];

  const [activeTab, setActiveTab] = useState('Details');
  const [showMenu, setShowMenu] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="plus"
            iconColor="#1976D2"
            size={24}
            onPress={() => setShowMenu(true)}
          />
          <IconButton
            icon="dots-horizontal"
            iconColor="#1976D2"
            size={24}
            onPress={() => {}}
          />
        </View>
      ),
    });
  }, [navigation]);

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Report submitted');
    
    // 根据来源页面返回相应的页面
    Alert.alert(
      "Success",
      "Report submitted successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            if (sourcePage === '/(tabs)/credit-cards') {
              router.push('/(tabs)/credit-cards');
            } else {
              router.push('/(tabs)/expenses');
            }
          }
        }
      ]
    );
  };

  const handleMenuItemPress = (action: string) => {
    setShowMenu(false);
    console.log('Menu action:', action);
    
    switch (action) {
      case 'takePhoto':
        // Navigate to confirm amount page after taking photo
        router.push('/confirm-amount');
        break;
      case 'uploadPhoto':
        // Handle upload photo
        break;
      case 'uploadFile':
        // Handle upload file
        break;
      case 'newExpense':
        // Handle new expense
        break;
      case 'expenseList':
        // Handle expense list
        break;
      default:
        break;
    }
  };

  const handleExpensePress = (expenseId: number) => {
    // Navigate to expense edit page with expense ID
    router.push(`/expense-edit?id=${expenseId}`);
  };

  const renderMenu = () => {
    if (!showMenu) return null;

    return (
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <Surface style={styles.menuSurface}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuItemPress('takePhoto')}
              >
                <IconButton icon="camera" size={20} iconColor="#666" style={styles.menuIconButton} />
                <Text style={styles.menuText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuItemPress('uploadPhoto')}
              >
                <IconButton icon="image" size={20} iconColor="#666" style={styles.menuIconButton} />
                <Text style={styles.menuText}>Upload Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuItemPress('uploadFile')}
              >
                <IconButton icon="file-upload" size={20} iconColor="#666" style={styles.menuIconButton} />
                <Text style={styles.menuText}>Upload File</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.menuItem, styles.lastMenuItem]} 
                onPress={() => handleMenuItemPress('newExpense')}
              >
                <IconButton icon="plus" size={20} iconColor="#666" style={styles.menuIconButton} />
                <Text style={styles.menuText}>New Expense</Text>
              </TouchableOpacity>
            </Surface>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <View>
            <View style={styles.tabContent}>
              <List.Item
                title="Report Name"
                description={reportData.name}
                left={props => <List.Icon {...props} icon="file-document" />}
              />
              <List.Item
                title="Report Date"
                description={reportData.date}
                left={props => <List.Icon {...props} icon="calendar" />}
              />
              {reportData.businessPurpose && (
                <List.Item
                  title="Business Purpose"
                  description={reportData.businessPurpose}
                  left={props => <List.Icon {...props} icon="briefcase" />}
                />
              )}
              {reportData.comment && (
                <List.Item
                  title="Comment"
                  description={reportData.comment}
                  left={props => <List.Icon {...props} icon="comment-text" />}
                />
              )}
            </View>
            
            {/* Comments Section */}
            <View style={styles.tabContent}>
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>Comments</Text>
                <Text style={styles.commentsCount}>({mockComments.length})</Text>
              </View>
              {mockComments.map((comment, index) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentAuthor}>
                      <View style={[styles.commentTypeIndicator, 
                        comment.type === 'approval' && styles.approvalIndicator,
                        comment.type === 'request' && styles.requestIndicator,
                        comment.type === 'update' && styles.updateIndicator
                      ]} />
                      <Text style={styles.commentAuthorName}>{comment.author}</Text>
                    </View>
                    <Text style={styles.commentDateTime}>{comment.date} • {comment.time}</Text>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  {index < mockComments.length - 1 && <View style={styles.commentDivider} />}
                </View>
              ))}
            </View>
          </View>
        );
      case 'Expenses':
        return (
          <View style={styles.tabContent}>
            {mockExpenses.map((expense, index) => (
              <View key={expense.id} style={styles.listItemContainer}>
                <List.Item
                  title={expense.description}
                  description={`${expense.date} • ${expense.category} • ${expense.receipts.length} receipt${expense.receipts.length !== 1 ? 's' : ''}`}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  left={props => (
                    <View style={styles.listIconContainer}>
                      <List.Icon {...props} icon="credit-card" color="#3b82f6" />
                    </View>
                  )}
                  right={() => (
                    <View style={styles.expenseRight}>
                      <Text style={styles.expenseAmount}>{expense.amount}</Text>
                      <List.Icon icon="chevron-right" color="#64748b" />
                    </View>
                  )}
                  onPress={() => handleExpensePress(expense.id)}
                  style={[
                    styles.listItem,
                    index < mockExpenses.length - 1 && styles.listItemBorder
                  ]}
                />
              </View>
            ))}
          </View>
        );
      case 'Receipts':
        return (
          <View style={styles.tabContent}>
            {mockReceipts.map((receipt, index) => (
              <View key={receipt.id} style={styles.listItemContainer}>
                <List.Item
                  title={receipt.name}
                  description={`${receipt.date} • ${receipt.amount} • From: ${receipt.expenseDescription}`}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  left={props => (
                    <View style={styles.listIconContainer}>
                      <List.Icon 
                        {...props} 
                        icon={receipt.type.includes('pdf') ? 'file-pdf-box' : 'image'}
                        color="#059669"
                      />
                    </View>
                  )}
                  right={props => (
                    <List.Icon {...props} icon="chevron-right" color="#64748b" />
                  )}
                  onPress={() => console.log('View receipt:', receipt.id)}
                  style={[
                    styles.listItem,
                    index < mockReceipts.length - 1 && styles.listItemBorder
                  ]}
                />
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderMenu()}
      <ScrollView style={styles.content}>
        {/* Report Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryInfo}>
              <Title style={styles.reportTitle}>{reportData.name}</Title>
              <Text style={styles.reportDate}>{reportData.date}</Text>
              <View style={styles.statusChip}>
                <Text style={styles.statusText}>
                  {reportData.status}
                </Text>
              </View>
            </View>
            <View style={styles.summaryAmount}>
              <Text style={styles.amountText}>{reportData.reimbursableTotal}</Text>
              <Text style={styles.amountLabel}>reimbursable total</Text>
            </View>
          </View>
        </Card>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['Details', 'Expenses', 'Receipts'].map((tab) => (
            <Button
              key={tab}
              mode={activeTab === tab ? 'contained' : 'outlined'}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton
              ]}
              labelStyle={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabButtonText
              ]}
            >
              {tab}
            </Button>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          labelStyle={styles.submitButtonText}
        >
          Submit
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
  summaryCard: {
    marginBottom: 24,
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  summaryInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1565C0',
  },
  reportDate: {
    fontSize: 14,
    color: '#90A4AE',
    marginBottom: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1976D2',
  },
  amountLabel: {
    fontSize: 12,
    color: '#90A4AE',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 0,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 1.5,
    borderRadius: 8,
    paddingVertical: 5,
    minHeight: 32,
  },
  activeTabButton: {
    backgroundColor: '#1976D2',
    elevation: 2,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabButtonText: {
    fontSize: 13,
    color: '#90A4AE',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#90A4AE',
  },
  submitContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
  },
  submitButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 60,
    marginRight: 16,
  },
  menuSurface: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconButton: {
    margin: 0,
    marginRight: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  expenseRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 6,
  },
  expenseStatusChip: {
    height: 28,
    width: 80,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  approvedChip: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  approvedText: {
    color: '#16a34a',
  },
  pendingChip: {
    backgroundColor: '#fef3c7',
    borderColor: '#d97706',
  },
  pendingText: {
    color: '#d97706',
  },
  listItemContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: 14,
    color: '#90A4AE',
  },
  listIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    marginRight: 4,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
  },
  commentsCount: {
    fontSize: 14,
    color: '#90A4AE',
    marginLeft: 8,
  },
  commentItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTypeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  approvalIndicator: {
    backgroundColor: '#16a34a',
  },
  requestIndicator: {
    backgroundColor: '#d97706',
  },
  updateIndicator: {
    backgroundColor: '#3b82f6',
  },
  commentAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  commentDateTime: {
    fontSize: 12,
    color: '#90A4AE',
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  commentDivider: {
    height: 1,
    backgroundColor: '#E3F2FD',
    marginTop: 12,
  },
});