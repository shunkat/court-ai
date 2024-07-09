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
exports.Admin = void 0;
const firestore_1 = require("firebase-admin/firestore");
const AdminActions_1 = require("../../utils/Firestore/AdminActions");
var Admin;
(function (Admin) {
    const COLLECTIONS = {
        User: "user",
        Message: "message",
        Room: "room",
    };
    function createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = data;
            return yield (0, AdminActions_1._create)({ name }, COLLECTIONS.User);
        });
    }
    Admin.createUser = createUser;
    function getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, AdminActions_1._get)(id, COLLECTIONS.User);
        });
    }
    Admin.getUser = getUser;
    function createRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, judgeCount, creatorRef, oppositeRef } = data;
            return yield (0, AdminActions_1._create)({
                status,
                judgeCount,
                creatorRef,
                oppositeRef,
            }, COLLECTIONS.Room);
        });
    }
    Admin.createRoom = createRoom;
    function getRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, AdminActions_1._get)(id, COLLECTIONS.Room);
        });
    }
    Admin.getRoom = getRoom;
    function createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, roomRef, content } = data;
            const res = yield (0, AdminActions_1._create)({
                user,
                roomRef,
                content,
            }, COLLECTIONS.Message);
        });
    }
    Admin.createMessage = createMessage;
    function getMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, AdminActions_1._get)(id, COLLECTIONS.Message);
        });
    }
    Admin.getMessage = getMessage;
    function listenMessages(roomId, onChange) {
        const roomRef = (0, firestore_1.getFirestore)().doc(`${COLLECTIONS.Room}/${roomId}`);
        return (0, AdminActions_1._listenList)((0, firestore_1.getFirestore)()
            .collection(COLLECTIONS.Message)
            .where("roomRef", "==", roomRef), ({ change, current }) => {
            onChange({ change, current });
        });
    }
    Admin.listenMessages = listenMessages;
})(Admin || (exports.Admin = Admin = {}));
//# sourceMappingURL=FirestoreAdmin.js.map