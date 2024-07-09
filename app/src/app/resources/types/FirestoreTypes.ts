type CommonData = {
  createdAt: Date;
  updatedAt: Date;
};

export type Department = {
  name: string;
} & CommonData;

export type Lawyer = {
  name: string;
  departmentIds: string[];
} & CommonData;

export type User = {
  name: string;
} & CommonData;

export type RoomStatus = "created" | "wip" | "judge" | "completed";
export type Room = {
  status: RoomStatus;
  judgeCount: 0 | 1 | 2 | 3;
  creatorId: string;
  oppositeId: string;
} & CommonData;

export type TextMessage = {
  type: "text";
  value: string;
};

export type Message = {
  from:
    | {
        type: "user";
        id: string;
      }
    | {
        type: "lawyer";
        id: string;
        for: string;
      }
    | {
        type: "judge";
      };
  roomId: string;
  content: TextMessage;
} & CommonData;
