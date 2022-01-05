import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useRouter } from "next/router"
import RoomTab from './components/RoomTab';

function dashboard() {
    const { currentUser, getRooms, addRoom } = useAuth();
    const [loading, setloading] = useState(false);
    const router = useRouter();
    const [password, setpassword] = useState("");
    const [secured, setsecured] = useState(false)
    const [name, setname] = useState("")
    const [rooms, setrooms] = useState([])

    useEffect(() => {
        if (!currentUser) {
            router.push("/sign")
        }
        else {
            setloading(true);
        }
    }, [currentUser])

    const updateRooms = async () => {
        let x = await getRooms(currentUser.uid);
        setrooms(x);
    }

    useEffect(() => {
        updateRooms();
    }, [currentUser])

    return (
        <>
            {loading &&

                <div style={{ display: 'flex', flex: '1 1 auto' }}> {/*borderTop: "solid 5px black"  */}
                    <div className="rooms_tab">

                        <Button variant='contained'>Create room +</Button>
                        <Button variant='contained'>Join room</Button>

                        {rooms.map((element, id) => {
                            return (<RoomTab props={element} id={id}>{element.name}</RoomTab>)
                        })}
                    </div>

                    {/* create rooms or room*/}
                    <div style={{ width: "70%", display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
                        <TextField required label="Name" onChange={(e) => setname(e.target.value)} />
                        {secured && <TextField required label="Password" onChange={(e) => setpassword(e.target.value)} />}
                        <FormControlLabel
                            control={
                                <Checkbox sx={{ padding: '0' }} onChange={(e) => setsecured(e.target.checked)} />
                            }
                            label="Password secured room"
                            labelPlacement="top"
                        />
                        <Button variant="contained" onClick={async (e) => {
                            await addRoom(e, currentUser.uid, name, secured, password);
                            updateRooms();
                        }}>Add +</Button>
                    </div>

                </div>
            }
        </>
    )
}

export default dashboard
