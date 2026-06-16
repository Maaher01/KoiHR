import { SalaryBenefit } from './salary-benefit.interface';

export interface SalaryEntry {
  entryId: number;
  employeeName: string;
  year: number;
  month: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  basicSalary: number;
  absentDeduction: number;
  additionBenefits: number;
  deductionBenefits: number;
  benefitBreakdown: SalaryBenefit[];
  netSalary: number;
  isPaid: boolean;
}
