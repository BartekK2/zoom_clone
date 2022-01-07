const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors')({ origin: true });

admin.initializeApp(functions.config().firebase);

exports.passwordCheck = functions.region("europe-central2").https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { uid, password, id } = req.body;

    // refs to room with given args
    const roomRef = admin.firestore()
        .collection('rooms').doc(id)

    roomRef.get().then((doc) => {
        if (doc.data().password == password) {

            // ref to room_members list in requested room
            const room_members = admin.firestore().collection('room_members');
            const is_member = room_members.where("user_uid", "==", uid).where("room_id", "==", id);

            is_member.get().then((docs) => {
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

/* Example request for that function

curl -X POST https://us-central1-test-36302.cloudfunctions.net/passwordCheck
   -H 'Content-Type: application/json'
   -d '{"uid": "B2Xidd3Vw1PL9Kyt5ERFXCjniuF3","id":"Sjucgsyuw2723"
    "password": "xxxx"}'

*/


exports.rooms = functions.region("europe-central2").https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

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

});

/* Example request for that function

curl -X POST https://us-central1-test-36302.cloudfunctions.net/rooms
   -H 'Content-Type: application/json'
   -d '{"uid": "B2Xidd3Vw1PL9Kyt5ERFXCjniuF3"}'

// */