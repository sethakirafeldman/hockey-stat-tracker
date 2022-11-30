import React, {useEffect, useState} from "react";

import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';

//mui
import Typography from '@mui/material/Typography';

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
    },[currentStatData])

    // chart data
    const data = {
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
          }
        ]
      };

      const pieData = {
        labels: ['Goals', 'Assists'],
        datasets: [
          {
            label: 'Points Distribution',
            data: [pointTotals.goals, pointTotals.assists],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      
    return (
        <section id ="chart-container">
        <Typography sx = {{mt: 2}} variant="h4" gutterBottom>Graphs</Typography>
        <Typography sx = {{mt: 2}} variant="h6" gutterBottom>Points Over Time</Typography>
        <Line 
            data = {data} 
            options = {{
                layout: {
                    autoPadding:true,
                },
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        min: 0,
                        max: 6,
                        ticks: {
                            stepSize: 1
                        }
                    },

                    x: {
                        beginAtZero:true,
                    }
                }
            }}
        />
        <Pie 
           data = {pieData} 
        />
        </section>
    )
}