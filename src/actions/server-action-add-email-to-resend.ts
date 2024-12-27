"use server"
import { Resend } from 'resend';

export default async function (email: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not set.")
  }

  if (!process.env.RESEND_AUDIENCE_ID) {
    throw new Error("RESEND_AUDIENCE_ID not set.")
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId: process.env.RESEND_AUDIENCE_ID,
  });
}
