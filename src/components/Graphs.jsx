import React, {useEffect, useState} from "react";

import { Line, Doughnut  } from 'react-chartjs-2';

//mui
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material'; 

import {
    Chart as ChartJS,
    CategoryScale,
    ArcElement,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,

    } from 'chart.js';
    
    ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,

    );

    ChartJS.register(ArcElement, Tooltip, Legend);


export default function Graphs({ activeUser, currentStatData }) {
    const [statsInOrder, setStatsInOrder] = useState({});
    const [pointTotals, setPointTotals] = useState({
        goals: '',
        assists: ''
    });

    const sum = (arr) => {
        let total = 0;
        for (let value in arr) {
            total += parseInt(arr[value]);
        }
        return total;
    };

    useEffect( () => {
        try {
            // sort currentStatData by date
            currentStatData.sort((a, b) => {
                return new Date(a.date) - new Date(b.date)
            });

            let tempDate = [];
            let tempGoal = [];
            let tempAssist = [];
            let tempPlusMinus = [];

            Object.values(currentStatData).forEach((item) => {
                tempDate.push(item.date);
                tempGoal.push(item.goals);
                tempAssist.push(item.assists);
                tempPlusMinus.push(item.plusMinus);
            });

            setStatsInOrder({
                dateLabels: tempDate,
                graphGoals: tempGoal,
                graphAssists: tempAssist,
                graphPlusMinus: tempPlusMinus
            });

            setPointTotals({
                goals: sum(tempGoal),
                assists: sum(tempAssist)
            });
        }
        catch (err) {
            console.log(err)
        }
    }, [currentStatData])

    // chart data
    const pointsData = {
        labels: statsInOrder.dateLabels,
        datasets: [
          {
            label: "Goals",
            data: statsInOrder.graphGoals,
            fill: false,
            backgroundColor: "blue",
            borderColor: "blue",
            showLine: true,
            spanGaps: true,
            pointRadius: 4
          },
          {
            label: "Assists",
            data: statsInOrder.graphAssists,
            fill: true,
            backgroundColor: "orange",
            borderColor: "orange",
            showLine: true,
            spanGaps: true,
            pointRadius: 4
          },
        ]
      };

      const doughData = {
        labels: ['Goals', 'Assists'],
        datasets: [
          {
            label: 'Points Distribution',
            data: [pointTotals.goals, pointTotals.assists],
            backgroundColor: [
              'blue',
              'orange'
            ],
            borderColor: [
              'black',
              'black',

            ],
            borderWidth: 1,
          },
        ],
      };

    //   const plusMinusOverTime = {
        
    //     // labels: statsInOrder.dateLabels,
    //     datasets: [
    //         {
    //             label: '+/-',
    //             data: [
    //                 {
    //                     // y: statsInOrder.dateLabels,
    //                     // x:  statsInOrder.graphPlusMinus,
    //                     x: [1],
    //                     y: parseInt(statsInOrder.graphPlusMinus[0])
    //                 }
    //             ], 
               
    //             backgroundColor: 'brown',
    //         } 
    //     ],
        
        
    //   };

      
    return (
        <Box sx ={{pb:20}}>
        <Typography sx = {{mt: 2}} variant="h4" gutterBottom>Graphs</Typography>
        <section id ="line-container">
        <Typography sx = {{mt: 2}} variant="h6" gutterBottom>Points Over Time</Typography>
        <Line 
            data = {pointsData} 
            options = {{
                layout: {
                    autoPadding:true,
                },
                tension: .5,
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        min: 0,
                        max: 7,
                        ticks: {
                            stepSize: 1
                        }
                    },

                    x: {
                        beginAtZero: true,
                    }
                }
            }}
        />
        </section>
        <section id = "doughnut-container">
            <Typography sx = {{mt: 2}} variant="h6" gutterBottom>Points Distribution</Typography>
            <Doughnut 
            data = {doughData} 
            options = {{
                responsive: true,
            }}
            />
        </section>

        {/* <section id = "bar-container"> */}
            {/* <Typography sx = {{mt: 2}} variant="h6" gutterBottom>+/- Over Time</Typography> */}
            {/* <Scatter  
                data = {plusMinusOverTime}
                // options = {{
                //     scales: {
                //         x: {
                //             type: 'linear',
                //             position: 'bottom'
                //         }
                //     }
                // }}
            /> */}
        {/* </section> */}
        </Box>
    )
}