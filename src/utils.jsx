import dayjs from 'dayjs'
import React from 'react';

//icons
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const getCurrentDate = () => {
    let now = dayjs();
    let date = dayjs(now).format('YYYY-MM-DD');
    return date;
};

const convertToEmoticons = (emoteVal) => {
    switch(emoteVal) {
      
        case 1:
            return (<MoodBadIcon/>)
        case 2:
            return (<SentimentVeryDissatisfiedIcon/>)
        case 3:
            return (<SentimentDissatisfiedIcon/>)
        case 4:
            return (<SentimentSatisfiedIcon/>)
        case 5:
            return (<SentimentVerySatisfiedIcon/>)
        default:
            break;
    }
};

const storeLocally = (arr) => {
    arr = JSON.stringify(arr);
    window.localStorage.setItem("temp", arr);
};

const getLocalStorage = () => {
    // console.log(window.localStorage.getItem("temp"));
    return JSON.parse(window.localStorage.getItem("temp"));
};

export {getCurrentDate, convertToEmoticons, storeLocally, getLocalStorage}