// Others
import React, { useEffect, useState } from 'react'
import anime from 'animejs';

// STYLE
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup';

//ICONS
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
      <div style={{ display: "flex", alignItems: "stretch", flexDirection: isPhone ? "row" : "column", flex: '1 1 auto' }} >
        <div style={{ width: isPhone ? "40%" : "100%", "marginTop": "auto", "display": "flex", "padding": "70px", "paddingBottom": "40px", "flexDirection": "column", "justifyContent": "flex-end" }}>
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
