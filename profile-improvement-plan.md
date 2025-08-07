# Profile改进计划

## 1. 项目概述
改进所有Tab页面右上角的Profile展示，使其更加美观和用户友好。

## 2. 当前状态分析
- 当前Profile在Tab页面中只是一个简单的文本按钮"Profile"
- 缺乏视觉吸引力，没有展示用户头像或个人信息
- 与应用的整体设计风格不够协调

## 3. 设计方案
### 3.1 视觉设计
- **用户头像**：使用圆形头像，带有轻微阴影效果，增加立体感
- **用户信息**：显示用户姓名和部门，采用层次分明的字体大小和颜色
- **交互效果**：添加点击反馈效果，如轻微缩放或颜色变化
- **整体布局**：采用水平排列，头像在左，信息在右，保持紧凑而美观

### 3.2 设计风格
- **颜色方案**：与应用主题色保持一致（#1976D2蓝色系）
- **字体样式**：使用Material Design字体规范，确保可读性
- **间距和布局**：遵循Material Design的8dp网格系统
- **阴影效果**：使用适当的阴影增加层次感

### 3.3 交互设计
- **点击效果**：点击后显示下拉菜单，包含Profile、Settings和Logout选项
- **动画效果**：添加平滑的过渡动画，提升用户体验
- **响应式设计**：确保在不同屏幕尺寸下都能良好显示

### 3.4 组件结构
- **ProfileHeader组件**：包含头像、用户名和部门信息
- **下拉菜单**：保持原有的菜单功能，但优化视觉效果
- **状态管理**：使用React状态管理菜单的显示和隐藏

## 4. 实施计划
### 4.1 创建新的ProfileHeader组件
- 创建一个新的组件文件 `app/components/ProfileHeader.tsx`
- 实现包含用户头像、姓名和部门信息的UI
- 添加点击交互和下拉菜单功能
- 确保组件与现有应用风格一致

### 4.2 更新Tab布局
- 修改 `app/(tabs)/_layout.tsx` 文件
- 将现有的ProfileMenu替换为新的ProfileHeader组件
- 确保所有Tab页面都使用新的组件

### 4.3 测试和优化
- 测试新组件在不同屏幕尺寸下的表现
- 确保下拉菜单功能正常工作
- 收集用户反馈并进行必要的调整

## 5. 技术实现细节
### 5.1 ProfileHeader组件实现
```typescript
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Avatar, Divider, Menu, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  avatar: {
    marginRight: 8,
  },
  userInfo: {
    maxWidth: 100,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  userDepartment: {
    fontSize: 10,
    color: '#90A4AE',
  },
});
```

### 5.2 更新Tab布局
修改 `app/(tabs)/_layout.tsx` 文件中的 `headerRight` 部分：
```typescript
import ProfileHeader from '../components/ProfileHeader';

// 在 screenOptions 中
headerRight: () => <ProfileHeader />,
```

## 6. 预期效果
- 所有Tab页面右上角的Profile展示将更加美观
- 用户可以快速查看自己的基本信息
- 保持原有的菜单功能，同时提升视觉效果
- 与应用的整体设计风格保持一致