import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Modal,
  Paragraph,
  Text,
  TextInput,
  Title
} from 'react-native-paper';

interface Report {
  id: string;
  title: string;
  submittedBy: string;
  totalAmount: number;
  submissionDate: string;
  category: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  expenseCount: number;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Business Trip - New York',
    submittedBy: 'John Smith',
    totalAmount: 1245.50,
    submissionDate: '2024-01-15',
    category: 'Travel',
    description: 'Client meeting and conference attendance',
    status: 'pending',
    expenseCount: 5
  },
  {
    id: '2',
    title: 'Office Equipment Purchase',
    submittedBy: 'Sarah Johnson',
    totalAmount: 890.00,
    submissionDate: '2024-01-14',
    category: 'Office Supplies',
    description: 'New laptops and accessories for team',
    status: 'pending',
    expenseCount: 3
  },
  {
    id: '3',
    title: 'Team Lunch Meeting',
    submittedBy: 'Mike Wilson',
    totalAmount: 156.75,
    submissionDate: '2024-01-12',
    category: 'Meals',
    description: 'Quarterly team meeting lunch',
    status: 'approved',
    expenseCount: 1
  },
  {
    id: '4',
    title: 'Software Licenses',
    submittedBy: 'Emily Davis',
    totalAmount: 2400.00,
    submissionDate: '2024-01-10',
    category: 'Software',
    description: 'Annual software license renewals',
    status: 'rejected',
    expenseCount: 4
  }
];

