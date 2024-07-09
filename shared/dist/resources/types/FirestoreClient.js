"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const firestore_1 = require("@firebase/firestore");
const ClientActions_1 = require("../../utils/Firestore/ClientActions");
const firestore_2 = require("firebase-admin/firestore");
var Client;
(function (Client) {
    const COLLECTIONS = {
        User: "user",
        Message: "message",
        Room: "room",
    };
    function createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = data;
            const test = yield (0, ClientActions_1._create)({ name }, COLLECTIONS.User);
        });
    }
    Client.createUser = createUser;
    function getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ClientActions_1._get)(id, COLLECTIONS.User);
        });
    }
    Client.getUser = getUser;
    function createRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, judgeCount, creatorRef, oppositeRef } = data;
            const res = yield (0, ClientActions_1._create)({
                status,
                judgeCount,
                creatorRef,
                oppositeRef,
            }, COLLECTIONS.Room);
        });
    }
    Client.createRoom = createRoom;
    function getRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ClientActions_1._get)(id, COLLECTIONS.Room);
        });
    }
    Client.getRoom = getRoom;
    function createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, roomRef, content } = data;
            const res = yield (0, ClientActions_1._create)({
                user,
                roomRef,
                content,
            }, COLLECTIONS.Message);
        });
    }
    Client.createMessage = createMessage;
    function getMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ClientActions_1._get)(id, COLLECTIONS.Message);
        });
    }
    Client.getMessage = getMessage;
    function listenMessages(roomId, startUpdatedAt, onChange) {
        return (0, ClientActions_1._listenList)(COLLECTIONS.Message, ({ change, current }) => {
            onChange({ change, current });
        }, [
            (0, firestore_1.where)("roomRef", "==", roomId),
            (0, firestore_1.where)("updatedAt", ">", firestore_2.Timestamp.fromDate(startUpdatedAt)),
        ]);
    }
    Client.listenMessages = listenMessages;
})(Client || (exports.Client = Client = {}));
//# sourceMappingURL=FirestoreClient.js.map