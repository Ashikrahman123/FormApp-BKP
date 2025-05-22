import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Share,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDeclarationStore } from '@/stores/declarationStore';
import { useAuthStore } from '@/stores/authStore';
import { Share2, Printer } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function DeclarationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { currentDeclaration, getDeclaration, isLoading } = useDeclarationStore();
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const [isPrinting, setIsPrinting] = useState(false);
  
  useEffect(() => {
    if (id) {
      getDeclaration(id);
    }
  }, [id]);
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Declaration #${currentDeclaration?.transactionNo} - ${currentDeclaration?.name}`,
        title: 'Share Declaration'
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the declaration');
    }
  };
  
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Simulate printing process
    setTimeout(() => {
      setIsPrinting(false);
      Alert.alert(
        'Print Successful',
        'Declaration has been sent to printer',
        [{ text: 'OK' }]
      );
    }, 2000);
  };
  
  if (isLoading || !currentDeclaration) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading declaration...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, { color: colors.text }]}>{user?.storeName}</Text>
          <Text style={[styles.storeAddress, { color: colors.text }]}>{user?.storeAddress}</Text>
        </View>
      </View>
      
      <View style={[styles.titleContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>DECLARATION FORM</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Printer size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>TRANSACTION VOLUME</Text>
        <View style={styles.checkboxRow}>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.transactionVolume === 'less' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Less than 20,000</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.transactionVolume === 'above' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Above 20,000</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>TRANSACTION REPORT</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Transaction No</Text>
          <Text style={[styles.colon, { color: colors.text }]}>:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentDeclaration.transactionNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Transaction Date</Text>
          <Text style={[styles.colon, { color: colors.text }]}>:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentDeclaration.transactionDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>ID No</Text>
          <Text style={[styles.colon, { color: colors.text }]}>:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentDeclaration.idNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Name</Text>
          <Text style={[styles.colon, { color: colors.text }]}>:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentDeclaration.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Nationality</Text>
          <Text style={[styles.colon, { color: colors.text }]}>:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentDeclaration.nationality}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Address</Text>
          <Text style={[styles.colon, { color: colors.text }]}>:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentDeclaration.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>DOB</Text>
          <Text style={[styles.colon, { color: colors.text }]}>:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentDeclaration.dob}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Phone No</Text>
          <Text style={[styles.colon, { color: colors.text }]}>:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentDeclaration.phoneNo}</Text>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>SOURCE OF FUND</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.text }]}>I declare that the source of this currency is from:</Text>
        
        <View style={styles.checkboxGrid}>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.sourceOfFund === 'savings' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Savings</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.sourceOfFund === 'employment' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Employment</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.sourceOfFund === 'sale' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Sale/Buy Property</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.sourceOfFund === 'inheritance' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Inheritance</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.sourceOfFund === 'business' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Business</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.sourceOfFund === 'others' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Others</Text>
            {currentDeclaration.sourceOfFund === 'others' && (
              <Text style={[styles.otherValue, { color: colors.primary }]}>{currentDeclaration.sourceOfFundOthers}</Text>
            )}
          </View>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>PURPOSE OF TRANSACTION</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.text }]}>I declare that the purpose of this transaction is for:</Text>
        
        <View style={styles.checkboxGrid}>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.purposeOfTransaction === 'savings' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Savings</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.purposeOfTransaction === 'employment' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Employment</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.purposeOfTransaction === 'sale' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Sale/Buy Property</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.purposeOfTransaction === 'investment' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Investment</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.purposeOfTransaction === 'holiday' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Holiday</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.purposeOfTransaction === 'business' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Business</Text>
          </View>
          <View style={styles.checkboxItem}>
            <View style={[
              styles.checkbox,
              { borderColor: colors.text },
              currentDeclaration.purposeOfTransaction === 'others' && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Others</Text>
            {currentDeclaration.purposeOfTransaction === 'others' && (
              <Text style={[styles.otherValue, { color: colors.primary }]}>{currentDeclaration.purposeOfTransactionOthers}</Text>
            )}
          </View>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>BENEFICIAL OWNER</Text>
        
        <View style={styles.beneficialOwnerItem}>
          <View style={[
            styles.checkbox,
            { borderColor: colors.text },
            currentDeclaration.beneficialOwner === 'none' && { 
              backgroundColor: colors.primary,
              borderColor: colors.primary
            }
          ]} />
          <Text style={[styles.beneficialOwnerText, { color: colors.text }]}>
            I/We hereby declare that there is no other beneficial owner is involved in this money exchange transaction.
          </Text>
        </View>
        
        <View style={styles.beneficialOwnerItem}>
          <View style={[
            styles.checkbox,
            { borderColor: colors.text },
            currentDeclaration.beneficialOwner === 'shares' && { 
              backgroundColor: colors.primary,
              borderColor: colors.primary
            }
          ]} />
          <Text style={[styles.beneficialOwnerText, { color: colors.text }]}>
            I/We hereby declare the above person/entity owns 
            {currentDeclaration.beneficialOwner === 'shares' && (
              <Text style={[styles.sharePercentage, { color: colors.primary }]}> {currentDeclaration.beneficialOwnerShare}% </Text>
            )}
            share in this money exchange transaction.
          </Text>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>CROSS BORDER MOVEMENTS OF PHYSICAL CURRENCY (CBM)≥S$20,000 & ABOVE OR ITS EQUIVALENT IN A FOREIGN CURRENCY</Text>
        
        <View style={styles.crossBorderContainer}>
          <Text style={[styles.crossBorderQuestion, { color: colors.text }]}>Are the funds moved from/to other country?</Text>
          <View style={styles.yesNoContainer}>
            <View style={styles.yesNoItem}>
              <View style={[
                styles.yesNoBox,
                { borderColor: colors.text },
                !currentDeclaration.crossBorderMovement && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]} />
              <Text style={[styles.yesNoText, { color: colors.text }]}>NO</Text>
            </View>
            <View style={styles.yesNoItem}>
              <View style={[
                styles.yesNoBox,
                { borderColor: colors.text },
                currentDeclaration.crossBorderMovement && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]} />
              <Text style={[styles.yesNoText, { color: colors.text }]}>YES</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>COMPLIANCE WITH MONETARY AUTHORITY OF SINGAPORE (MAS)</Text>
        
        <View style={styles.complianceItem}>
          <Text style={[styles.complianceQuestion, { color: colors.text }]}>
            Does the funds have any correlation to any MAS or united nations sanctioned individuals or entities?
          </Text>
          <View style={styles.complianceYesNo}>
            <View style={styles.yesNoItem}>
              <View style={[
                styles.yesNoBox,
                { borderColor: colors.text },
                !currentDeclaration.complianceMAS && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]} />
              <Text style={[styles.yesNoText, { color: colors.text }]}>NO</Text>
            </View>
            <View style={styles.yesNoItem}>
              <View style={[
                styles.yesNoBox,
                { borderColor: colors.text },
                currentDeclaration.complianceMAS && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]} />
              <Text style={[styles.yesNoText, { color: colors.text }]}>YES</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.complianceItem}>
          <Text style={[styles.complianceQuestion, { color: colors.text }]}>
            Does the funds are linked to any Politically Exposed Persons (PEPs)?
          </Text>
          <View style={styles.complianceYesNo}>
            <View style={styles.yesNoItem}>
              <View style={[
                styles.yesNoBox,
                { borderColor: colors.text },
                !currentDeclaration.compliancePEP && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]} />
              <Text style={[styles.yesNoText, { color: colors.text }]}>NO</Text>
            </View>
            <View style={styles.yesNoItem}>
              <View style={[
                styles.yesNoBox,
                { borderColor: colors.text },
                currentDeclaration.compliancePEP && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]} />
              <Text style={[styles.yesNoText, { color: colors.text }]}>YES</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.complianceItem}>
          <Text style={[styles.complianceQuestion, { color: colors.text }]}>
            Does the funds have any link to any tax evasion offenses (local/foreign)?
          </Text>
          <View style={styles.complianceYesNo}>
            <View style={styles.yesNoItem}>
              <View style={[
                styles.yesNoBox,
                { borderColor: colors.text },
                !currentDeclaration.complianceTaxEvasion && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]} />
              <Text style={[styles.yesNoText, { color: colors.text }]}>NO</Text>
            </View>
            <View style={styles.yesNoItem}>
              <View style={[
                styles.yesNoBox,
                { borderColor: colors.text },
                currentDeclaration.complianceTaxEvasion && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]} />
              <Text style={[styles.yesNoText, { color: colors.text }]}>YES</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>DECLARATION</Text>
        <Text style={[styles.declarationText, { color: colors.text }]}>
          I/We hereby declared that the information furnished above are true and correct to the best of my/our knowledge.
        </Text>
        
        <View style={styles.signatureSection}>
          <View style={[styles.signatureBox, { borderColor: colors.text }]} />
          <View style={styles.signatureInfo}>
            <Text style={[styles.signatureLabel, { color: colors.text }]}>Customer's Signature</Text>
            <Text style={[styles.signatureIdLabel, { color: colors.text }]}>ID No: {currentDeclaration.idNo}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.pageNumber, { color: colors.placeholder }]}>Page 1 of 1</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Platform.OS === 'ios' ? '#E1E5EB' : 'transparent',
  },
  storeInfo: {
    alignItems: 'center',
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 12,
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  section: {
    padding: 16,
    marginTop: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    marginBottom: 8,
    minWidth: 120,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    width: 100,
  },
  colon: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  otherValue: {
    fontSize: 12,
    marginLeft: 24,
  },
  beneficialOwnerItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  beneficialOwnerText: {
    fontSize: 12,
    flex: 1,
    marginLeft: 8,
  },
  sharePercentage: {
    fontWeight: 'bold',
  },
  crossBorderContainer: {
    marginTop: 8,
  },
  crossBorderQuestion: {
    fontSize: 12,
    marginBottom: 8,
  },
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  yesNoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  yesNoBox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  yesNoText: {
    fontSize: 12,
  },
  complianceItem: {
    marginBottom: 16,
  },
  complianceQuestion: {
    fontSize: 12,
    marginBottom: 8,
  },
  complianceYesNo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  declarationText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  signatureSection: {
    flexDirection: 'row',
    marginTop: 16,
  },
  signatureBox: {
    width: 120,
    height: 80,
    borderWidth: 1,
    marginRight: 16,
  },
  signatureInfo: {
    justifyContent: 'flex-end',
  },
  signatureLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  signatureIdLabel: {
    fontSize: 12,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 10,
  },
});