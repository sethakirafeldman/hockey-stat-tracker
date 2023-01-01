import React, {useEffect, useState} from "react";
import {storeLocally, getLocalStorage} from "../../utils";
import {summaryTheme} from '../../theme';

import { Line, Doughnut } from 'react-chartjs-2';

//mui
import { Box, Typography, Link, Paper } from '@mui/material';

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

    const [statsInOrder, setStatsInOrder] = useState({
        dateLabels: [],
        graphGoals: [],
        graphAssists: [],
        graphPlusMinus: [],
    });

    const [pointTotals, setPointTotals] = useState({
        goals: 0,
        assists: 0,
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
            if (currentStatData.length > 0) {
                // console.log('retrieving data from parent component')
                // sorts currentStatData by date
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

            // if currentData not handed in from parent comp, check for local storage
            else if (currentStatData.length ===  0) { 
                const localData = getLocalStorage();
                if (localData === null) {
                    // allow graphs page to render if no local data.
                }

                else {
                    // console.log('retrieving data from local storage')
                    setStatsInOrder(localData);
                    setPointTotals({
                        goals: sum(localData.graphGoals),
                        assists: sum(localData.graphAssists),
                    }); 
                }
            }    
        }
        catch (err) {
            console.log(err)
        }
    }, [currentStatData])

    // sends current data to local storage
    useEffect(() => {
        if (Object.keys(statsInOrder).length > 0 || statsInOrder.dateLabels.length > 0) {
            storeLocally(statsInOrder);  
        }
        
    }, [statsInOrder])

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

      const plusMinusOverTime = {
        labels: statsInOrder.dateLabels,
        datasets: [
          {
            label: "+/-",
            data: statsInOrder.graphPlusMinus,
            fill: false,
            backgroundColor: "blue",
            borderColor: "blue",
            showLine: true,
            spanGaps: true,
            pointRadius: 4
          }
        ]    
      };

    return (
        <Box className = {`fade-in`} sx ={{pb:20}}>
        <Paper
            elevation = {3} 
            square 
            sx = {summaryTheme.textContent} >
        <Typography sx = {{mt: 2}} variant="h4" gutterBottom>Graphs</Typography>
        <Typography sx = {{m: 1, textAlign:"left", width: "60%", lineHeight: "1.5", mb: 2}} variant="p" gutterBottom>
            Here, you will find some visualizations of your stat data entered on your <Link href = "/dashboard">dashboard</Link>.
            These will be generated using the data you provided, and will not appear until your first entry. 
        </Typography>
        </Paper>
        {statsInOrder.dateLabels.length > 0 ? // need logic to only show when there is data in local or passed in
            <>
            <Paper elevation = {6} sx = {{margin: 'auto', width: '30%', mb: 2, p:2}}>
                <Typography sx = {{mt: 2}} variant="h6" gutterBottom>Points Distribution</Typography>
                <Doughnut 
                data = {doughData} 
                options = {{
                    responsive: true,
                }}
            />
            </Paper>
            <Paper elevation = {6} sx= {{ margin:'auto', width:'80%', maxWidth: '1000px', p:2, mb:2}}>
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
            </Paper>
            <Paper elevation = {6} sx= {{margin:'auto', width:'80%', maxWidth: '1000px', p:2, mb:2}}>
                <Typography sx = {{mt: 2}} variant="h6" gutterBottom>+/- Over Time</Typography>
                <Line 
                    data = {plusMinusOverTime} 
                    options = {{
                        layout: {
                            autoPadding:true, 
                        },
                        tension: 0,
                        responsive: true,
                        maintainAspectRatio: true,
                        scales: {
                            y: {
                                min: -7,
                                max: 7,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        }
                    }}
                />
            </Paper>
            </>
        : 
            <Typography>Waiting for data...</Typography>
        }
        </Box>
    )
}