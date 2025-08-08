import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text, Title, useTheme } from "react-native-paper";

// Report data model
interface Report {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedBy?: string; // For approval scenarios
  category: string;
  expenseCount: number;
}

// My Reports statistics
interface MyReportsStats {
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  rejected: number;
  totalAmount: number;
  recentReports: Report[];
}

// My Approvals statistics
interface MyApprovalsStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalAmount: number;
  recentReports: Report[];
}

// Dashboard overview data
interface DashboardStats {
  myReportsTotal: number;
  myApprovalsTotal: number;
  myReportsPending: number;
  myReportsApproved: number;
}

// Mock data
const mockDashboardStats: DashboardStats = {
  myReportsTotal: 12,
  myApprovalsTotal: 8,
  myReportsPending: 3,
  myReportsApproved: 7,
};

const mockMyReportsStats: MyReportsStats = {
  total: 12,
  draft: 2,
  submitted: 3,
  approved: 7,
  rejected: 0,
  totalAmount: 3250.75,
  recentReports: [
    {
      id: "1",
      title: "Business Trip - New York",
      description: "Client meeting and conference attendance",
      amount: 1245.5,
      date: "Jan 15, 2024",
      status: "submitted",
      category: "Travel",
      expenseCount: 5,
    },
    {
      id: "2",
      title: "Office Equipment Purchase",
      description: "New laptops and accessories for team",
      amount: 890.0,
      date: "Jan 14, 2024",
      status: "approved",
      category: "Office Supplies",
      expenseCount: 3,
    },
    {
      id: "3",
      title: "Team Lunch Meeting",
      description: "Quarterly team meeting lunch",
      amount: 156.75,
      date: "Jan 12, 2024",
      status: "draft",
      category: "Meals",
      expenseCount: 1,
    },
  ],
};

const mockMyApprovalsStats: MyApprovalsStats = {
  total: 8,
  today: 2,
  thisWeek: 5,
  thisMonth: 8,
  totalAmount: 4250.25,
  recentReports: [
    {
      id: "4",
      title: "Business Trip - San Francisco",
      description: "Tech conference and partner meetings",
      amount: 1850.75,
      date: "Jan 16, 2024",
      status: "submitted",
      submittedBy: "John Smith",
      category: "Travel",
      expenseCount: 6,
    },
    {
      id: "5",
      title: "Software Licenses Renewal",
      description: "Annual software license renewals for development team",
      amount: 2400.0,
      date: "Jan 15, 2024",
      status: "submitted",
      submittedBy: "Sarah Johnson",
      category: "Software",
      expenseCount: 4,
    },
    {
      id: "6",
      title: "Team Building Event",
      description: "Quarterly team building activities",
      amount: 650.5,
      date: "Jan 14, 2024",
      status: "submitted",
      submittedBy: "Mike Wilson",
      category: "Events",
      expenseCount: 2,
    },
  ],
};

// Stat card component with completely new design
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  onPress: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.statCard, { backgroundColor: "#FFFFFF" }]}
      onPress={onPress}
      mode="elevated"
    >
      <Card.Content style={styles.statCardContent}>
        <View style={styles.statTopContainer}>
          <MaterialIcons name={icon as any} size={22} color={color} />
          <Title style={[styles.statValue, { color }]}>{value}</Title>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );
};

// Status stat card component with new design
interface StatusStatCardProps {
  status: "draft" | "submitted" | "approved" | "rejected";
  count: number;
  onPress: () => void;
}

