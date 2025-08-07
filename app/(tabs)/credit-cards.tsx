import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  FAB,
  Modal,
  Paragraph,
  Text,
  TextInput,
  Title
} from "react-native-paper";

interface CreditCard {
  id: string;
  cardNumber: string;
  cardType: string;
  amount: number;
  date: string;
}

const mockCreditCards: CreditCard[] = [
  {
    id: "1",
    cardNumber: "****-****-****-1234",
    cardType: "Visa",
    amount: 12500,
    date: "2024-01-15",
  },
  {
    id: "2",
    cardNumber: "****-****-****-5678",
    cardType: "Mastercard",
    amount: 8500,
    date: "2024-01-14",
  },
  {
    id: "3",
    cardNumber: "****-****-****-9012",
    cardType: "American Express",
    amount: 21000,
    date: "2024-01-12",
  },
  {
    id: "4",
    cardNumber: "****-****-****-3456",
    cardType: "Discover",
    amount: 0,
    date: "2024-01-10",
  },
];

export default function CreditCardsScreen() {
  const router = useRouter();
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mockCreditCards);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    businessPurpose: "",
    comment: "",
    assignTo: ""
  });
  const [filterVisible, setFilterVisible] = useState(false);

  useLayoutEffect(() => {
    // 这里根据项目导航库调整，示例为 react-navigation
    // 由于 expo-router 可能不支持直接设置 headerRight，这里仅示意
    // 具体实现可能需要在 _layout.tsx 或其他地方统一处理
  }, []);

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };


  const handleNewReport = () => {
    if (selectedCards.length === 0) {
      Alert.alert("Error", "Please select at least one credit card");
      return;
    }
    setModalVisible(true);
  };

  const handleAddReport = () => {
    // if (!newReport.name || !newReport.businessPurpose) {
    //   Alert.alert("Error", "Please fill in all required fields");
    //   return;
    // }

    setModalVisible(false);

    // 获取选中的信用卡记录
    const selectedCardData = creditCards.filter(card => selectedCards.includes(card.id));

    router.push({
      pathname: "/report-detail",
      params: {
        name: newReport.name,
        date: newReport.date,
        businessPurpose: newReport.businessPurpose,
        comment: newReport.comment,
        assignTo: newReport.assignTo,
        sourcePage: "/(tabs)/credit-cards", // 添加来源页面参数
        selectedCardIds: selectedCards.join(","), // 传递选中的信用卡ID
      },
    });

    // 重置表单
    const today = new Date();
    setNewReport({
      name: "",
      date: today.toISOString().split("T")[0],
      businessPurpose: "",
      comment: "",
      assignTo: ""
    });
    setSelectedCards([]);
  };

  const selectedCardsTotal = selectedCards.reduce((sum, cardId) => {
    const card = creditCards.find(c => c.id === cardId);
    return sum + (card ? card.amount : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {selectedCards.length > 0 && (
          <Card style={styles.selectedCard}>
            <Card.Content>
              <View style={styles.selectedHeader}>
                <Title style={styles.selectedTitle}>
                  {selectedCards.length} card{selectedCards.length > 1 ? 's' : ''} selected
                </Title>
                <Text style={styles.selectedAmount}>
                  ${(selectedCardsTotal / 1000).toFixed(0)}K
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <Divider style={styles.divider} />

        <Title style={styles.sectionTitle}>Credit Cards</Title>

        {/* 筛选功能UI */}
        <View style={styles.filterContainer}>
          <Button
            mode="outlined"
            onPress={() => setFilterVisible(!filterVisible)}
            style={styles.filterButton}
            icon={() => (
              <MaterialIcons
                name={filterVisible ? "filter-alt" : "filter-list"}
                size={20}
                color="#1976D2"
              />
            )}
            labelStyle={styles.filterButtonLabel}
          >
            Filter
          </Button>
          
          {filterVisible && (
            <View style={styles.filterOptionsContainer}>
              <View style={styles.filterOptionRow}>
                <Text style={styles.filterOptionLabel}>Card Type:</Text>
                <View style={styles.filterChipsContainer}>
                  <Chip mode="outlined" selected style={styles.filterChip}>Visa</Chip>
                  <Chip mode="outlined" style={styles.filterChip}>Mastercard</Chip>
                  <Chip mode="outlined" style={styles.filterChip}>Amex</Chip>
                  <Chip mode="outlined" style={styles.filterChip}>Discover</Chip>
                </View>
              </View>
              
              <View style={styles.filterOptionRow}>
                <Text style={styles.filterOptionLabel}>Amount Range:</Text>
                <View style={styles.filterChipsContainer}>
                  <Chip mode="outlined" style={styles.filterChip}>$0 - $5K</Chip>
                  <Chip mode="outlined" style={styles.filterChip}>$5K - $10K</Chip>
                  <Chip mode="outlined" style={styles.filterChip}>$10K+</Chip>
                </View>
              </View>
              
              <View style={styles.filterActionsContainer}>
                <Button mode="outlined" style={styles.filterActionButton}>Reset</Button>
                <Button mode="contained" style={styles.filterActionButton}>Apply</Button>
              </View>
            </View>
          )}
        </View>

        {creditCards.map((card) => (
          <Card
            key={card.id}
            style={[
              styles.cardCard,
              selectedCards.includes(card.id) && styles.selectedCardCard
            ]}
            onPress={() => toggleCardSelection(card.id)}
          >
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Title style={styles.cardName}>{card.cardType}</Title>
                  <Paragraph style={styles.cardBank}>{card.date}</Paragraph>
                </View>
              </View>

              <View style={styles.cardDetails}>
                <Text style={styles.cardNumber}>{card.cardNumber}</Text>
                <Text style={styles.cardAmount}>${card.amount.toFixed(2)}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {selectedCards.length > 0 && !modalVisible && (
        <FAB
          icon="file-document"
          color="#FFFFFF"
          style={styles.fab}
          onPress={handleNewReport}
          label="New Report"
        />
      )}

      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={styles.modalTitle}>
          New Report
        </Text>

        <TextInput
          label="Report Name"
          value={newReport.name}
          onChangeText={(text) => setNewReport({ ...newReport, name: text })}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="file-document" />}
        />

        <TextInput
          label="Report Date"
          value={newReport.date}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="calendar" />}
          editable={false}
          pointerEvents="none"
        />

        <TextInput
          label="Business Purpose"
          value={newReport.businessPurpose}
          onChangeText={(text) =>
            setNewReport({ ...newReport, businessPurpose: text })
          }
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="briefcase" />}
        />

        <TextInput
          label="Comment"
          value={newReport.comment}
          onChangeText={(text) => setNewReport({ ...newReport, comment: text })}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          left={<TextInput.Icon icon="comment-text" />}
        />

        <TextInput
          label="Assign To"
          value={newReport.assignTo}
          onChangeText={(text) =>
            setNewReport({ ...newReport, assignTo: text })
          }
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="comment-text" />}
        />

        <View style={styles.modalButtons}>
          <Button
            mode="outlined"
            onPress={() => setModalVisible(false)}
            style={styles.modalButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleAddReport}
            style={styles.modalButton}
          >
            Create
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 0.48,
    elevation: 2,
    backgroundColor: "#FFFFFF",
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976D2",
  },
  selectedCard: {
    marginBottom: 16,
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  selectedAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
  },
  newReportButton: {
    backgroundColor: "#4CAF50",
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  cardCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: "#FFFFFF",
  },
  selectedCardCard: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976D2",
  },
  cardBank: {
    fontSize: 14,
    color: "#90A4AE",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
  cardAmount: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976D2",
  },
  input: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 4,
  },
  scrollContent: {
    paddingBottom: 80, // 为浮动按钮留出空间
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    borderColor: "#1976D2",
    borderWidth: 1,
    borderRadius: 20,
  },
  filterButtonLabel: {
    color: "#1976D2",
    fontSize: 14,
  },
  filterOptionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    elevation: 2,
  },
  filterOptionRow: {
    marginBottom: 12,
  },
  filterOptionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 8,
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    backgroundColor: "#F5F7FA",
    borderColor: "#E3F2FD",
  },
  filterActionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  filterActionButton: {
    minWidth: 80,
  },
});