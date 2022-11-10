import React, {useEffect, useState} from "react";

import { Line } from 'react-chartjs-2';

//mui
import Typography from '@mui/material/Typography';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    } from 'chart.js';
    
    ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
    );

export default function Graphs(props) {
    const {activeUser, currentDate, currentStatData} = props;
    const [goalsData, setGoalsData] = useState([]);
    const [assistsData, setAssistsData] = useState([]);
    const [dateLabel, setDateLabel] = useState([]);

    // sort data b - > a


    useEffect(() =>{

        // 
        let newObj = currentStatData;
        let goalArr = [];
        let assistArr = [];
        let dateArr = [];

        newObj = newObj.sort(( a, b) => b.date - a.date);
        console.log(newObj)
        newObj.forEach((obj)=>{
            // build obj for aall
            goalArr.push(obj.goals);
            assistArr.push(obj.assists);
            dateArr.push(obj.date);
        })
        setGoalsData(goalArr);
        setAssistsData(assistArr);
        setDateLabel(dateArr);

    }, [currentStatData])

    // fields in data need to be popualted by entries in currentStatData
    // maybe should be stored in state
    const data = {
        labels: dateLabel,
        datasets: [
          {
            label: "Goals",
            data: goalsData,
            fill: false,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          },
          {
            label: "Assists",
            data: assistsData,
            fill: false,
            borderColor: "#742774"
          }
        ]
      };


      
    return (
        <section>
        <Typography sx = {{mt: 2}} variant="h4" gutterBottom>Graphs</Typography>
        <Line data = {data} />
        </section>
    )
}