const StatusStatCard: React.FC<StatusStatCardProps> = ({
  status,
  count,
  onPress,
}) => {
  const theme = useTheme();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "draft":
        return { icon: "description", color: "#757575", label: "Draft" };
      case "submitted":
        return { icon: "send", color: "#FF9800", label: "Submitted" };
      case "approved":
        return { icon: "check-circle", color: "#4CAF50", label: "Approved" };
      case "rejected":
        return { icon: "cancel", color: "#F44336", label: "Rejected" };
      default:
        return { icon: "help", color: "#757575", label: "Unknown" };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <Card
      style={[styles.statusStatCard, { backgroundColor: "#FFFFFF" }]}
      onTouchEnd={onPress}
    >
      <Card.Content style={styles.statusStatCardContent}>
        <View
          style={[
            styles.statusStatIconContainer,
            { backgroundColor: statusInfo.color + "20" },
          ]}
        >
          <MaterialIcons
            name={statusInfo.icon as any}
            size={20}
            color={statusInfo.color}
          />
        </View>
        <Text style={styles.statusStatValue}>{count}</Text>
        <Text style={styles.statusStatLabel}>{statusInfo.label}</Text>
      </Card.Content>
    </Card>
  );
};

// Time stat card component with new design
interface TimeStatCardProps {
  timeRange: "today" | "thisWeek" | "thisMonth";
  count: number;
  onPress: () => void;
}

const TimeStatCard: React.FC<TimeStatCardProps> = ({
  timeRange,
  count,
  onPress,
}) => {
  const theme = useTheme();

  const getTimeInfo = (timeRange: string) => {
    switch (timeRange) {
      case "today":
        return { icon: "today", color: "#F44336", label: "Today" };
      case "thisWeek":
        return { icon: "view-week", color: "#FF9800", label: "This Week" };
      case "thisMonth":
        return {
          icon: "calendar-month",
          color: "#4CAF50",
          label: "This Month",
        };
      default:
        return { icon: "help", color: "#757575", label: "Unknown" };
    }
  };

  const timeInfo = getTimeInfo(timeRange);

  return (
    <View
      style={[styles.timeStatCard, { backgroundColor: "#FFFFFF" }]}
      onTouchEnd={onPress}
    >
      <View
        style={[
          styles.timeStatIconContainer,
          { backgroundColor: timeInfo.color + "20" },
        ]}
      >
        <MaterialIcons
          name={timeInfo.icon as any}
          size={20}
          color={timeInfo.color}
        />
      </View>
      <Text style={styles.timeStatValue}>{count}</Text>
      <Text style={styles.timeStatLabel}>{timeInfo.label}</Text>
    </View>
  );
};

// Report preview item component with new design
interface ReportPreviewItemProps {
  report: Report;
  onPress: () => void;
}

const ReportPreviewItem: React.FC<ReportPreviewItemProps> = ({
  report,
  onPress,
}) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "#757575";
      case "submitted":
        return "#FF9800";
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "submitted":
        return "Submitted";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <Card
      style={[styles.reportPreviewCard, { backgroundColor: "#FFFFFF" }]}
      onPress={onPress}
      mode="elevated"
    >
      <Card.Content>
        <View style={styles.reportPreviewHeader}>
          <View>
            <Title style={styles.reportPreviewTitle}>{report.title}</Title>
            <Text style={styles.reportPreviewMeta}>
              {report.date} • {report.expenseCount} expenses
            </Text>
          </View>
          <Chip
            style={[
              styles.reportPreviewStatusChip,
              { backgroundColor: getStatusColor(report.status) },
            ]}
            textStyle={{ color: "white", fontSize: 12 }}
          >
            {getStatusLabel(report.status)}
          </Chip>
        </View>

        <Text style={styles.reportPreviewDescription} numberOfLines={2}>
          {report.description}
        </Text>

        <View style={styles.reportPreviewFooter}>
          <Text style={styles.reportPreviewAmount}>
            ${report.amount.toFixed(2)}
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

// Approval preview item component with new design
interface ApprovalPreviewItemProps {
  report: Report;
  onPress: () => void;
}

