
import { Resend } from 'resend';
import { appUrl, resendApiKey, serviceEmail } from '../../env';
import React from 'react';
import { CourtPreparationEmail } from './email';
import { getAuth } from 'firebase-admin/auth';
import { getRoomUser } from '../../firestore/room-user';

type Props = {
  roomId: string
  battleId: string
  title: string
  plaintiffId: string
  defendantId: string
}

export const sendEmail = async ({ roomId, battleId, title, plaintiffId, defendantId }: Props) => {
  const resend = new Resend(resendApiKey.value());
  return Promise.all([plaintiffId, defendantId].map(async (roomUserId) => {
    const user = await getRoomUser(roomUserId);
    if (!user) {
      console.error('User not found:', roomUserId);
      return;
    }

    const userInfo = await getAuth().getUser(user.userId).catch((err) => {
      console.error(err);
      return;
    });

    if (!userInfo?.email) return;

    const { error } = await resend.emails.send({
      from: `Themis <${serviceEmail.value()}>`,
      to: userInfo.email,
      subject: `🚀 Your Court Case is Ready, "${title}"`,
      react: <CourtPreparationEmail name={user.name} title={title} url={`${appUrl.value()}/room/${roomId}/battle/${battleId}`} />,
    });

    if (error) {
      return console.error({ error });
    }
  }));
};

