import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  IconButton,
  Surface,
  Text,
  TextInput
} from 'react-native-paper';

export default function ConfirmAmountScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  const [amount, setAmount] = useState('50.52');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Mock receipt data - in real app this would come from camera OCR
  const receiptData = {
    storeName: 'G2 BIG APPLE DELI',
    address: '123 Main Street, New York, NY 10001',
    total: '$50.52'
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Confirm Amount',
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={24}
          onPress={() => router.back()}
        />
      ),
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: 'white',
    });
  }, [navigation, router]);

  const handleConfirm = () => {
    // Handle amount confirmation and save to database
    console.log('Confirmed amount:', amount);
    
    // Simulate saving to database
    setTimeout(() => {
      setIsSaved(true);
      setIsEditing(false);
    }, 500);
  };

  const handleIncorrect = () => {
    // Switch to editing mode
    setIsEditing(true);
  };

  const handleAmountPress = () => {
    // Handle amount button press - save receipt
    console.log('Amount confirmed:', amount);
    
    // Simulate saving to database
    setTimeout(() => {
      setIsSaved(true);
    }, 500);
  };

  const handleNextReceipt = () => {
    // Reset state for next receipt
    setIsSaved(false);
    setAmount('0.00');
    setIsEditing(false);
    // In real app, this would navigate to camera screen
    console.log('Taking photo for next receipt');
  };

  const handleDone = () => {
    // Navigate back to report detail
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Receipt Image */}
        <View style={styles.imageContainer}>
          <Surface style={styles.imageSurface}>
            <View style={styles.receiptImageContainer}>
              <Text style={styles.receiptText}>G2 BIG APPLE DELI</Text>
              <Text style={styles.receiptSubText}>123 Main Street</Text>
              <Text style={styles.receiptSubText}>New York, NY 10001</Text>
              
              <View style={styles.receiptContent}>
                <Text style={styles.orderText}>ORDER: 19</Text>
                <Text style={styles.detailText}>Cashier: John S</Text>
                <Text style={styles.detailText}>Transaction: 047539</Text>
                
                <View style={styles.itemsSection}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemText}>1 (12) BAGELS</Text>
                    <Text style={styles.priceText}>$17.25</Text>
                  </View>
                  
                  <Text style={styles.subItemText}>  Asiago (Bkfst Bagel) $0.75</Text>
                  <Text style={styles.subItemText}>  Asiago (Bkfst Bagel) $0.75</Text>
                  <Text style={styles.subItemText}>  Everything Bagel $0.00</Text>
                  <Text style={styles.subItemText}>  Plain Bagel $0.00</Text>
                  <Text style={styles.subItemText}>  Cinnamon Sugar Bagel $0.00</Text>
                  
                  <View style={styles.itemRow}>
                    <Text style={styles.itemText}>1 (12) BAGELS</Text>
                    <Text style={styles.priceText}>$17.25</Text>
                  </View>
                  
                  <Text style={styles.subItemText}>  Blueberry Bagel $0.00</Text>
                  <Text style={styles.subItemText}>  Apple Pie (Bkfst Bagel) $0.75</Text>
                  <Text style={styles.subItemText}>  Chocolate Chip Bagel $0.00</Text>
                  <Text style={styles.subItemText}>  Swiss Mac (Bkfst Bagel) $0.75</Text>
                  <Text style={styles.subItemText}>  Honey Oat Bagel $0.00</Text>
                </View>
                
                <View style={styles.totalSection}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalText}>$42.19</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Tax</Text>
                    <Text style={styles.totalText}>$8.33</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.finalText}>CREDIT CARD SALE</Text>
                    <Text style={styles.finalText}>$50.52</Text>
                  </View>
                  <Text style={styles.cardText}>VISA 5411</Text>
                </View>
                
                <Text style={styles.footerText}>Return this copy for statement validation</Text>
                <Text style={styles.footerText}>Station: G2 POS</Text>
              </View>
            </View>
          </Surface>
        </View>
        
        {/* Amount Confirmation Section */}
        <View style={styles.confirmationSection}>
          {!isSaved ? (
            <>
              <Text style={styles.questionText}>What is the amount on this receipt ?</Text>
              
              <View style={styles.amountInputContainer}>
                {!isEditing ? (
                  <Button
                    mode="contained"
                    onPress={handleAmountPress}
                    style={styles.amountButton}
                    labelStyle={styles.amountButtonText}
                  >
                    ${amount}
                  </Button>
                ) : (
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    style={styles.amountInput}
                    mode="outlined"
                    keyboardType="decimal-pad"
                    textAlign="center"
                    outlineColor="#1976D2"
                    activeOutlineColor="#1976D2"
                    autoFocus
                  />
                )}
              </View>
              
              <Button
                mode="outlined"
                onPress={isEditing ? handleConfirm : handleIncorrect}
                style={styles.incorrectButton}
                labelStyle={styles.incorrectButtonText}
              >
                {isEditing ? 'Confirm' : 'Incorrect'}
              </Button>
            </>
          ) : (
            <>
              {/* Saved State UI */}
              <View style={styles.savedAmountContainer}>
                <Text style={styles.savedAmountText}>${amount}</Text>
              </View>
              
              <View style={styles.actionButtonsContainer}>
                <Button
                  mode="text"
                  onPress={handleNextReceipt}
                  style={styles.nextReceiptButton}
                  labelStyle={styles.nextReceiptButtonText}
                >
                  Next receipt
                </Button>
                
                <Button
                  mode="contained"
                  onPress={handleDone}
                  style={styles.doneButton}
                  labelStyle={styles.doneButtonText}
                >
                  Done
                </Button>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      
      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.homeIndicator} />
      </View>   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  imageSurface: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 4,
    padding: 8,
  },
  receiptImageContainer: {
    width: '100%',
    minHeight: 500,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  receiptText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1565C0',
  },
  receiptSubText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#90A4AE',
    marginBottom: 2,
  },
  receiptContent: {
    marginTop: 16,
  },
  orderText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1565C0',
  },
  detailText: {
    fontSize: 10,
    color: '#90A4AE',
    marginBottom: 2,
  },
  itemsSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 11,
    color: '#1565C0',
  },
  priceText: {
    fontSize: 11,
    color: '#1565C0',
  },
  subItemText: {
    fontSize: 9,
    color: '#90A4AE',
    marginBottom: 2,
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: '#1565C0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  finalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  cardText: {
    fontSize: 10,
    color: '#90A4AE',
    marginTop: 4,
  },
  footerText: {
    fontSize: 8,
    color: '#90A4AE',
    marginTop: 8,
  },
  confirmationSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1565C0',
  },
  amountInputContainer: {
    marginBottom: 16,
  },
  amountInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
  },
  amountButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  incorrectButton: {
    borderColor: '#1976D2',
    borderWidth: 1,
    paddingVertical: 8,
  },
  incorrectButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomBar: {
    backgroundColor: '#000',
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  savedAmountContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  savedAmountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  actionButtonsContainer: {
    // gap: 16, // gap may not be supported in all React Native versions
  },
  nextReceiptButton: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  nextReceiptButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});