
export enum Role {
  Admin = 'ADMIN',
  Staff = 'STAFF',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export interface Vaccination {
  name: string;
  date: string;
  nextDueDate: string;
}

export interface Pregnancy {
  isPregnant: boolean;
  dueDate?: string;
  lastBredDate?: string;
}

export interface Cow {
  id: string;
  name: string;
  tagId: string;
  gender: Gender;
  breed: string;
  birthDate: string;
  imageUrl: string;
  healthStatus: 'Healthy' | 'Sick' | 'Under Observation';
  vaccinations: Vaccination[];
  pregnancy: Pregnancy;
  notes: string;
  expectedYield: number; // in liters
}

export interface MilkRecord {
  cowId: string;
  date: string; // YYYY-MM-DD
  amount: number; // in liters
}

export type Screen = 'DASHBOARD' | 'COWS' | 'ADD_MILK' | 'REMINDERS' | 'REPORTS' | 'QR_SCANNER' | 'SETTINGS';
