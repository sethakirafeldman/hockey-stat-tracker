import React, {useEffect, useState} from "react";

import { Line } from 'react-chartjs-2';

import { db } from "../firebase";
import { collection, onSnapshot, query, where } from 'firebase/firestore';


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
    const {activeUser} = props;
    const [pointsHistory, setPointsHistory] = useState([]);
    const [statsInOrder, setStatsInOrder] = useState({});

    // sort data b - > a


    useEffect(() => {

      try {
        const q = query(collection(db, "points-history"), where("player_id", "==", props.activeUser.player_id));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const ptsArr = [];
          querySnapshot.forEach((doc) => {
              ptsArr.push(doc.data());
          });
          ptsArr.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
          });
          setPointsHistory(ptsArr);
          // props.realTimeCallBack(ptsArr);
        });

        return () => {
            unsubscribe();
        }

    }
    catch(err) {
        console.log(err)
    }

    // need array that contains elements in order that will be displayed
    // eslint-disable-next-line
    }, [activeUser]);

    useEffect( () => {
        try {
            // console.log(pointsHistory)
            let tempDate = [];
            let tempGoal = [];
            let tempAssist = [];

            Object.values(pointsHistory).forEach((item) => {
                tempDate.push(item.date);
                tempGoal.push(item.goals);
                tempAssist.push(item.assists);
            });

            setStatsInOrder({
                dateLabels: tempDate,
                graphGoals: tempGoal,
                graphAssists: tempAssist
            });
        }
        catch (err) {
            console.log(err)
        }
    },[pointsHistory])

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
            pointRadius: 5
          },
          {
            label: "Assists",
            data: statsInOrder.graphAssists,
            fill: true,
            backgroundColor: "orange",
            borderColor: "orange",
            showLine: true,
            spanGaps: true,
            pointRadius: 5
          }
        ]
      };


      
    return (
        <section id ="chart-container">
        <Typography sx = {{mt: 2}} variant="h4" gutterBottom>Graphs</Typography>
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

        </section>
    )
}