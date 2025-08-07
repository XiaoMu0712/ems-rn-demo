import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Modal,
  Paragraph,
  Portal,
  Switch,
  Text,
  TextInput,
  Title
} from 'react-native-paper';

interface UserProfile {
  name: string;
  email: string;
  department: string;
  employeeId: string;
  avatar: string;
}

const mockProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@company.com',
  department: 'Engineering',
  employeeId: 'EMP001',
  avatar: 'https://via.placeholder.com/150/6200ee/white?text=JD'
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: profile.name,
    department: profile.department,
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Logged out successfully!', [
              { text: 'OK', onPress: () => router.replace('/login') }
            ]);
          }
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editProfile.name,
      department: editProfile.department,
    });
    setModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your expense data will be exported as a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Data exported successfully!') }
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Data',
      'This will delete all your expense data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'Data reset successfully!')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Image 
              size={80} 
              source={{ uri: profile.avatar }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Title style={styles.profileName}>{profile.name}</Title>
              <Paragraph style={styles.profileEmail}>{profile.email}</Paragraph>
              <Paragraph style={styles.profileDepartment}>
                {profile.department} • {profile.employeeId}
              </Paragraph>
            </View>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(true)}
              style={styles.editButton}
              compact
            >
              Edit
            </Button>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Settings</Title>
            
            <List.Item
              title="Push Notifications"
              description="Receive notifications for expense updates"
              left={props => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Auto Sync"
              description="Automatically sync data when connected"
              left={props => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={autoSync}
                  onValueChange={setAutoSync}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Export Data"
              description="Download your expense data as CSV"
              left={props => <List.Icon {...props} icon="download" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleExportData}
            />
            
            <Divider />
            
            <List.Item
              title="Help & Support"
              description="Get help with using the app"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Help', 'Contact support at support@company.com')}
            />
            
            <Divider />
            
            <List.Item
              title="About"
              description="App version and information"
              left={props => <List.Icon {...props} icon="information" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('About', 'EMS App v1.0.0\nExpense Management System')}
            />
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: '#F44336' }]}>Danger Zone</Title>
            
            <Button
              mode="outlined"
              onPress={handleResetData}
              style={[styles.dangerButton, { borderColor: '#F44336' }]}
              textColor="#F44336"
              icon="delete"
            >
              Reset All Data
            </Button>
            
            <Button
              mode="contained"
              onPress={handleLogout}
              style={[styles.dangerButton, { backgroundColor: '#F44336' }]}
              icon="logout"
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Edit Profile</Title>
          
          <TextInput
            label="Full Name"
            value={editProfile.name}
            onChangeText={(text) => setEditProfile({ ...editProfile, name: text })}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          
          <TextInput
            label="Department"
            value={editProfile.department}
            onChangeText={(text) => setEditProfile({ ...editProfile, department: text })}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="office-building" />}
          />
          
          <Text style={styles.readOnlyLabel}>Email (Read Only)</Text>
          <TextInput
            value={profile.email}
            mode="outlined"
            disabled
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
          
          <Text style={styles.readOnlyLabel}>Employee ID (Read Only)</Text>
          <TextInput
            value={profile.employeeId}
            mode="outlined"
            disabled
            style={styles.input}
            left={<TextInput.Icon icon="badge-account" />}
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
              onPress={handleSaveProfile}
              style={styles.modalButton}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
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
  profileCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#90A4AE',
    marginBottom: 2,
  },
  profileDepartment: {
    color: '#90A4AE',
    fontSize: 12,
  },
  editButton: {
    marginLeft: 8,
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  settingsCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  dangerCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  dangerButton: {
    marginBottom: 12,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  readOnlyLabel: {
    fontSize: 12,
    color: '#90A4AE',
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 0.45,
  },
});