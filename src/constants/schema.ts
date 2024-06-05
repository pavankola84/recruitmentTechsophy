export interface JobFormData {
  jobId: string;
  employmentType: string;
  jobTitle: string;
  experience: string;
  country: string;
  city: string[];
  package: string;
  description: string;
  department: string;
  aboutCompany: string;
  clientName: string;
  education: string[];
  keySkills: string[];
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  __v: number;
  openings: number;
}

export interface Clients {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  clientLocation: string[];
  updatedById: string;
  createdById: string;
  __v: number;
}

export interface Departments {
  _id: string;
  departmentName: string;
  updatedById: string;
  createdById: string;
  __v: number;
}