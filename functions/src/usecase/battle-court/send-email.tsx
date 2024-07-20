
import { Resend } from 'resend';
import { appUrl, resendApiKey } from '../../env';
import React from 'react';
import { CourtFinishedEmail } from './email';
import { getAuth } from 'firebase-admin/auth';
import { getRoomUser } from '../../firestore/room-user';

type Props = {
  roomId: string
  title: string
  plaintiffId: string
  defendantId: string
}

export const sendEmail = async ({ roomId, title, plaintiffId, defendantId }: Props) => {
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
      from: 'Themis <no-reply@resend.dev>',
      to: userInfo.email,
      subject: `🎉 Good News, ${user.name}! Your Court Has Been finished!`,
      react: <CourtFinishedEmail name={user.name} title={title} url={`${appUrl}/${roomId}/battles`} />,
    });

    if (error) {
      return console.error({ error });
    }
  }));
};

