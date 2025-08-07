import { useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';

interface Receipt {
  id: string;
  vendor: string;
  amount: number;
  date: string;
}

const mockReceipts: Receipt[] = [
  { id: '1', vendor: 'Restaurant ABC', amount: 45.0, date: '2024-01-15' },
  { id: '2', vendor: 'Office Depot', amount: 89.99, date: '2024-01-14' },
  { id: '3', vendor: 'City Cab', amount: 25.5, date: '2024-01-12' },
];

export default function ReceiptsScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const router = useRouter();

  useLayoutEffect(() => {
    // 这里根据项目导航库调整，示例为 react-navigation
    // 由于 expo-router 可能不支持直接设置 headerRight，这里仅示意
    // 具体实现可能需要在 _layout.tsx 或其他地方统一处理
  }, []);

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
                <Text style={styles.vendor}>{receipt.vendor}</Text>
                <Text style={styles.date}>{receipt.date}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.amount}>${receipt.amount.toFixed(2)}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <Button
        mode="contained"
        icon="plus"
        onPress={() => router.push('/receipt-detail?mode=new')}
        style={styles.addButton}
      >
        Add Receipt
      </Button>
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
  vendor: { fontSize: 16, fontWeight: '600', color: '#1976D2' },
  date: { fontSize: 12, color: '#90A4AE' },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 18, fontWeight: '700', color: '#1976D2', marginBottom: 6 },
  addButton: { margin: 16 },
});