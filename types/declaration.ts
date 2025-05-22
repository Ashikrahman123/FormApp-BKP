export interface Declaration {
  id: string;
  transactionVolume: 'less' | 'above';
  transactionNo: string;
  transactionDate: string;
  idNo: string;
  name: string;
  nationality: string;
  address: string;
  dob: string;
  phoneNo: string;
  sourceOfFund: 'savings' | 'employment' | 'sale' | 'inheritance' | 'business' | 'others';
  sourceOfFundOthers?: string;
  purposeOfTransaction: 'savings' | 'employment' | 'sale' | 'investment' | 'holiday' | 'business' | 'others';
  purposeOfTransactionOthers?: string;
  beneficialOwner: 'none' | 'shares';
  beneficialOwnerShare?: string;
  crossBorderMovement: boolean;
  complianceMAS: boolean;
  compliancePEP: boolean;
  complianceTaxEvasion: boolean;
  createdAt: string;
  userId: string;
}

export interface DeclarationState {
  declarations: Declaration[];
  currentDeclaration: Declaration | null;
  isLoading: boolean;
  error: string | null;
  createDeclaration: (declaration: Omit<Declaration, 'id' | 'createdAt' | 'userId'>) => void;
  getDeclarations: () => void;
  getDeclaration: (id: string) => void;
  clearCurrentDeclaration: () => void;
  clearError: () => void;
}