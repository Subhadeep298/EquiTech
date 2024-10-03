export interface JobData {
    id: string;
    jobTitle: string;
    jobDescription: string;
    companyName: string;
    location: string;
    keySkills: string[];
    jobType: string;
    postedTime: string;
    companyInfo: string;
    hiringTrendsForWomen: string;
    companyCultureTowardsWomen: string;
    benefitsForWomen: string;
    jobPay: string;
    workMode: string;
    jobOpenings: number;
    employmentType: string;
  }

  export interface Job {
    jobTitle: string;
    companyName: string;
    location: string;
    jobPay: string;
    employmentType: string;
    postedTime: string;
  }