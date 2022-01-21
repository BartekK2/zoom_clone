import io from "socket.io-client"
import Peer from "simple-peer";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video style={{ width: "30%" }} playsInline autoPlay ref={ref} />
    );
}

export default function Videos({ id }) {
    const socketRef = useRef();
    const [peers, setPeers] = useState([]);
    const peersRef = useRef([]);
    const userVideo = useRef({ "srcObject": "" });
    const [roomPeers, setroomPeers] = useState([]);
    const { currentUser } = useAuth();

    const [username, setUsername] = useState("")
    const [users, setUsers] = useState([]);
    const [room, setRoom] = useState("")

    const joinRoom = () => {
        if (username !== "" && id !== "") {
            socketRef.current.emit("join_room", { "room": id });
        }
    }
    useEffect(() => {
        peersRef.current.map((peer) => peer.peer.destroy());
        peers.map((peer) => peer.peer.destroy());

        setPeers([]);
        peersRef.current = [];
    }, [id])



    useEffect(() => {
        socketRef.current = io.connect("https://zoom-clone22.herokuapp.com")

        navigator.mediaDevices.getUserMedia({
            video: {
                height: window.innerHeight / 2,
                width: window.innerWidth / 2
            }, audio: true
        }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.on("all users", data => {

                const peers = [];
                data.users.forEach(userID => {
                    if (userID !== socketRef.current.id) {
                        const peer = createPeer(userID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        peers.push({
                            peerID: userID,
                            peer,
                        });
                    }
                })
                setPeers(peers);
            })


            socketRef.current.on("user disconnected", (data) => {
                const peerObj = peersRef.current.find(p => p.peerID === data.id);
                console.log(data.id);

                if (peerObj)
                    peerObj.peer.destroy();

                const peers2 = peersRef.current.filter(p => p.peerID !== data.id);
                peersRef.current.filter(p => p.peerID === data.id).map((peer) => peer.peer.destroy());
                peersRef.current = peers2;

                setPeers(peers2);
                console.log("DZIAŁA?", peers);

            });

            socketRef.current.on("user joined", payload => {
                if (peersRef.current.map(data => data.peerID).includes(payload.callerID)) {
                    // console.log("tried to add same peer")
                } else {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })

                    const peerObj = {
                        peer,
                        roomID: id,
                        peerID: payload.callerID
                    }
                    setPeers(users => [...users, peerObj]);
                }
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })


    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })



        peer.on('error', (err) => {
            const peerObj = peersRef.current.find(p => p.peer === peer);
            if (peerObj)
                peerObj.peer.destroy();

            const peers = peersRef.current.filter(p => p.peer !== peer);
            peersRef.current = peers;
            setPeers(peers);
        });

        peer.on('close', function () {
            const peerObj = peersRef.current.find(p => p.peer === peer);
            if (peerObj)
                peerObj.peer.destroy();

            const peers = peersRef.current.filter(p => p.peer !== peer);
            peersRef.current = peers;
            setPeers(peers);
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    const showEverything = () => {
        console.log(peers);
        console.log(peersRef);
        console.log(id);
        console.info(roomPeers);
        setroomPeers(peers.filter((peer) => id == peer.roomID));

    }

    useEffect(() => {
        setroomPeers(peers.filter((peer) => id == peer.roomID));
    }, [peers, peersRef])

    return (
        <>
            <h3>Dołącz do chatu</h3>
            <input type="text" placeholder="" onChange={(event) => { setUsername(event.target.value) }} />
            <input type="text" placeholder="Room ID..." onChange={(event) => { setRoom(event.target.value) }} />
            <button onClick={joinRoom}>Dołącz do pokoju</button>
            <button onClick={showEverything}>Poka</button>
            <div>
                <video muted style={{ "width": "30%" }} ref={userVideo} autoPlay playsInline />

                {peers.map((peer, index) => {
                    return (
                        <>
                            <Video key={index} peer={peer} />
                            <p>{peer.peerID}</p>
                        </>
                    );
                })}
            </div>
        </>
    )
}
