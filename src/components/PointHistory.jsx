import React from 'react';
import { db } from "../firebase";
import { collection, query, where, getDocs, docs } from "firebase/firestore";

export default function PointHistory(props) {
    //db rule temporarily set to 'true' to allow localhost dev.
    const colRef = collection(db, 'points-history');

    // should return only results based on player_id matching player
    getDocs(colRef)
        .then(snapshot => {
            let points = [];
            snapshot.docs.forEach((doc)=>{
                points.push({ ...doc.data(), id: doc.player_id })
            })
            console.log(points)
        })

    return(
        <>Point History Component</>
    )
}