export type AdvisoryType = 'PFZ' | 'OSF';
export type AdvisorySeverity = 'low' | 'medium' | 'high';

export interface Advisory {
  id: string;
  type: AdvisoryType;
  title: string;
  description: string;
  location: string;
  date: string;
  citation: string;
  severity: AdvisorySeverity;
}
