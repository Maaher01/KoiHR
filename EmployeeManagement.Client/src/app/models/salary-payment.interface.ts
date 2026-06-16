export interface SalaryPayment {
  id: number;
  salaryEntryId: number;
  payDate: string;
  paymentMethod: string;
}

export interface SalaryPaymentAdd {
  payDate: string;
  paymentMethod: number;
}
