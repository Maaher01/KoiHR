export interface SalaryBenefit {
  id: number;
  title: string;
  isAddition: boolean;
  amount: number;
}

export interface SalaryBenefitAddEdit {
  title: string;
  isAddition: boolean;
  amount: number;
}
