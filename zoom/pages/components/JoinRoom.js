import React, { useState } from 'react'
import { TextField, Button } from '@mui/material';
import { useAuth } from '../AuthContext'

function JoinRoom() {
    const [name, setname] = useState("");
    const [password, setpassword] = useState("");
    const { joinRoom, currentUser } = useAuth();

    const [joinLoading, setJoinLoading] = useState(false);

    const joinRoomFunc = async () => {
        setJoinLoading(true);
        await joinRoom(currentUser.uid, name, password);
        setJoinLoading(false);
    }


    return (
        <div style={{ width: "100%", display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
            <TextField required label="Name" onChange={(e) => setname(e.target.value)} />
            <TextField required label="Password" onChange={(e) => setpassword(e.target.value)} />

            <Button variant="contained" disabled={joinLoading} onClick={async (e) => {
                e.preventDefault();
                await joinRoomFunc();
            }}>Join</Button>

            {joinLoading && "joining"}

        </div>
    )
}

export default JoinRoom
