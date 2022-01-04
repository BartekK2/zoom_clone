// Others
import React, { useEffect, useState } from 'react'
import anime from 'animejs';
import Link from 'next/link'

// STYLE
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup';

//ICONS
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SkateboardingIcon from '@mui/icons-material/Skateboarding';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PoolIcon from '@mui/icons-material/Pool';
import SleddingIcon from '@mui/icons-material/Sledding';
import KayakingIcon from '@mui/icons-material/Kayaking';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import CalculateIcon from '@mui/icons-material/Calculate';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

// RESPONSIVNES
import useMediaQuery from '@mui/material/useMediaQuery';


const HoverArea = styled.span`
	:hover {
		cursor: pointer;
	}
`

function Main() {

  // Animation
  const animationRef = React.useRef(null);
  React.useEffect(() => {
    animationRef.current = anime({
      targets: '.grid .el',
      scale: [
        { value: .2, easing: 'easeOutSine', duration: 750 },
        { value: 1, easing: 'easeInOutQuad', duration: 1800 }
      ],
      delay: anime.stagger(300, { grid: [4, 4], from: 'center' }),
      loop: true,
    });

  }, []);

  // Responsivnes
  const isPhone = useMediaQuery('(min-width:900px)');

  return (
    <>
      <div style={{ display: "flex", zIndex: 1000, fontSize: "150%", alignItems: "center", gap: "30px", position: "absolute", top: 0, left: 0, width: "100%", padding: "25px" }}>
        <EmojiPeopleIcon sx={{ fontSize: "150%" }} />
        {
          isPhone ?
            <>
              <Link href={'/about'} passHref>
                <a href="" style={{ textDecoration: "none", color: "black" }}>About</a>
              </Link>
              <Link href={'/contact'} passHref>
                <a href="" style={{ textDecoration: "none", color: "black" }}>Contact</a>
              </Link>
              <Link href={'/support'} passHref>
                <a href="" style={{ textDecoration: "none", color: "black" }}>Support</a>
              </Link>
            </> :
            <ButtonGroup variant="contained" >
              <Link href={'/about'}>
                <Button onClick={() => { console.log("XD") }}><InfoIcon /></Button>
              </Link>
              <Link href={'/contact'}>
                <Button><ContactPhoneIcon /></Button>
              </Link>
              <Link href={'/support'}>
                <Button><VolunteerActivismIcon /></Button>
              </Link>
            </ButtonGroup>

        }
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <Button variant="contained" sx={{ flexBasis: "100%" }}>{isPhone ? "Login" : <LoginIcon />}</Button>
          <Button variant="contained" sx={{ flexBasis: "100%" }}>{isPhone ? "Register" : <AccountBoxIcon />}</Button>
        </div>
      </div>


      <div style={{ display: "flex", alignItems: "stretch", flexDirection: isPhone ? "row" : "column" }} >
        <div style={{ width: isPhone ? "40%" : "100%", "marginTop": "auto", "display": "flex", "padding": "70px", "paddingBottom": "40px", "height": "100vh", "flexDirection": "column", "justifyContent": "flex-end" }}>
          <h1 style={{ fontSize: "350%", fontWeight: "bold", lineHeight: "70px" }}>
            Desktop video call app.
          </h1>
          <h4>
            Zoom like video call app. Made just for fun and portfolio, try it if u want but i dont recommend to use it as a replacement for apps like teams or sth.
          </h4>

          <HoverArea>

            <Button color="primary" variant="contained" style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: "10px",
            }}>
              Let&apos;s start
              <ArrowForwardIcon />
            </Button>

          </HoverArea>


        </div>

        <div style={{ display: isPhone ? 'flex' : "none", alignItems: 'center', justifyContent: 'center', width: "60%" }}><div className="grid">
          <div className="el"><SkateboardingIcon /></div>
          <div className="el"><SportsEsportsIcon /></div>
          <div className="el"><FitnessCenterIcon /></div>
          <div className="el"><PoolIcon /></div>
          <div className="el"><SleddingIcon /></div>
          <div className="el"><KayakingIcon /></div>
          <div className="el"><SportsBasketballIcon /></div>
          <div className="el"><CalculateIcon /></div>
          <div className="el"><SportsTennisIcon /></div>
          <div className="el"><SportsVolleyballIcon /></div>
          <div className="el"><SportsSoccerIcon /></div>
          <div className="el">12</div>
          <div className="el">13</div>
          <div className="el">14</div>
          <div className="el">15</div>
          <div className="el">16</div>

        </div></div>
      </div>
    </>
  )
}

export default Main
