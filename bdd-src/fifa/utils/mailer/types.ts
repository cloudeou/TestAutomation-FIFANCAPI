export interface ILetter {
  id: string;
  userId: string;
  inboxId: string;
  body: string;
  from: string;
  to: string[];
  subject: string;
  createdAt: string;
  sender: {
    rawValue: string;
    emailAddress: string;
    name: string;
  };
  recipients: {
    to: string[];
    cc: string[];
  };
}

export interface ITestEmail {
  inboxId: string;
  emailAddress: string;
}
