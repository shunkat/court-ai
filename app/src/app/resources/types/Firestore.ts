export type AppModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Department = {
  name: string;
} & AppModel;

export type Lawyer = {
  name: string;
  departmentIds: string[];
} & AppModel;

export type User = {
  id: string; // auth.uid
} & AppModel;

export type RoomUser = {
  userId: string;
  name: string;
} & AppModel;

export type RoomStatus = "created" | "judge" | "completed";
export type Room = {
  name: string;
  category?: string;
  status: RoomStatus;
  judgeCount: 0 | 1 | 2 | 3;
  creatorId: string; // RoomUser
  oppositeId?: string; // RoomUser
} & AppModel;

export type TextMessage = {
  text: string;
}[];

const MessageRole = ["user", "system", "model", "tool"] as const;
// コレクション名: chats
export type Chat = Claim | LawyerResponse;
export type Claim = {
  roomId: string;
  roomUserId: string;
  content: TextMessage;
  role: "user";
} & AppModel;

export type LawyerResponse = {
  roomId: string;
  roomUserId: string;
  content: TextMessage;
  role: "model";
} & AppModel;

// 裁判結果要約ページに表示するデータ
export type JudgmentSummary = {
  roomId: string;
  judgeCount: number;
  mainSentence: string;
  judgeReasons: {
    reasonTitle: string;
    reasonDetail: string[];
  };
  futureDevelopments: string;
  homeworks: {
    plaintiff: string[];
    defendant: string[];
  };
} & AppModel;