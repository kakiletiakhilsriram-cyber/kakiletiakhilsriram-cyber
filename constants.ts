
import { User, Role, Cow, Gender, MilkRecord } from './types';

export const USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@farm.com', role: Role.Admin },
  { id: 'u2', name: 'Staff User', email: 'staff@farm.com', role: Role.Staff },
];

export const COWS: Cow[] = [
  {
    id: 'c1',
    name: 'Daisy',
    tagId: 'FARM001',
    gender: Gender.Female,
    breed: 'Holstein-Friesian',
    birthDate: '2019-03-15',
    imageUrl: 'https://picsum.photos/seed/daisy/400/300',
    healthStatus: 'Healthy',
    vaccinations: [{ name: 'BVD', date: '2023-11-01', nextDueDate: '2024-11-01' }],
    pregnancy: { isPregnant: true, lastBredDate: '2024-05-10', dueDate: '2025-02-14' },
    notes: 'High milk producer. Prefers grazing in the west pasture.',
    expectedYield: 30,
  },
  {
    id: 'c2',
    name: 'Bessie',
    tagId: 'FARM002',
    gender: Gender.Female,
    breed: 'Jersey',
    birthDate: '2020-07-22',
    imageUrl: 'https://picsum.photos/seed/bessie/400/300',
    healthStatus: 'Healthy',
    vaccinations: [{ name: 'IBR', date: '2024-01-15', nextDueDate: '2025-01-15' }],
    pregnancy: { isPregnant: false },
    notes: 'Calm temperament. Responds well to automated milking.',
    expectedYield: 25,
  },
  {
    id: 'c3',
    name: 'Buttercup',
    tagId: 'FARM003',
    gender: Gender.Female,
    breed: 'Guernsey',
    birthDate: '2018-05-30',
    imageUrl: 'https://picsum.photos/seed/buttercup/400/300',
    healthStatus: 'Under Observation',
    vaccinations: [{ name: 'BVD', date: '2023-10-20', nextDueDate: '2024-10-20' }],
    pregnancy: { isPregnant: true, lastBredDate: '2024-06-01', dueDate: '2025-03-08' },
    notes: 'Slight limp on front left leg noted this morning.',
    expectedYield: 28,
  },
    {
    id: 'c4',
    name: 'Spike',
    tagId: 'FARM004',
    gender: Gender.Male,
    breed: 'Angus',
    birthDate: '2021-01-10',
    imageUrl: 'https://picsum.photos/seed/spike/400/300',
    healthStatus: 'Healthy',
    vaccinations: [{ name: 'Clostridial', date: '2024-03-01', nextDueDate: '2025-03-01' }],
    pregnancy: { isPregnant: false },
    notes: 'Breeding bull.',
    expectedYield: 0,
  },
  {
    id: 'c5',
    name: 'Lily',
    tagId: 'FARM005',
    gender: Gender.Female,
    breed: 'Ayrshire',
    birthDate: '2021-11-05',
    imageUrl: 'https://picsum.photos/seed/lily/400/300',
    healthStatus: 'Healthy',
    vaccinations: [{ name: 'BVD', date: '2024-02-10', nextDueDate: '2025-02-10' }],
    pregnancy: { isPregnant: false },
    notes: 'First-time mother, very protective of her calf.',
    expectedYield: 22,
  },
];

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const MILK_RECORDS: MilkRecord[] = [
  // Today's records
  { cowId: 'c1', date: formatDate(today), amount: 31 },
  { cowId: 'c2', date: formatDate(today), amount: 24 },
  { cowId: 'c3', date: formatDate(today), amount: 26 },
  { cowId: 'c5', date: formatDate(today), amount: 23 },
  // Yesterday's records
  { cowId: 'c1', date: formatDate(new Date(today.setDate(today.getDate() - 1))), amount: 30 },
  { cowId: 'c2', date: formatDate(new Date(today)), amount: 25 },
  { cowId: 'c3', date: formatDate(new Date(today)), amount: 28 },
  { cowId: 'c5', date: formatDate(new Date(today)), amount: 22 },
  // Two days ago
  { cowId: 'c1', date: formatDate(new Date(today.setDate(today.getDate() - 1))), amount: 32 },
  { cowId: 'c2', date: formatDate(new Date(today)), amount: 26 },
  { cowId: 'c3', date: formatDate(new Date(today)), amount: 27 },
  { cowId: 'c5', date: formatDate(new Date(today)), amount: 21 },
].filter(record => new Date(record.date) <= new Date()); // Ensure no future dates
