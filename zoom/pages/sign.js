import React, { useState, useEffect } from 'react'
import {
    TextField, Button, ButtonGroup, Alert,
    Accordion, AccordionSummary, AccordionDetails
} from "@mui/material/"


import { useRouter } from 'next/router'

// Firebase
import { useAuth } from './AuthContext'


function Sign() {
    // getting form mode from url
    const [mode, setmode] = useState("login");
    const router = useRouter()
    const { urlmode } = router.query

    useEffect(() => {
        if (urlmode != "") {
            if ((urlmode == "login") || (urlmode == "registration"))
                setmode(urlmode);
        }
    }, [router, urlmode])

    // changing form mode to login or registration
    const [accordion, setaccordion] = useState(true)
    const changemode = (changed_mode) => {
        if (changed_mode === mode) {
            setaccordion(false);
            const timeout = setTimeout(() => {
                setmode(mode === "login" ? "registration" : "login")
                setaccordion(true);
            }, 750);
        }
    }

    // Firebase
    const { signin, signup, currentUser } = useAuth();
    const [login, setlogin] = useState("");
    const [password, setpassword] = useState("");
    const [password2, setpassword2] = useState("");
    const [error, setError] = useState("")
    const [loading, setLoading] = useState("")

    const [userloading, setuserloading] = useState(false);

    useEffect(() => {
        if (currentUser)
            router.push("/dashboard")
        else {
            setuserloading(true);
        }
    }, [currentUser])

    async function handleLogin(e) {
        e.preventDefault()
        try {
            setLoading(true)
            await signin(login, password)
        } catch (e) {
            setError({
                "auth/wrong-password": "Wrong password",
                "auth/user-not-found": "User doesn't exist",
                "auth/invalid-email": "Invalid email entered.",
                //dodaj reszte ...
            }[e.code])
            console.log(e.code, e);
            if (error == undefined)
                setError("Not known error happend")
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        if (password != password2) {
            setError("Passwords didn't match")
        }
        else {
            try {
                setLoading(true)
                await signup(login, password)
            } catch (e) {
                setError({
                    "auth/invalid-email": "Invalid email passed.",
                    "auth/email-already-in-use": "Email already in use.",
                    "auth/weak-password": "Your password is too short",
                }[e.code])
                if (error == undefined)
                    setError("Not known error happend")
            }
        }
    }

    return (
        <>
            {userloading &&
                <div style={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column', gap: '20px' }}>
                    <ButtonGroup variant="contained">
                        <Button onClick={() => changemode("registration")}>
                            Email
                        </Button>
                        <Button onClick={() => changemode("login")}>
                            Register
                        </Button>
                    </ButtonGroup>
                    {
                        <Accordion expanded={accordion} sx={{ animationDuration: "0.3s", boxShadow: "0px 0px 0px 8px #e6e6e6", borderRadius: "4px" }}
                        >
                            <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{ display: "none" }}
                            >
                            </AccordionSummary>
                            <AccordionDetails sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexDirection: 'column', }}>
                                {mode === "login" ?
                                    <>
                                        <TextField
                                            required
                                            label="Email"
                                            onChange={(e) => setlogin(e.target.value)}
                                        />
                                        <TextField
                                            required
                                            label="Password"
                                            onChange={(e) => setpassword(e.target.value)}
                                        />
                                        <Button variant="contained" onClick={handleLogin}>Sign in</Button>
                                    </> :
                                    <>

                                        <TextField
                                            required
                                            label="Login"
                                            onChange={(e) => setlogin(e.target.value)}
                                        />
                                        <TextField
                                            required
                                            label="Password"
                                            onChange={(e) => setpassword(e.target.value)}
                                        />
                                        <TextField
                                            required
                                            label="Repeat password"
                                            onChange={(e) => setpassword2(e.target.value)}
                                        />
                                        <Button variant="contained" onClick={handleRegister}>Sign up</Button>
                                    </>

                                }
                            </AccordionDetails>
                        </Accordion>
                    }
                    {
                        error &&
                        <Alert variant="outlined" severity="error">
                            {error}
                        </Alert>
                    }
                </div>
            }
        </>
    )
}

export default Sign
