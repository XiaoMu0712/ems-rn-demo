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

// 新的报告状态分类
type ReportStatusCategory = "draft" | "complete" | "cancelled";

// 状态映射函数：将现有状态映射到新的分类
const mapStatusToCategory = (status: string): ReportStatusCategory => {
  switch (status) {
    case "pending":
      return "draft";
    case "approved":
    case "rejected":
      return "complete";
    default:
      return "draft"; // 默认为 draft
  }
};

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
  {
    id: "4",
    amount: 67.25,
    category: "Meals",
    description: "Team dinner",
    date: "2024-01-10",
    status: "pending",
  },
  {
    id: "5",
    amount: 150.0,
    category: "Travel",
    description: "Hotel booking",
    date: "2024-01-08",
    status: "approved",
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
  const [selectedStatusCategory, setSelectedStatusCategory] = useState<ReportStatusCategory>("draft");
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[];
    dateRange: { start: string | null; end: string | null };
    amountRange: { min: number | null; max: number | null };
  }>({
    categories: [],
    dateRange: { start: null, end: null },
    amountRange: { min: null, max: null },
  });
  const [showFilters, setShowFilters] = useState(false);

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

  // 根据选中的状态分类和筛选条件筛选报告
  const filteredExpenses = expenses.filter((expense) => {
    const statusCategory = mapStatusToCategory(expense.status);
    const categoryMatch = selectedFilters.categories.length === 0 ||
                          selectedFilters.categories.includes(expense.category);
    
    // 日期范围筛选
    const dateMatch = (!selectedFilters.dateRange.start || expense.date >= selectedFilters.dateRange.start) &&
                     (!selectedFilters.dateRange.end || expense.date <= selectedFilters.dateRange.end);
    
    // 金额范围筛选
    const amountMatch = (selectedFilters.amountRange.min === null || expense.amount >= selectedFilters.amountRange.min) &&
                       (selectedFilters.amountRange.max === null || expense.amount <= selectedFilters.amountRange.max);
    
    return statusCategory === selectedStatusCategory && categoryMatch && dateMatch && amountMatch;
  });

  // 计算统计信息
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const pendingAmount = filteredExpenses
    .filter((expense) => expense.status === "pending")
    .reduce((sum, expense) => sum + expense.amount, 0);

  // 获取所有类别
  const allCategories = ["all", ...Array.from(new Set(expenses.map(expense => expense.category)))];
  
  // 计算各状态分类的报告数量
  const draftCount = expenses.filter(expense => mapStatusToCategory(expense.status) === "draft").length;
  const completeCount = expenses.filter(expense => mapStatusToCategory(expense.status) === "complete").length;
  const cancelledCount = expenses.filter(expense => mapStatusToCategory(expense.status) === "cancelled").length;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* 分段控制器 */}
        <View style={styles.segmentedControlContainer}>
          <Button
            mode={selectedStatusCategory === "draft" ? "contained" : "outlined"}
            onPress={() => setSelectedStatusCategory("draft")}
            style={[
              styles.segmentedButton,
              selectedStatusCategory === "draft" && styles.activeSegmentedButton
            ]}
            labelStyle={[
              styles.segmentedButtonText,
              selectedStatusCategory === "draft" && styles.activeSegmentedButtonText
            ]}
          >
            Draft ({draftCount})
          </Button>
          <Button
            mode={selectedStatusCategory === "complete" ? "contained" : "outlined"}
            onPress={() => setSelectedStatusCategory("complete")}
            style={[
              styles.segmentedButton,
              selectedStatusCategory === "complete" && styles.activeSegmentedButton
            ]}
            labelStyle={[
              styles.segmentedButtonText,
              selectedStatusCategory === "complete" && styles.activeSegmentedButtonText
            ]}
          >
            Complete ({completeCount})
          </Button>
          <Button
            mode={selectedStatusCategory === "cancelled" ? "contained" : "outlined"}
            onPress={() => setSelectedStatusCategory("cancelled")}
            style={[
              styles.segmentedButton,
              selectedStatusCategory === "cancelled" && styles.activeSegmentedButton
            ]}
            labelStyle={[
              styles.segmentedButtonText,
              selectedStatusCategory === "cancelled" && styles.activeSegmentedButtonText
            ]}
          >
            Cancelled ({cancelledCount})
          </Button>
        </View>

        {/* 筛选功能 */}
        <View style={styles.filterContainer}>
          <Button
            mode="outlined"
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterButton}
            icon="filter-variant"
            labelStyle={styles.filterButtonText}
          >
            Filters {showFilters ? "▲" : "▼"}
          </Button>
          
          {/* 选中的筛选条件 Chip */}
          {(selectedFilters.categories.length > 0 || selectedFilters.dateRange.start || selectedFilters.dateRange.end) && (
            <View style={styles.selectedFiltersContainer}>
              <Text style={styles.selectedFiltersLabel}>Selected Filters:</Text>
              <View style={styles.selectedFiltersChips}>
                {selectedFilters.categories.map((category) => (
                  <Chip
                    key={category}
                    mode="outlined"
                    onClose={() => {
                      setSelectedFilters({
                        ...selectedFilters,
                        categories: selectedFilters.categories.filter(c => c !== category)
                      });
                    }}
                    style={styles.selectedFilterChip}
                    textStyle={styles.selectedFilterChipText}
                  >
                    {category}
                  </Chip>
                ))}
                
                {selectedFilters.dateRange.start && (
                  <Chip
                    key="startDate"
                    mode="outlined"
                    onClose={() => {
                      setSelectedFilters({
                        ...selectedFilters,
                        dateRange: { ...selectedFilters.dateRange, start: null }
                      });
                    }}
                    style={styles.selectedFilterChip}
                    textStyle={styles.selectedFilterChipText}
                  >
                    From: {selectedFilters.dateRange.start}
                  </Chip>
                )}
                
                {selectedFilters.dateRange.end && (
                  <Chip
                    key="endDate"
                    mode="outlined"
                    onClose={() => {
                      setSelectedFilters({
                        ...selectedFilters,
                        dateRange: { ...selectedFilters.dateRange, end: null }
                      });
                    }}
                    style={styles.selectedFilterChip}
                    textStyle={styles.selectedFilterChipText}
                  >
                    To: {selectedFilters.dateRange.end}
                  </Chip>
                )}
              </View>
            </View>
          )}
          
          {showFilters && (
            <View style={styles.filterOptions}>
              <Text style={styles.filterLabel}>Categories:</Text>
              <View style={styles.categoryButtons}>
                {allCategories.filter(cat => cat !== "all").map((category) => (
                  <Button
                    key={category}
                    mode={selectedFilters.categories.includes(category) ? "contained" : "outlined"}
                    onPress={() => {
                      if (selectedFilters.categories.includes(category)) {
                        setSelectedFilters({
                          ...selectedFilters,
                          categories: selectedFilters.categories.filter(c => c !== category)
                        });
                      } else {
                        setSelectedFilters({
                          ...selectedFilters,
                          categories: [...selectedFilters.categories, category]
                        });
                      }
                    }}
                    style={[
                      styles.categoryButton,
                      selectedFilters.categories.includes(category) && styles.selectedCategoryButton
                    ]}
                    labelStyle={[
                      styles.categoryButtonText,
                      selectedFilters.categories.includes(category) && styles.selectedCategoryButtonText
                    ]}
                  >
                    {category}
                  </Button>
                ))}
              </View>
              
              <Divider style={styles.filterDivider} />
              
              <Text style={styles.filterLabel}>Date Range:</Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.dateInputContainer}>
                  <TextInput
                    label="Start Date"
                    value={selectedFilters.dateRange.start || ""}
                    onChangeText={(text) => setSelectedFilters({
                      ...selectedFilters,
                      dateRange: { ...selectedFilters.dateRange, start: text }
                    })}
                    mode="outlined"
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD"
                    left={<TextInput.Icon icon="calendar-start" />}
                  />
                </View>
                <View style={styles.dateInputContainer}>
                  <TextInput
                    label="End Date"
                    value={selectedFilters.dateRange.end || ""}
                    onChangeText={(text) => setSelectedFilters({
                      ...selectedFilters,
                      dateRange: { ...selectedFilters.dateRange, end: text }
                    })}
                    mode="outlined"
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD"
                    left={<TextInput.Icon icon="calendar-end" />}
                  />
                </View>
              </View>
            </View>
          )}
        </View>


        {filteredExpenses.map((expense) => (
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
  segmentedControlContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 4,
  },
  segmentedButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 8,
    paddingVertical: 2,
  },
  activeSegmentedButton: {
    backgroundColor: "#1976D2",
    elevation: 2,
  },
  segmentedButtonText: {
    fontSize: 12,
    color: "#90A4AE",
  },
  activeSegmentedButtonText: {
    color: "white",
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  filterButtonText: {
    fontSize: 14,
  },
  filterOptions: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1976D2",
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: "#1976D2",
  },
  categoryButtonText: {
    fontSize: 12,
    color: "#90A4AE",
  },
  selectedCategoryButtonText: {
    color: "white",
  },
  selectedFiltersContainer: {
    marginBottom: 12,
  },
  selectedFiltersLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1976D2",
  },
  selectedFiltersChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedFilterChip: {
    backgroundColor: "#E3F2FD",
    borderColor: "#1976D2",
  },
  selectedFilterChipText: {
    fontSize: 12,
    color: "#1976D2",
  },
  filterDivider: {
    marginVertical: 16,
  },
  dateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateInputContainer: {
    flex: 0.48,
  },
  dateInput: {
    marginBottom: 0,
  },
});
