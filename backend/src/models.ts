export type BookingType = 'trainer' | 'class';

export type BookingRecord = {
  id: string;
  type: BookingType;
  trainerOrClass: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  fullName: string;
  email: string;
  phone: string;
  goals: string;
  notes: string;
  createdAt: string;
};

export type CreateBookingInput = Partial<Omit<BookingRecord, 'id' | 'createdAt'>>;

export type MessageRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export type CreateMessageInput = Partial<Omit<MessageRecord, 'id' | 'createdAt'>>;

export type TrainerRecord = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  certifications: string;
  bio: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTrainerInput = Partial<Omit<TrainerRecord, 'id' | 'createdAt' | 'updatedAt'>>;

export type ClassRecord = {
  id: string;
  name: string;
  schedule: string;
  duration: string;
  capacity: string;
  level: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateClassInput = Partial<Omit<ClassRecord, 'id' | 'createdAt' | 'updatedAt'>>;