const ApprovalPreviewItem: React.FC<ApprovalPreviewItemProps> = ({
  report,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.approvalPreviewCard, { backgroundColor: "#FFFFFF" }]}
      onPress={onPress}
      mode="elevated"
    >
      <Card.Content>
        <View style={styles.approvalPreviewHeader}>
          <View>
            <Title style={styles.approvalPreviewTitle}>{report.title}</Title>
            <Text style={styles.approvalPreviewMeta}>
              Submitted by {report.submittedBy}
            </Text>
          </View>
          <Chip
            style={styles.approvalPreviewStatusChip}
            textStyle={{ color: "white", fontSize: 12 }}
          >
            Pending
          </Chip>
        </View>

        <Text style={styles.approvalPreviewDescription} numberOfLines={2}>
          {report.description}
        </Text>

        <View style={styles.approvalPreviewFooter}>
          <Text style={styles.approvalPreviewAmount}>
            ${report.amount.toFixed(2)}
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default function DashboardScreen() {
  const theme = useTheme();

  useLayoutEffect(() => {
    // Navigation header setup would go here
  }, []);

  // Navigation handler functions
  const handleNavigation = {
    // Stat card navigation
    statCard: (statType: string) => {
      switch (statType) {
        case "myReports":
          router.push("/(tabs)/expenses");
          break;
        case "myApprovals":
          router.push("/(tabs)/approvals");
          break;
        case "myReportsPending":
          router.push("/(tabs)/expenses?filter=pending");
          break;
        case "myReportsApproved":
          router.push("/(tabs)/expenses?filter=approved");
          break;
        default:
          break;
      }
    },

    // Status stat card navigation
    statusStat: (status: string) => {
      router.push(`/(tabs)/expenses?filter=${status}`);
    },

    // Time stat card navigation
    timeStat: (timeRange: string) => {
      router.push(`/(tabs)/approvals?filter=${timeRange}`);
    },

    // Report preview navigation
    reportPreview: (reportId: string) => {
      router.push(`/report-detail?id=${reportId}`);
    },

    // Approval preview navigation
    approvalPreview: (reportId: string) => {
      router.push(`/report-detail?id=${reportId}&mode=approval`);
    },

    // View all navigation
    viewAllReports: () => {
      router.push("/(tabs)/expenses");
    },

    viewAllApprovals: () => {
      router.push("/(tabs)/approvals");
    },
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Title
            style={[styles.welcomeTitle, { color: theme.colors.onSurface }]}
          >
            Expense Dashboard
          </Title>
          <Text
            style={[
              styles.welcomeSubtitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Track your reports and approvals
          </Text>
        </View>

        {/* Stats Overview Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            title="My Reports"
            value={mockDashboardStats.myReportsTotal}
            icon="description"
            color={theme.colors.primary}
            onPress={() => handleNavigation.statCard("myReports")}
          />
          <StatCard
            title="Pending Approvals"
            value={mockDashboardStats.myApprovalsTotal}
            icon="assignment"
            color="#FF9800"
            onPress={() => handleNavigation.statCard("myApprovals")}
          />
          <StatCard
            title="Pending Reports"
            value={mockDashboardStats.myReportsPending}
            icon="schedule"
            color="#F44336"
            onPress={() => handleNavigation.statCard("myReportsPending")}
          />
          <StatCard
            title="Approved Reports"
            value={mockDashboardStats.myReportsApproved}
            icon="check-circle"
            color="#4CAF50"
            onPress={() => handleNavigation.statCard("myReportsApproved")}
          />
        </View>

        {/* My Reports Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Title
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              My Reports
            </Title>
            <Button
              mode="text"
              onPress={handleNavigation.viewAllReports}
              compact
              labelStyle={[
                styles.viewAllButtonText,
                { color: theme.colors.primary },
              ]}
            >
              View All
            </Button>
          </View>

          {/* Status Stats */}
          <View style={styles.statusStatsContainer}>
            <StatusStatCard
              status="draft"
              count={mockMyReportsStats.draft}
              onPress={() => handleNavigation.statusStat("draft")}
            />
            <StatusStatCard
              status="submitted"
              count={mockMyReportsStats.submitted}
              onPress={() => handleNavigation.statusStat("submitted")}
            />
            <StatusStatCard
              status="approved"
              count={mockMyReportsStats.approved}
              onPress={() => handleNavigation.statusStat("approved")}
            />
            <StatusStatCard
              status="rejected"
              count={mockMyReportsStats.rejected}
              onPress={() => handleNavigation.statusStat("rejected")}
            />
          </View>

          {/* Recent Reports Preview */}
          <View style={styles.recentReportsContainer}>
            <Title
              style={[
                styles.subsectionTitle,
                { color: theme.colors.onSurface },
              ]}
            >
              Recent Reports
            </Title>
            {mockMyReportsStats.recentReports.map((report) => (
              <ReportPreviewItem
                key={report.id}
                report={report}
                onPress={() => handleNavigation.reportPreview(report.id)}
              />
            ))}
          </View>
        </View>

        {/* My Approvals Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Title
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              My Approvals
            </Title>
            <Button
              mode="text"
              onPress={handleNavigation.viewAllApprovals}
              compact
              labelStyle={[
                styles.viewAllButtonText,
                { color: theme.colors.primary },
              ]}
            >
              View All
            </Button>
          </View>

          {/* Time Stats */}
          <View style={styles.timeStatsContainer}>
            <TimeStatCard
              timeRange="today"
              count={mockMyApprovalsStats.today}
              onPress={() => handleNavigation.timeStat("today")}
            />
            <TimeStatCard
              timeRange="thisWeek"
              count={mockMyApprovalsStats.thisWeek}
              onPress={() => handleNavigation.timeStat("thisWeek")}
            />
            <TimeStatCard
              timeRange="thisMonth"
              count={mockMyApprovalsStats.thisMonth}
              onPress={() => handleNavigation.timeStat("thisMonth")}
            />
          </View>

          {/* Recent Approvals Preview */}
          <View style={styles.recentApprovalsContainer}>
            <Title
              style={[
                styles.subsectionTitle,
                { color: theme.colors.onSurface },
              ]}
            >
              Recent Approvals
            </Title>
            {mockMyApprovalsStats.recentReports.map((report) => (
              <ApprovalPreviewItem
                key={report.id}
                report={report}
                onPress={() => handleNavigation.approvalPreview(report.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  welcomeSubtitle: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: "400",
  },

  // Stats Overview Styles
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "48%",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  statCardContent: {
    padding: 16,
  },
  statTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    color: "#757575",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 10,
  },

  // Section Styles
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Status Stats Styles
  statusStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusStatCard: {
    borderRadius: 12,
    elevation: 2,
    flex: 0.24,
  },
  statusStatCardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusStatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statusStatValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  statusStatLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#757575",
    textAlign: "center",
  },

  // Time Stats Styles
  timeStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeStatCard: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    flex: 0.32,
  },
  timeStatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  timeStatValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  timeStatLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#757575",
  },

  // Report Preview Styles
  recentReportsContainer: {
    marginBottom: 16,
  },
  reportPreviewCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  reportPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reportPreviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  reportPreviewMeta: {
    fontSize: 12,
    color: "#757575",
  },
  reportPreviewStatusChip: {
    height: 36,
    alignSelf: "flex-start",
    borderRadius: 12,
  },
  reportPreviewDescription: {
    fontSize: 14,
    color: "#424242",
    marginBottom: 12,
    lineHeight: 20,
  },
  reportPreviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportPreviewAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1976D2",
  },

  // Approval Preview Styles
  recentApprovalsContainer: {
    marginBottom: 16,
  },
  approvalPreviewCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  approvalPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  approvalPreviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  approvalPreviewMeta: {
    fontSize: 12,
    color: "#757575",
  },
  approvalPreviewStatusChip: {
    height: 36,
    alignSelf: "flex-start",
    backgroundColor: "#FF9800",
    borderRadius: 12,
  },
  approvalPreviewDescription: {
    fontSize: 14,
    color: "#424242",
    marginBottom: 12,
    lineHeight: 20,
  },
  approvalPreviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  approvalPreviewAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1976D2",
  },
});
