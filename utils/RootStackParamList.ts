// RootStackParamList.ts
export type RootStackParamList = {
    Main: undefined;
    Drawer: undefined; // Represents the Drawer Navigator
    SignIn: undefined;
    SignUp: undefined;
    Home: undefined;
    JobDetails: { job: Job }; // Expecting a job object

};

export interface Job {
    jobTitle: string;
    companyName: string;
    location: string;
    jobPay: string;
    employmentType: string;
    postedTime: string;
  }

// DrawerParamList.ts
export type DrawerParamList = {
    Home: undefined;
    SignIn: undefined;
    SignUp: undefined;
};
