import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { useDeclarationStore } from '@/stores/declarationStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import RadioGroup from '@/components/RadioGroup';
import Checkbox from '@/components/Checkbox';
import Colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function CreateDeclarationScreen() {
  const { createDeclaration } = useDeclarationStore();
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  // Form state
  const [transactionVolume, setTransactionVolume] = useState<'less' | 'above'>('less');
  const [transactionNo, setTransactionNo] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [idNo, setIdNo] = useState('');
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  
  const [sourceOfFund, setSourceOfFund] = useState<'savings' | 'employment' | 'sale' | 'inheritance' | 'business' | 'others'>('savings');
  const [sourceOfFundOthers, setSourceOfFundOthers] = useState('');
  
  const [purposeOfTransaction, setPurposeOfTransaction] = useState<'savings' | 'employment' | 'sale' | 'investment' | 'holiday' | 'business' | 'others'>('savings');
  const [purposeOfTransactionOthers, setPurposeOfTransactionOthers] = useState('');
  
  const [beneficialOwner, setBeneficialOwner] = useState<'none' | 'shares'>('none');
  const [beneficialOwnerShare, setBeneficialOwnerShare] = useState('');
  
  const [crossBorderMovement, setCrossBorderMovement] = useState(false);
  const [complianceMAS, setComplianceMAS] = useState(false);
  const [compliancePEP, setCompliancePEP] = useState(false);
  const [complianceTaxEvasion, setComplianceTaxEvasion] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!transactionNo.trim()) newErrors.transactionNo = 'Transaction No is required';
    if (!transactionDate.trim()) newErrors.transactionDate = 'Transaction Date is required';
    if (!idNo.trim()) newErrors.idNo = 'ID No is required';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!dob.trim()) newErrors.dob = 'Date of Birth is required';
    if (!phoneNo.trim()) newErrors.phoneNo = 'Phone No is required';
    
    if (sourceOfFund === 'others' && !sourceOfFundOthers.trim()) {
      newErrors.sourceOfFundOthers = 'Please specify other source of fund';
    }
    
    if (purposeOfTransaction === 'others' && !purposeOfTransactionOthers.trim()) {
      newErrors.purposeOfTransactionOthers = 'Please specify other purpose of transaction';
    }
    
    if (beneficialOwner === 'shares' && !beneficialOwnerShare.trim()) {
      newErrors.beneficialOwnerShare = 'Please specify share percentage';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      createDeclaration({
        transactionVolume,
        transactionNo,
        transactionDate,
        idNo,
        name,
        nationality,
        address,
        dob,
        phoneNo,
        sourceOfFund,
        sourceOfFundOthers,
        purposeOfTransaction,
        purposeOfTransactionOthers,
        beneficialOwner,
        beneficialOwnerShare,
        crossBorderMovement,
        complianceMAS,
        compliancePEP,
        complianceTaxEvasion
      });
      
      Alert.alert(
        'Success',
        'Declaration created successfully',
        [
          { 
            text: 'View Declaration', 
            onPress: () => {
              const declarationId = useDeclarationStore.getState().currentDeclaration?.id;
              if (declarationId) {
                router.push(`/declaration/${declarationId}`);
              }
            } 
          },
          { 
            text: 'Create Another', 
            onPress: () => {
              // Reset form
              setTransactionVolume('less');
              setTransactionNo('');
              setTransactionDate('');
              setIdNo('');
              setName('');
              setNationality('');
              setAddress('');
              setDob('');
              setPhoneNo('');
              setSourceOfFund('savings');
              setSourceOfFundOthers('');
              setPurposeOfTransaction('savings');
              setPurposeOfTransactionOthers('');
              setBeneficialOwner('none');
              setBeneficialOwnerShare('');
              setCrossBorderMovement(false);
              setComplianceMAS(false);
              setCompliancePEP(false);
              setComplianceTaxEvasion(false);
            } 
          },
        ]
      );
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>TRANSACTION VOLUME</Text>
          <RadioGroup
            options={[
              { label: 'Less than 20,000', value: 'less' },
              { label: 'Above 20,000', value: 'above' }
            ]}
            selectedValue={transactionVolume}
            onValueChange={(value) => setTransactionVolume(value as 'less' | 'above')}
            horizontal
          />
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>TRANSACTION REPORT</Text>
          <Input
            label="Transaction No"
            value={transactionNo}
            onChangeText={setTransactionNo}
            placeholder="Enter transaction number"
            error={errors.transactionNo}
          />
          
          <Input
            label="Transaction Date"
            value={transactionDate}
            onChangeText={setTransactionDate}
            placeholder="DD/MM/YYYY"
            error={errors.transactionDate}
          />
          
          <Input
            label="ID No"
            value={idNo}
            onChangeText={setIdNo}
            placeholder="Enter ID number"
            error={errors.idNo}
          />
          
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
            error={errors.name}
            autoCapitalize="words"
          />
          
          <Input
            label="Nationality"
            value={nationality}
            onChangeText={setNationality}
            placeholder="Enter nationality"
            error={errors.nationality}
            autoCapitalize="words"
          />
          
          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            error={errors.address}
            multiline
            numberOfLines={2}
          />
          
          <Input
            label="Date of Birth"
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
            error={errors.dob}
          />
          
          <Input
            label="Phone No"
            value={phoneNo}
            onChangeText={setPhoneNo}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            error={errors.phoneNo}
          />
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SOURCE OF FUND</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.text }]}>I declare that the source of this currency is from:</Text>
          
          <RadioGroup
            options={[
              { label: 'Savings', value: 'savings' },
              { label: 'Employment', value: 'employment' },
              { label: 'Sale/Buy Property', value: 'sale' },
              { label: 'Inheritance', value: 'inheritance' },
              { label: 'Business', value: 'business' },
              { label: 'Others', value: 'others' }
            ]}
            selectedValue={sourceOfFund}
            onValueChange={(value) => setSourceOfFund(value as any)}
          />
          
          {sourceOfFund === 'others' && (
            <Input
              value={sourceOfFundOthers}
              onChangeText={setSourceOfFundOthers}
              placeholder="Please specify"
              error={errors.sourceOfFundOthers}
            />
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>PURPOSE OF TRANSACTION</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.text }]}>I declare that the purpose of this transaction is for:</Text>
          
          <RadioGroup
            options={[
              { label: 'Savings', value: 'savings' },
              { label: 'Employment', value: 'employment' },
              { label: 'Sale/Buy Property', value: 'sale' },
              { label: 'Investment', value: 'investment' },
              { label: 'Holiday', value: 'holiday' },
              { label: 'Business', value: 'business' },
              { label: 'Others', value: 'others' }
            ]}
            selectedValue={purposeOfTransaction}
            onValueChange={(value) => setPurposeOfTransaction(value as any)}
          />
          
          {purposeOfTransaction === 'others' && (
            <Input
              value={purposeOfTransactionOthers}
              onChangeText={setPurposeOfTransactionOthers}
              placeholder="Please specify"
              error={errors.purposeOfTransactionOthers}
            />
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>BENEFICIAL OWNER</Text>
          
          <RadioGroup
            options={[
              { label: 'I/We hereby declare that there is no other beneficial owner is involved in this money exchange transaction.', value: 'none' },
              { label: 'I/We hereby declare the above person/entity owns (%) share in this money exchange transaction.', value: 'shares' }
            ]}
            selectedValue={beneficialOwner}
            onValueChange={(value) => setBeneficialOwner(value as 'none' | 'shares')}
          />
          
          {beneficialOwner === 'shares' && (
            <Input
              value={beneficialOwnerShare}
              onChangeText={setBeneficialOwnerShare}
              placeholder="Enter share percentage"
              keyboardType="numeric"
              error={errors.beneficialOwnerShare}
            />
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>CROSS BORDER MOVEMENTS OF PHYSICAL CURRENCY (CBM)≥S$20,000 & ABOVE OR ITS EQUIVALENT IN A FOREIGN CURRENCY</Text>
          
          <View style={styles.questionContainer}>
            <Text style={[styles.question, { color: colors.text }]}>Are the funds moved from/to other country?</Text>
            <View style={styles.radioRow}>
              <TouchableOpacity
                style={[
                  styles.radioOption, 
                  { borderColor: colors.border },
                  !crossBorderMovement && { 
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  }
                ]}
                onPress={() => setCrossBorderMovement(false)}
              >
                <Text style={[
                  styles.radioText, 
                  { color: !crossBorderMovement ? '#FFFFFF' : colors.text }
                ]}>NO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioOption, 
                  { borderColor: colors.border },
                  crossBorderMovement && { 
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  }
                ]}
                onPress={() => setCrossBorderMovement(true)}
              >
                <Text style={[
                  styles.radioText, 
                  { color: crossBorderMovement ? '#FFFFFF' : colors.text }
                ]}>YES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>COMPLIANCE WITH MONETARY AUTHORITY OF SINGAPORE (MAS)</Text>
          
          <View style={styles.complianceContainer}>
            <View style={styles.complianceQuestion}>
              <Text style={[styles.question, { color: colors.text }]}>Does the funds have any correlation to any MAS or united nations sanctioned individuals or entities?</Text>
              <View style={styles.yesNoContainer}>
                <TouchableOpacity
                  style={[
                    styles.yesNoOption, 
                    { borderColor: colors.border },
                    !complianceMAS && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => setComplianceMAS(false)}
                >
                  <Text style={[
                    styles.yesNoText, 
                    { color: !complianceMAS ? '#FFFFFF' : colors.text }
                  ]}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.yesNoOption, 
                    { borderColor: colors.border },
                    complianceMAS && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => setComplianceMAS(true)}
                >
                  <Text style={[
                    styles.yesNoText, 
                    { color: complianceMAS ? '#FFFFFF' : colors.text }
                  ]}>YES</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.complianceQuestion}>
              <Text style={[styles.question, { color: colors.text }]}>Does the funds are linked to any Politically Exposed Persons (PEPs)?</Text>
              <View style={styles.yesNoContainer}>
                <TouchableOpacity
                  style={[
                    styles.yesNoOption, 
                    { borderColor: colors.border },
                    !compliancePEP && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => setCompliancePEP(false)}
                >
                  <Text style={[
                    styles.yesNoText, 
                    { color: !compliancePEP ? '#FFFFFF' : colors.text }
                  ]}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.yesNoOption, 
                    { borderColor: colors.border },
                    compliancePEP && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => setCompliancePEP(true)}
                >
                  <Text style={[
                    styles.yesNoText, 
                    { color: compliancePEP ? '#FFFFFF' : colors.text }
                  ]}>YES</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.complianceQuestion}>
              <Text style={[styles.question, { color: colors.text }]}>Does the funds have any link to any tax evasion offenses (local/foreign)?</Text>
              <View style={styles.yesNoContainer}>
                <TouchableOpacity
                  style={[
                    styles.yesNoOption, 
                    { borderColor: colors.border },
                    !complianceTaxEvasion && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => setComplianceTaxEvasion(false)}
                >
                  <Text style={[
                    styles.yesNoText, 
                    { color: !complianceTaxEvasion ? '#FFFFFF' : colors.text }
                  ]}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.yesNoOption, 
                    { borderColor: colors.border },
                    complianceTaxEvasion && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => setComplianceTaxEvasion(true)}
                >
                  <Text style={[
                    styles.yesNoText, 
                    { color: complianceTaxEvasion ? '#FFFFFF' : colors.text }
                  ]}>YES</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>DECLARATION</Text>
          <Text style={[styles.declaration, { color: colors.text }]}>
            I/We hereby declared that the information furnished above are true and correct to the best of my/our knowledge.
          </Text>
        </View>
        
        <Button
          title="Submit Declaration"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  questionContainer: {
    marginBottom: 16,
  },
  question: {
    fontSize: 14,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radioOption: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderWidth: 1,
    marginRight: 12,
    borderRadius: 6,
  },
  radioText: {
    fontSize: 14,
  },
  complianceContainer: {
    marginTop: 8,
  },
  complianceQuestion: {
    marginBottom: 16,
  },
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  yesNoOption: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginLeft: 8,
    borderRadius: 6,
  },
  yesNoText: {
    fontSize: 14,
  },
  declaration: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
  },
});