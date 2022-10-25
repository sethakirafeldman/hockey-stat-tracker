import React from 'react';
import StatEntry from "./StatEntry";
import PointHistory from "./PointHistory";

import {UserAuth} from '../contexts/AuthContext';

export default function Dashboard(props) {
    // at dashboard level, get player_id from users table
    // pass in as props to StatEntry and PointHistory

    const {user} = UserAuth();

    const [detectChange , setDetectChange] = React.useState();

    const causeRender = () => {
        setDetectChange(true);
    };

    return (
        <>
            <div>Welcome, {props.activeUser.name}</div>
            <StatEntry activeUser = {props.activeUser} />
            <PointHistory activeUser = {props.activeUser} detectChange = {detectChange} />
        </>
    )
}