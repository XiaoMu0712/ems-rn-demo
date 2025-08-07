import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
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
import ProfileHeader from '../components/ProfileHeader';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const mockExpenses: Expense[] = [
  {
    id: "1",
    amount: 125.5,
    category: "Travel",
    description: "Taxi to airport",
    date: "2024-01-15",
    status: "approved",
  },
  {
    id: "2",
    amount: 45.0,
    category: "Meals",
    description: "Business lunch with client",
    date: "2024-01-14",
    status: "pending",
  },
  {
    id: "3",
    amount: 89.99,
    category: "Office Supplies",
    description: "Printer cartridges",
    date: "2024-01-12",
    status: "rejected",
  },
];

export default function ExpensesScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    businessPurpose: "",
    comment: "",
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatePicker = () => {
    // setDatePickerOpen(true);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || selectedDate;
    if (Platform.OS === "ios") {
      setDatePickerOpen(false);
    } else {
      setDatePickerOpen(false);
    }
    if (currentDate) {
      setSelectedDate(currentDate);
      setNewReport({
        ...newReport,
        date: currentDate.toISOString().split("T")[0],
      });
    }
  };

  const renderDatePicker = () => {
    if (!datePickerOpen) return null;

    return (
      <DateTimePicker
        testID="dateTimePicker"
        value={selectedDate}
        mode="date"
        is24Hour={true}
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onChange}
      />
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ProfileHeader />,
    });
  }, [navigation]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "rejected":
        return "#F44336";
      default:
        return "#90A4AE";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "check-circle";
      case "pending":
        return "schedule";
      case "rejected":
        return "cancel";
      default:
        return "help";
    }
  };

  const handleAddReport = () => {
    if (!newReport.name || !newReport.businessPurpose) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setModalVisible(false);

    router.push({
      pathname: "/report-detail",
      params: {
        name: newReport.name,
        date: newReport.date,
        businessPurpose: newReport.businessPurpose,
        comment: newReport.comment,
        sourcePage: "/(tabs)/expenses", // 添加来源页面参数
      },
    });

    const today = new Date();
    setNewReport({
      name: "",
      date: today.toISOString().split("T")[0],
      businessPurpose: "",
      comment: "",
    });
    setSelectedDate(today);
  };

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const pendingAmount = expenses
    .filter((expense) => expense.status === "pending")
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, { backgroundColor: "#E3F2FD" }]}>
            <Card.Content>
              <Title style={styles.summaryAmount}>
                ${totalAmount.toFixed(2)}
              </Title>
              <Paragraph>Total Expenses</Paragraph>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, { backgroundColor: "#FFF3E0" }]}>
            <Card.Content>
              <Title style={styles.summaryAmount}>
                ${pendingAmount.toFixed(2)}
              </Title>
              <Paragraph>Pending Approval</Paragraph>
            </Card.Content>
          </Card>
        </View>

        <Divider style={styles.divider} />

        <Title style={styles.sectionTitle}>Recent Expenses</Title>

        {expenses.map((expense) => (
          <Card
            key={expense.id}
            style={styles.expenseCard}
            onPress={() => {
              router.push({
                pathname: "/report-detail",
                params: {
                  expenseId: expense.id,
                  amount: expense.amount.toString(),
                  category: expense.category,
                  description: expense.description,
                  date: expense.date,
                  status: expense.status,
                },
              });
            }}
          >
            <Card.Content>
              <View style={styles.expenseHeader}>
                <View style={styles.expenseInfo}>
                  <Title style={styles.expenseAmount}>
                    ${expense.amount.toFixed(2)}
                  </Title>
                  <Paragraph style={styles.expenseDescription}>
                    {expense.description}
                  </Paragraph>
                </View>
                <Chip
                  icon={() => (
                    <MaterialIcons
                      name={getStatusIcon(expense.status) as any}
                      size={16}
                      color="white"
                    />
                  )}
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(expense.status) },
                  ]}
                  textStyle={{ color: "white", fontSize: 12 }}
                >
                  {expense.status.toUpperCase()}
                </Chip>
              </View>

              <View style={styles.expenseDetails}>
                <Text style={styles.categoryText}>
                  Category: {expense.category}
                </Text>
                <Text style={styles.dateText}>Date: {expense.date}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={styles.modalTitle}>
          New Report
        </Text>

        <TextInput
          label="Report Name*"
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

        {Platform.OS === "ios" && renderDatePicker()}

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

      {Platform.OS === "android" && datePickerOpen && renderDatePicker()}

      {!modalVisible && (
        <FAB
          icon="plus"
          color="#FFFFFF"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
      )}
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
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  expenseCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: "#FFFFFF",
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976D2",
  },
  expenseDescription: {
    fontSize: 14,
    color: "#90A4AE",
  },
  statusChip: {
    marginLeft: 8,
  },
  expenseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryText: {
    fontSize: 12,
    color: "#90A4AE",
  },
  dateText: {
    fontSize: 12,
    color: "#90A4AE",
  },
  modal: {
    justifyContent: "center",
    margin: 16,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976D2',
  },
});
