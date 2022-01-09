import React, { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../AuthContext'

// STYLE
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup';

import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import LogoutIcon from '@mui/icons-material/Logout';

// RESPONSIVNES
import useMediaQuery from '@mui/material/useMediaQuery';


const HoverArea = styled.span`
	:hover {
		cursor: pointer;
	}
`

function Navbar() {
    const isPhone = useMediaQuery('(min-width:900px)');
    const { currentUser, logout } = useAuth();

    return (
        <div style={{ display: "flex", flex: '0 1 auto', zIndex: 1000, fontSize: "150%", alignItems: "center", gap: "30px", width: "100%", padding: "25px", borderBottom: "solid 1px black" }}>
            <EmojiPeopleIcon sx={{ fontSize: "150%" }} />
            {
                isPhone ?
                    <>
                        <Link href={'/about'} >
                            <a style={{ textDecoration: "none", color: "black" }}>About</a>
                        </Link>
                        <Link href={'/contact'}>
                            <a style={{ textDecoration: "none", color: "black" }}>Contact</a>
                        </Link>
                        <Link href={'/support'}>
                            <a style={{ textDecoration: "none", color: "black" }}>Support</a>
                        </Link>
                    </> :
                    <ButtonGroup variant="contained" >
                        <Link href={'/about'} passHref={true}>
                            <Button onClick={() => { console.log("XD") }}><InfoIcon /></Button>
                        </Link>
                        <Link href={'/contact'} passHref={true}>
                            <Button><ContactPhoneIcon /></Button>
                        </Link>
                        <Link href={'/support'} passHref={true}>
                            <Button><VolunteerActivismIcon /></Button>
                        </Link>
                    </ButtonGroup>

            }
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
                {
                    currentUser ?

                        <>
                            <Button variant="contained" onClick={logout}>{isPhone ? "Logout" : <LogoutIcon />}</Button>
                        </>
                        :
                        <>
                            {location.pathname !== "/sign" &&
                                <>
                                    <Button href="/sign?urlmode=login" variant="contained" sx={{ flexBasis: "100%" }}>{isPhone ? "Login" : <LoginIcon />}</Button>
                                    <Button href="/sign?urlmode=registration" variant="contained" sx={{ flexBasis: "100%" }}>{isPhone ? "Register" : <AccountBoxIcon />}</Button>
                                </>
                            }
                        </>

                }
            </div>
        </div>
    )
}

export default Navbar
