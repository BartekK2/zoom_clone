import React from 'react'
import { Chip, Avatar, ButtonBase } from '@mui/material';
function RoomTab({ props, onClick }) {
    const { name, secured } = props;

    return (
        <Chip component={ButtonBase} onClick={onClick} color="primary" avatar={<Avatar>F</Avatar>} label={name} />
    )
}

export default RoomTab
