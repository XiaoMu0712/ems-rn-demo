import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, Divider, Menu } from 'react-native-paper';

export default function ProfileMenu() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const onProfile = () => {
    closeMenu();
    router.push('/profile');
  };

  const onSettings = () => {
    closeMenu();
    // 暂时禁用设置页面功能，因为没有创建设置页面
    // router.push('/settings');
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
      anchor={
        <Button onPress={openMenu} compact mode="text" style={{ marginRight: 8 }}>
          Profile
        </Button>
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