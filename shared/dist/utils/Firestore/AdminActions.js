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
exports._listenList = exports._listen = exports._getList = exports._get = exports._delete = exports._update = exports._create = void 0;
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
function _create(data, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        db.doc(collection);
        const document = db.doc(collection);
        yield db.runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield transaction.get(document);
            if (snapshot.exists)
                throw new Error("Document already exists");
            transaction.set(document, Object.assign(Object.assign({}, data), { createdAt: firestore_1.FieldValue.serverTimestamp(), updatedAt: firestore_1.FieldValue.serverTimestamp() }));
        }));
        const snapshot = (yield document.get());
        const resData = snapshot.data();
        return {
            id: document.id,
            snapshot: snapshot,
            data: resData,
            createdAt: resData.createdAt.toDate(),
            updatedAt: resData.updatedAt.toDate(),
        };
    });
}
exports._create = _create;
function _update(data, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = db.doc(`${collection}/${data.id}`);
        yield db.runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield transaction.get(document);
            if (!snapshot.exists)
                throw new Error("Document not exists");
            transaction.set(document, Object.assign(Object.assign({}, data), { updatedAt: firestore_1.FieldValue.serverTimestamp() }));
        }));
        const snapshot = (yield document.get());
        const resData = snapshot.data();
        return {
            id: document.id,
            snapshot: snapshot,
            data: resData,
            createdAt: resData.createdAt.toDate(),
            updatedAt: resData.updatedAt.toDate(),
        };
    });
}
exports._update = _update;
function _delete(id, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = db.doc(`${collection}/${id}`);
        yield db.runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield transaction.get(document);
            if (!snapshot.exists)
                throw new Error("Document not exists");
            transaction.delete(document);
        }));
    });
}
exports._delete = _delete;
function _get(id, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = db.doc(`${collection}/${id}`);
        const snapshot = (yield document.get());
        const data = snapshot.data();
        return {
            id: document.id,
            snapshot: snapshot,
            data: data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    });
}
exports._get = _get;
function _getList(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const snapshot = yield query.get();
        return snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                snapshot: doc,
                data: doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt.toDate(),
            };
        });
    });
}
exports._getList = _getList;
function _listen(id, collectionPath, onChange) {
    const document = db.doc(`${collectionPath}/${id}`);
    document.onSnapshot((snapshot) => {
        if (!snapshot.exists) {
            return undefined;
        }
        onChange({
            id: snapshot.id,
            snapshot: snapshot,
            data: snapshot.data(),
            createdAt: snapshot.data().createdAt.toDate(),
            updatedAt: snapshot.data().updatedAt.toDate(),
        });
    });
}
exports._listen = _listen;
function _listenList(query, onChange) {
    return query.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((_change) => {
            const change = {
                id: _change.doc.id,
                snapshot: _change.doc,
                data: _change.doc.data(),
                createdAt: _change.doc.data().createdAt.toDate(),
                updatedAt: _change.doc.data().updatedAt.toDate(),
            };
            const docs = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    snapshot: doc,
                    data: doc.data(),
                    createdAt: doc.data().createdAt.toDate(),
                    updatedAt: doc.data().updatedAt.toDate(),
                };
            });
            onChange({ change: change, current: docs });
        });
    });
}
exports._listenList = _listenList;
//# sourceMappingURL=AdminActions.js.map