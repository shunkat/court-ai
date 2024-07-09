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
const firestore_1 = require("@firebase/firestore");
function _create(data, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = (0, firestore_1.doc)((0, firestore_1.getFirestore)(), collection);
        yield (0, firestore_1.runTransaction)((0, firestore_1.getFirestore)(), (transaction) => __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield transaction.get(document);
            if (snapshot.exists())
                throw new Error("Document already exists");
            transaction.set(document, Object.assign(Object.assign({}, data), { createdAt: (0, firestore_1.serverTimestamp)(), updatedAt: (0, firestore_1.serverTimestamp)() }));
        }));
        const snapshot = (yield (0, firestore_1.getDoc)(document));
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
        const document = (0, firestore_1.doc)((0, firestore_1.getFirestore)(), collection, data.id);
        yield (0, firestore_1.runTransaction)((0, firestore_1.getFirestore)(), (transaction) => __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield transaction.get(document);
            if (!snapshot.exists())
                throw new Error("Document not exists");
            transaction.set(document, Object.assign(Object.assign({}, data), { updatedAt: (0, firestore_1.serverTimestamp)() }));
        }));
        const snapshot = (yield (0, firestore_1.getDoc)(document));
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
        const document = (0, firestore_1.doc)((0, firestore_1.getFirestore)(), collection, id);
        yield (0, firestore_1.runTransaction)((0, firestore_1.getFirestore)(), (transaction) => __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield transaction.get(document);
            if (!snapshot.exists())
                throw new Error("Document not exists");
            transaction.delete(document);
        }));
    });
}
exports._delete = _delete;
function _get(id, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = (0, firestore_1.doc)((0, firestore_1.getFirestore)(), collection, id);
        const snapshot = (yield (0, firestore_1.getDoc)(document));
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
function _getList(collectionName, query) {
    return __awaiter(this, void 0, void 0, function* () {
        let _query;
        if (query) {
            if (Array.isArray(query)) {
                _query = (0, firestore_1.query)((0, firestore_1.collection)((0, firestore_1.getFirestore)(), collectionName), ...query);
            }
            else {
                _query = (0, firestore_1.query)((0, firestore_1.collection)((0, firestore_1.getFirestore)(), collectionName), query);
            }
        }
        else {
            _query = (0, firestore_1.collection)((0, firestore_1.getFirestore)(), collectionName);
        }
        const snapshot = yield (0, firestore_1.getDocs)(_query);
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
    const document = (0, firestore_1.doc)((0, firestore_1.getFirestore)(), collectionPath, id);
    return (0, firestore_1.onSnapshot)(document, (snapshot) => {
        if (!snapshot.exists()) {
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
function _listenList(collectionPath, onChange, query) {
    const col = (0, firestore_1.collection)((0, firestore_1.getFirestore)(), collectionPath);
    let _query;
    if (query) {
        if (Array.isArray(query)) {
            _query = (0, firestore_1.query)(col, ...query);
        }
        else {
            _query = (0, firestore_1.query)(col, query);
        }
    }
    else {
        _query = (0, firestore_1.collection)((0, firestore_1.getFirestore)(), collectionPath);
    }
    return (0, firestore_1.onSnapshot)(_query, (snapshot) => {
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
//# sourceMappingURL=ClientActions.js.map