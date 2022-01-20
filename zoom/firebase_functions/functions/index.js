const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors')({ origin: true });
var crypto = require('crypto');
const e = require("express");
const { FieldValue } = require("firebase/firestore");

admin.initializeApp(functions.config().firebase);

exports.joinroom = functions.region("europe-central2").https.onRequest((req, res) => {
    cors(req, res, () => {
        const { uid, password, name } = req.body;

        // refs to room with given args
        const roomRef = admin.firestore()
            .collection('rooms').where("name", "==", name)

        roomRef.get().then((data) => {

            // because there could be only one document with same name
            const thatRoom = data.docs[0];
            if (thatRoom.data().password == password) {
                const id = thatRoom.id;

                // ref to room_members list in requested room
                const room_members = admin.firestore().collection('room_members');
                const is_member = room_members.where("user_uid", "==", uid).where("room_id", "==", id);

                is_member.get().then((docs) => {
                    // if already is one of the user dont add him second time
                    if (docs.docs.length == 0) {
                        room_members.add({
                            user_uid: uid,
                            room_id: id,
                        }).then(() => {
                            res.status(200).end();
                        })
                    }
                }).catch(err => {
                    // user already in members
                });
                // Success status
            }
            else {
                // wrong password
                res.status(400).end();
            }

        }).catch(err => {
            // not found room
            res.status(404).end();
        });
    });
});

/* Example request for that function

curl -X POST https://europe-central2-test-36302.cloudfunctions.net/passwordCheck
   -H 'Content-Type: application/json'
   -d '{"uid": "B2Xidd3Vw1PL9Kyt5ERFXCjniuF3","id":"Sjucgsyuw2723"
    "password": "xxxx"}'

*/


exports.rooms = functions.region("europe-central2").https.onRequest((req, res) => {
    cors(req, res, () => {
        const { uid } = req.body;

        // refs to rooms members list objects with given user id
        const membersRef = admin.firestore()
            .collection('room_members').where("user_uid", "==", uid);

        membersRef.get().then((doc) => {
            if (doc) {
                // get all ids of rooms that user is in
                const rooms_ids = doc.docs.map((docx) => { return docx.data().room_id });

                // get all datas from that rooms
                const roomsrefs = rooms_ids.map(id => admin.firestore().collection("rooms").doc(id));
                admin.firestore().getAll(...roomsrefs).then((rooms) => {
                    res.json(rooms.map(room =>
                        Object.assign({}, { "id": room.id }, room.data())))
                    res.status(200).end();
                })
            }
            else {
                // not found resurces
                res.json([]);
                res.status(401).end();
            }
        }).catch(err => {
            //Internal server error
            res.status(500).end();
        });

    })
});

/* Example request for that function

curl -X POST https://europe-central2-test-36302.cloudfunctions.net/rooms
   -H 'Content-Type: application/json'
   -d '{"uid": "B2Xidd3Vw1PL9Kyt5ERFXCjniuF3"}'

// */

exports.addRoom = functions.region("europe-central2").https.onRequest((req, res) => {

    const { name, uid, password } = req.body;

    cors(req, res, () => {
        const roomsRef = admin.firestore().collection("rooms");
        const roomref = admin.firestore().collection("rooms").where("name", "==", name);

        roomref.get().then((docs) => {
            // there could be only one document with given name
            if (docs.size === 0) {
                roomsRef.add({
                    "name": name,
                    "creator_uid": uid,
                    "password": password,
                }).then((doc) => {
                    const room_members = admin.firestore().collection('room_members');
                    room_members.add({
                        user_uid: uid,
                        room_id: doc.id,
                    }).then(() => {
                        res.status(200).end();
                    })
                })
            }
            else {
                res.status(300).end();
            }
        }).catch(err => { res.status(500).end() });

    });

});


exports.startVideoCall = functions.region("europe-central2").https.onRequest((req, res) => {
    const { id, uid } = req.body;

    const roomref = admin.firestore().collection("rooms").doc(id);
    const hashRef = admin.firestore().collection("hashes").doc(id);

    cors(req, res, () => {
        roomref.get().then((roomDoc) => {
            hashRef.get().then((hashDoc) => {
                // if call not started already
                if (!hashDoc.exists) {
                    // if is only restricted to start for creators
                    if (roomDoc.data().is_secured) {
                        // if request is sent from creator
                        if (uid == roomDoc.data().creator_uid) {
                            hashRef.get().then((x) => {
                                hashRef.set({ "hash": crypto.createHash('md5').update(id).digest('hex') }).then(() => res.status(200).end());
                            })
                        }
                        else {
                            res.status(400).end();
                        }
                    }
                    else {
                        // if not resticted to creators
                        hashRef.set({ "hash": crypto.createHash('md5').update(id).digest('hex') }).then(() => res.status(200).end());
                    }
                }
                else
                    res.status(300).end();
            })
        }).catch(err => res.status(400).end());
    })
})

// that will be used by socket.io server or in creator restricted calls by creator
exports.endVideoCall = functions.region("europe-central2").https.onRequest((req, res) => {
    cors(req, res, () => {
        const { id, secureKey, uid } = req.body;

        const roomref = admin.firestore().collection("rooms").doc(id);
        const hashRef = admin.firestore().collection("hashes").doc(id);

        roomref.get((doc) => {
            // if requested from creator
            if (uid) {
                if (doc.data().creator_uid == uid) {
                    hashRef.delete().then((e) => res.status(200).end())
                        .catch((err) => res.status(400));
                }
            }
            else {
                // in case if someone wanted to close someones calls that seem to stupid way to protect them against that but who cares XD
                if (secureKey === "XD") {
                    hashRef.delete().then((e) => res.status(200).end())
                        .catch((err) => res.status(400));
                } else {
                    res.status(400);
                }
            }
        })
    })
})


exports.listUsers = functions.region("europe-central2").https.onRequest((req, res) => {
    cors(req, res, () => {
        const membersRef = admin.firestore()
            .collection('room_members').where("user_uid", "==", uid);

        membersRef.get().then((docs) => {
            res.json(docs.docs.map((doc) => doc.data())).end();
        }).catch((err) => res.status(400).end());
    })
})

exports.messages = functions.region("europe-central2").https.onRequest((req, res) => {
    const { room_id, from, to } = req.body;
    cors(req, res, () => {
        const messagesRef = admin.firestore().collection("messages").doc(room_id).collection("messages").orderBy("createdAt").limit(20);
        messagesRef.get().then((docs) => {
            res.json(docs.docs.map((doc) => doc.data()))
            res.status(200).end();
        }).catch(err => res.status(400));
    })
})

exports.addMessage = functions.region("europe-central2").https.onRequest((req, res) => {
    const { message, uid, room_id } = req.body;
    cors(req, res, () => {
        const messagesRef = admin.firestore().collection("messages").doc(room_id).collection("messages");

        messagesRef.add({
            "message": message,
            "creator": uid,
            "createdAt": admin.firestore.FieldValue.serverTimestamp()
        }).then(res.status(200).end()).catch((err) => res.status(400).end())
    })
})