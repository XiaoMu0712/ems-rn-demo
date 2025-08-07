import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Divider, Menu } from 'react-native-paper';

interface UserProfile {
  name: string;
  department: string;
  avatar?: string;
}

export default function ProfileHeader() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  
  // 模拟用户数据，实际应用中应从全局状态或API获取
  const userProfile: UserProfile = {
    name: 'John Doe',
    department: 'Engineering',
    avatar: 'https://via.placeholder.com/150/6200ee/white?text=JD'
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const onProfile = () => {
    closeMenu();
    router.push('/profile');
  };

  const onSettings = () => {
    closeMenu();
    // 暂时禁用设置页面功能，因为没有创建设置页面
    console.log('Settings page not implemented yet');
  };

  const onLogout = () => {
    closeMenu();
    router.replace('/login');
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      theme={{ colors: { elevation: { level2: '#ffffff' } } }}
      anchor={
        <View style={styles.container} onTouchEnd={openMenu}>
          <Avatar.Image 
            size={36} 
            source={{ uri: userProfile.avatar }} 
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {userProfile.name}
            </Text>
            <Text style={styles.userDepartment} numberOfLines={1}>
              {userProfile.department}
            </Text>
          </View>
        </View>
      }
    >
      <Menu.Item onPress={onProfile} title="Profile" />
      {/* 暂时禁用设置菜单项，因为没有创建设置页面 */}
      {/* <Menu.Item onPress={onSettings} title="Settings" /> */}
      <Divider />
      <Menu.Item onPress={onLogout} title="Logout" />
    </Menu>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    padding: 4,
    borderRadius: 8,
    // backgroundColor: 'rgba(25, 118, 210, 0.1)',
    // 添加响应式设计
    minWidth: 120,
    maxWidth: 160,
  },
  avatar: {
    marginRight: 8,
    // 添加阴影效果
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  userInfo: {
    // 响应式设计
    flex: 1,
    minWidth: 70,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    // 确保文本不会溢出
    includeFontPadding: false,
  },
  userDepartment: {
    fontSize: 10,
    color: '#90A4AE',
    // 确保文本不会溢出
    includeFontPadding: false,
  },
});