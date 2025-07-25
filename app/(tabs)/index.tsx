import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  Paragraph,
  Text,
  Title
} from 'react-native-paper';

interface QuickAction {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface RecentExpense {
  id: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const mockRecentExpenses: RecentExpense[] = [
  {
    id: '1',
    description: 'Business lunch with client',
    amount: 45.00,
    status: 'pending',
    date: '2024-01-15'
  },
  {
    id: '2',
    description: 'Taxi to airport',
    amount: 25.50,
    status: 'approved',
    date: '2024-01-14'
  },
  {
    id: '3',
    description: 'Office supplies',
    amount: 89.99,
    status: 'rejected',
    date: '2024-01-12'
  }
];

export default function HomeScreen() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4CAF50'; // Material Green
      case 'pending': return '#FF9800'; // Material Orange
      case 'rejected': return '#F44336'; // Material Red
      default: return '#90A4AE'; // Light gray
    }
  };

  const totalPending = mockRecentExpenses
    .filter(expense => expense.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalThisMonth = mockRecentExpenses
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Welcome Header */}
        <View style={styles.header}>
          <Title style={styles.welcomeTitle}>Welcome back!</Title>
          <Paragraph style={styles.welcomeSubtitle}>
            Manage your expenses efficiently
          </Paragraph>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
            <Card.Content>
              <View style={styles.summaryContent}>
                <MaterialIcons name="account-balance-wallet" size={28} color="#1976D2" />
                <View style={styles.summaryText}>
                  <Title style={styles.summaryAmount}>${totalThisMonth.toFixed(2)}</Title>
                  <Paragraph style={styles.summaryLabel}>This Month</Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          <Card style={[styles.summaryCard, { backgroundColor: '#FFF3E0' }]}>
            <Card.Content>
              <View style={styles.summaryContent}>
                <MaterialIcons name="schedule" size={32} color="#F57C00" />
                <View style={styles.summaryText}>
                  <Title style={styles.summaryAmount}>${totalPending.toFixed(2)}</Title>
                  <Paragraph style={styles.summaryLabel}>Pending</Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Recent Expenses */}
        <Card style={styles.recentCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Recent Expenses</Title>
              <Button
                mode="text"
                onPress={() => router.push('/(tabs)/expenses')}
                compact
              >
                View All
              </Button>
            </View>
            
            {mockRecentExpenses.map((expense) => (
              <View key={expense.id}>
                <View style={styles.expenseItem}>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>
                      {expense.description}
                    </Text>
                    <Text style={styles.expenseDate}>
                      {expense.date}
                    </Text>
                  </View>
                  
                  <View style={styles.expenseRight}>
                    <Text style={styles.expenseAmount}>
                      ${expense.amount.toFixed(2)}
                    </Text>
                    <Chip 
                      style={[
                        styles.statusChip, 
                        { backgroundColor: getStatusColor(expense.status) }
                      ]}
                      textStyle={{ color: 'white', fontSize: 10 }}
                    >
                      {expense.status.toUpperCase()}
                    </Chip>
                  </View>
                </View>
                {expense.id !== mockRecentExpenses[mockRecentExpenses.length - 1].id && (
                  <Divider style={styles.expenseDivider} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <View style={styles.tipsHeader}>
              <MaterialIcons name="lightbulb" size={24} color="#FF9800" />
              <Title style={styles.tipsTitle}>Tip of the Day</Title>
            </View>
            <Paragraph style={styles.tipsText}>
              Take photos of your receipts immediately after making a purchase to avoid losing them!
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light blue-gray background
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1976D2', // Material Blue - 保持主题色强调
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#1565C0', // Dark Blue
    marginTop: 6,
    fontWeight: '400',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 0.48,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 16,
    flex: 1,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1976D2', // Material Blue - 保持主题色强调
  },
  summaryLabel: {
    fontSize: 13,
    color: '#90A4AE', // Light gray
    fontWeight: '500',
  },
  actionsCard: {
    marginBottom: 24,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#1976D2',
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: 12,
    flexDirection: 'column',
  },
  actionButtonLabel: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
  recentCard: {
    marginBottom: 24,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1976D2',
  },
  expenseDate: {
    fontSize: 13,
    color: '#90A4AE',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1976D2', // Material Blue - 保持主题色强调
    marginBottom: 6,
  },
  statusChip: {
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  expenseDivider: {
    marginVertical: 12,
  },
  tipsCard: {
    marginBottom: 24,
    elevation: 4,
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 17,
    marginLeft: 12,
    color: '#1976D2', // Material Blue - 保持主题色强调
    fontWeight: '600',
  },
  tipsText: {
    fontSize: 14,
    color: '#1565C0', // Dark Blue
    lineHeight: 22,
  },
});
