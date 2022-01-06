const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

exports.passwordCheck = functions.https.onRequest((req, res) => {
    const { uid, name, password } = req.body;

    // refs to room with given args
    const nameRef = admin.firestore()
        .collection('rooms').where("name", "==", name);
    const uidRef = nameRef.where("creator_uid", "==", uid);
    const passwordRef = uidRef.where("password", "==", password);

    passwordRef.get().then((doc) => {
        const rooms = doc.docs.map((docx) => { return docx.id })
        // ref to room_members list in requested room
        const room_members = admin.firestore().collection('rooms').doc(rooms[0]).collection('room_members');
        const is_member = room_members.where("user_uid", "==", uid);

        is_member.get().then((member) => {
            //pass (found user)
        }).catch(err => {
            // not found member in member list so add him
            room_members.add({
                user_uid: uid,
            })
        })
        // Success status
        res.status(200).end();
    }).catch(err => {
        // not found resurces (wrong password)
        res.status(400).end();
    });
});

/* Example request for that function

curl -X POST https://us-central1-test-36302.cloudfunctions.net/test
   -H 'Content-Type: application/json'
   -d '{"name":"xxxa","uid": "B2Xidd3Vw1PL9Kyt5ERFXCjniuF3",
    "password": "xxxx"}'

*/


exports.rooms = functions.https.onRequest((req, res) => {
    const { uid, name, password } = req.body;

    // refs to room with given args
    const nameRef = admin.firestore()
        .collection('rooms').where("creator_uid", "==", uid);

    nameRef.get().then((doc) => {
        if (doc) {
            const rooms = doc.docs.map((docx) => { return docx.data() });
            res.json(rooms);
            // Success status
            res.status(200).end();
        }
        else {
            // not found resurces (wrong password)
            res.json([]);
            res.status(400).end();
        }
    }).catch(err => {
        //Internal server error
        res.status(500).end();
    });
});

/* Example request for that function

curl -X POST https://us-central1-test-36302.cloudfunctions.net/test
   -H 'Content-Type: application/json'
   -d '{"name":"xxxa","uid": "B2Xidd3Vw1PL9Kyt5ERFXCjniuF3",
    "password": "xxxx"}'

*/