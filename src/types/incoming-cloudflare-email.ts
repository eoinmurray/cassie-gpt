
export interface Contact {
  address: string;
  name: string;
}

export interface Attachment {
  filename: string;
  mimeType: string;
  disposition: string;
  related: boolean;
  contentId: string;
  content: ArrayBuffer
}

export type IncomingCloudflareEmail = {
  from: Contact;
  to: Contact[];
  bcc?: Contact[];
  cc?: Contact[];
  attachments?: Attachment[];
  headers: any[];
  subject: string;
  messageId: string;
  date: string;
  text: string;
  html: string;
};

