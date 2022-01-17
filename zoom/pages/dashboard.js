import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { Button, TextField, Checkbox, FormControlLabel, ButtonBase, FormGroup } from '@mui/material';
import { useRouter } from "next/router"
import RoomTab from './components/RoomTab';
import Videos from './components/Videos';
import JoinRoom from './components/JoinRoom';
import { flexbox } from '@mui/system';


function Dashboard() {
    const { currentUser, getRooms, addRoom, joinRoom } = useAuth();
    const [loading, setloading] = useState(false);
    const [roomsLoading, setroomsLoading] = useState(true)
    const [addloading, setAddLoading] = useState(false);
    const router = useRouter();
    const [password, setpassword] = useState("");
    const [secured, setsecured] = useState(false)
    const [name, setname] = useState("")
    const [rooms, setrooms] = useState([]);
    const [room, setroom] = useState([])


    const [mode, setMode] = useState("join_room");

    const updateRooms = async () => {
        setroomsLoading(true);
        if (currentUser)
            setrooms(await getRooms(currentUser.uid));
        setroomsLoading(false);
    }

    const createRoom = async () => {
        setAddLoading(true);
        await addRoom(currentUser.uid, name, password);
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

    useEffect(() => {
        async function update() {
            await updateRooms();
        }
        update();
        console.log(currentUser.uid)
    }, [])

    useEffect(() => {
        console.log(mode);
        if (mode === "room")
            console.log(room);
    }, [mode, room])

    return (
        <>
            {loading &&

                <div style={{ display: 'flex', flex: '1 1 auto' }}> {/*borderTop: "solid 5px black"  */}
                    <div className="rooms_tab">

                        <Button variant='contained' onClick={() => setMode("create_room")}
                        >Create room +</Button>

                        <Button variant='contained' onClick={() => setMode("join_room")}
                        >Join room</Button>

                        {roomsLoading ?
                            <p style={{ textAlign: "center" }}>Ładowanie</p>
                            :
                            rooms.length == 0 ?
                                <p>pustoo</p>
                                :
                                rooms.map((element, id) => {
                                    return (<RoomTab props={element} onClick={() => {
                                        setMode("room");
                                        setroom(element);
                                        console.log(element.id);
                                    }
                                    } key={id} >
                                        {element.name}
                                    </RoomTab>)
                                })
                        }
                    </div>

                    {/* create room*/}

                    {mode === "create_room" &&
                        <div style={{ width: "100%", display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
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

                            kiedy sie wszyscy rozlacza hash=null
                        </div>}
                    {mode === "join_room" &&
                        <JoinRoom />
                    }

                    {mode === "room" &&
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                            <div style={{ height: "10%", display: "flex", justifyContent: "space-between" }}>
                                <div></div>
                                <h2>{room.name}</h2>
                                <div></div>
                            </div>

                            <div style={{ flex: "1", borderBottom: "solid black 1px", borderTop: "solid black 1px" }}>
                                Chat... skopiuj to co już kiedyś miałeś tym razem z paginacją na scroll
                                ( Pomysły: // USUWANIE CZATU / EDYCJA - ma to sie dziac tylko na frontendzie nie ma fetchowac po zmianie //
                                // Socket.io - czat na żywo, nie fetchuj danych jedynie wysyłaj B) //
                                )
                                <Videos id={room.id} />

                            </div>
                            <div style={{
                                display: "flex", justifyContent: "center", alignItems: "center",
                                maxHeight: "20%", margin: "30px"
                            }}>

                                <div style={{ display: "flex", gap: "0" }}>
                                    <TextField sx={{ width: "80%" }}
                                        inputProps={{
                                            autoComplete: 'new-password',
                                            form: {
                                                autocomplete: 'off',
                                            },
                                        }}
                                        required label="Type sth" onChange={(e) => setname(e.target.value)} />
                                    <Button variant="contained" >Send</Button>

                                </div>


                            </div>
                        </div>}

                </div>
            }
        </>
    )
}

export default Dashboard