export default function ApprovalsScreen() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [approvalComment, setApprovalComment] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#90A4AE';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'check-circle';
      case 'pending': return 'schedule';
      case 'rejected': return 'cancel';
      default: return 'help';
    }
  };

  const handleReportPress = (report: Report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleApproveReport = (reportId: string) => {
    Alert.alert(
      'Approve Report',
      'Are you sure you want to approve this expense report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            setReports(reports.map(r => 
              r.id === reportId ? { ...r, status: 'approved' as const } : r
            ));
            setModalVisible(false);
            setApprovalComment('');
            Alert.alert('Success', 'Report approved successfully!');
          }
        }
      ]
    );
  };

  const handleRejectReport = (reportId: string) => {
    Alert.alert(
      'Reject Report',
      'Are you sure you want to reject this expense report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setReports(reports.map(r => 
              r.id === reportId ? { ...r, status: 'rejected' as const } : r
            ));
            setModalVisible(false);
            setApprovalComment('');
            Alert.alert('Success', 'Report rejected.');
          }
        }
      ]
    );
  };

  const getPendingReports = () => reports.filter(r => r.status === 'pending');
  const getApprovedReports = () => reports.filter(r => r.status === 'approved');
  const getRejectedReports = () => reports.filter(r => r.status === 'rejected');

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Expense Approvals</Title>
          <Paragraph style={styles.headerSubtitle}>
            Review and approve expense reports
          </Paragraph>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>{getPendingReports().length}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>
                {getApprovedReports().length}
              </Text>
              <Text style={styles.statLabel}>Approved</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>
                {getRejectedReports().length}
              </Text>
              <Text style={styles.statLabel}>Rejected</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Reports List */}
        <View style={styles.reportsList}>
          {reports.map((report) => (
            <Card 
              key={report.id} 
              style={styles.reportCard}
              onPress={() => handleReportPress(report)}
            >
              <Card.Content>
                <View style={styles.reportHeader}>
                  <View style={styles.reportTitleContainer}>
                    <Text style={styles.reportTitle} numberOfLines={1}>
                      {report.title}
                    </Text>
                    <Text style={styles.reportSubmitter}>
                      by {report.submittedBy}
                    </Text>
                  </View>
                  <Chip 
                    icon={() => (
                      <MaterialIcons 
                        name={getStatusIcon(report.status) as any} 
                        size={14} 
                        color="white" 
                      />
                    )}
                    style={[
                      styles.statusChip, 
                      { backgroundColor: getStatusColor(report.status) }
                    ]}
                    textStyle={{ color: 'white', fontSize: 10 }}
                  >
                    {report.status.toUpperCase()}
                  </Chip>
                </View>
                
                <View style={styles.reportDetails}>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Amount:</Text>
                    <Text style={styles.reportAmount}>
                      ${report.totalAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Category:</Text>
                    <Text style={styles.reportValue}>{report.category}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Expenses:</Text>
                    <Text style={styles.reportValue}>{report.expenseCount} items</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Submitted:</Text>
                    <Text style={styles.reportValue}>{report.submissionDate}</Text>
                  </View>
                </View>
                
                <Text style={styles.reportDescription} numberOfLines={2}>
                  {report.description}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {reports.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="assignment" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No reports to review</Text>
            <Text style={styles.emptySubtext}>All expense reports have been processed</Text>
          </View>
        )}
      </ScrollView>

      {/* Report Detail Modal */}
      <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedReport && (
            <>
              <View style={styles.modalHeader}>
                <Title style={styles.modalTitle}>{selectedReport.title}</Title>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setModalVisible(false)}
                />
              </View>
              
              <ScrollView style={styles.modalContent}>
                <View style={styles.modalInfo}>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Submitted by:</Text>
                    <Text style={styles.modalValue}>{selectedReport.submittedBy}</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Total Amount:</Text>
                    <Text style={styles.modalValue}>${selectedReport.totalAmount.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Category:</Text>
                    <Text style={styles.modalValue}>{selectedReport.category}</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Expense Count:</Text>
                    <Text style={styles.modalValue}>{selectedReport.expenseCount} items</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Submission Date:</Text>
                    <Text style={styles.modalValue}>{selectedReport.submissionDate}</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Status:</Text>
                    <Chip 
                      icon={() => (
                        <MaterialIcons 
                          name={getStatusIcon(selectedReport.status) as any} 
                          size={14} 
                          color="white" 
                        />
                      )}
                      style={[
                        styles.modalStatusChip, 
                        { backgroundColor: getStatusColor(selectedReport.status) }
                      ]}
                      textStyle={{ color: 'white', fontSize: 12 }}
                    >
                      {selectedReport.status.toUpperCase()}
                    </Chip>
                  </View>
                  
                  <Divider style={styles.divider} />
                  
                  <View style={styles.descriptionSection}>
                    <Text style={styles.modalLabel}>Description:</Text>
                    <Text style={styles.descriptionText}>{selectedReport.description}</Text>
                  </View>
                  
                  {selectedReport.status === 'pending' && (
                    <View style={styles.commentSection}>
                      <Text style={styles.modalLabel}>Approval Comment:</Text>
                      <TextInput
                        mode="outlined"
                        placeholder="Add a comment (optional)"
                        value={approvalComment}
                        onChangeText={setApprovalComment}
                        multiline
                        numberOfLines={3}
                        style={styles.commentInput}
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
              
              <View style={styles.modalButtons}>
                {selectedReport.status === 'pending' ? (
                  <>
                    <Button
                      mode="outlined"
                      onPress={() => handleRejectReport(selectedReport.id)}
                      style={styles.rejectButton}
                      textColor="#F44336"
                    >
                      Reject
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => handleApproveReport(selectedReport.id)}
                      style={styles.approveButton}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  <Button
                    mode="contained"
                    onPress={() => setModalVisible(false)}
                    style={styles.modalButton}
                  >
                    Close
                  </Button>
                )}
              </View>
            </>
          )}
        </Modal>
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
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#90A4AE',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 0.3,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2', // 保持主题色强调
  },
  statLabel: {
    fontSize: 12,
    color: '#90A4AE',
    marginTop: 4,
  },
  reportsList: {
    marginBottom: 20,
  },
  reportCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportSubmitter: {
    fontSize: 12,
    color: '#90A4AE',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  reportDetails: {
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reportLabel: {
    fontSize: 12,
    color: '#90A4AE',
    flex: 1,
  },
  reportValue: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  reportAmount: {
    fontSize: 12,
    color: '#1976D2', // 保持主题色强调
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  reportDescription: {
    fontSize: 12,
    color: '#90A4AE',
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#90A4AE',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B0BEC5',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalInfo: {
    padding: 16,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: '#90A4AE',
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalStatusChip: {
    // No additional styles needed
  },
  divider: {
    marginVertical: 16,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    lineHeight: 20,
  },
  commentSection: {
    marginTop: 16,
  },
  commentInput: {
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
  },
  rejectButton: {
    flex: 0.45,
    borderColor: '#F44336',
  },
  approveButton: {
    flex: 0.45,
    backgroundColor: '#4CAF50',
  },
  modalButton: {
    flex: 1,
  },
});