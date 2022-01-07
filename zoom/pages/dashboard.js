import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useRouter } from "next/router"
import RoomTab from './components/RoomTab';

function dashboard() {
    const { currentUser, getRooms, addRoom } = useAuth();
    const [loading, setloading] = useState(false);
    const [roomsLoading, setroomsLoading] = useState(true)
    const [addloading, setAddLoading] = useState(false);
    const router = useRouter();
    const [password, setpassword] = useState("");
    const [secured, setsecured] = useState(false)
    const [name, setname] = useState("")
    const [rooms, setrooms] = useState([])

    const updateRooms = async () => {
        setroomsLoading(true);
        setrooms(await getRooms(currentUser.uid));
        console.log(rooms)
        setroomsLoading(false);
    }

    const createRoom = async () => {
        setAddLoading(true);
        await addRoom(currentUser.uid, name, secured, password);
        setAddLoading(false);
    }

    useEffect(() => {
        if (!currentUser) {
            router.push("/sign")
        }
        else {
            setloading(true);
        }
    }, [currentUser])

    useEffect(async () => {
        await updateRooms();
    }, [])

    return (
        <>
            {loading &&

                <div style={{ display: 'flex', flex: '1 1 auto' }}> {/*borderTop: "solid 5px black"  */}
                    <div className="rooms_tab">

                        <Button variant='contained'>Create room +</Button>
                        <Button variant='contained'>Join room</Button>
                        {roomsLoading ?
                            <p style={{ textAlign: "center" }}>Ładowanie</p>
                            :
                            rooms.map((element, id) => {
                                return (<RoomTab props={element} id={id}>{element.name}</RoomTab>)
                            })
                        }
                    </div>

                    {/* create room*/}
                    <div style={{ width: "-webkit-fill-available", display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
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
                            e.preventDefault();
                            await createRoom();
                            await updateRooms();
                        }}>Add +</Button>
                        {addloading && <p>Ładowanie</p>}

                        funkcja ktora sprawdza czy hasla sa ok i przypisuje uzytkownika do roomu

                        funkcja ktora pobiera pokoje

                        funkcja ktora generuje jednorazowy hash przy tworzeniu video chatu

                        funkcja ktora sprawdza czy uzytkownik jest w pokoju i zwraca mu hash jesli istnieje

                        kiedy sie wszyscy rozlacza hash=""
                    </div>

                </div>
            }
        </>
    )
}

export default dashboard
