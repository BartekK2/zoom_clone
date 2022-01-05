import React from 'react'
import { Chip, Avatar, ButtonBase } from '@mui/material';
function RoomTab({ props }) {
    const { name, secured } = props;

    return (
        <Chip component={ButtonBase} color="primary" avatar={<Avatar>F</Avatar>} label={name} />
    )
}

export default RoomTab
