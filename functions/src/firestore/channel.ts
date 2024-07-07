import { db } from '../config';
import { ChannelSchema, channelSchema } from './schema';

export const getChannel = async (channelId: string): Promise<ChannelSchema | undefined> => {
  const data = (await db.doc(`channels/${channelId}`).get()).data();
  const parsed = channelSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Invalid channel data:', parsed.error.errors);
    return undefined;
  }
  return parsed.data;
};
