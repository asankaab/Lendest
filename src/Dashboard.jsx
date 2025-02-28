import { useContext, useEffect, useState } from "react";

import { Grid, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { collection, collectionGroup, getAggregateFromServer, getDocs, query, sum, where } from "firebase/firestore";
import { db } from "./Loaders";
import { AuthContext } from "./Context";
  
export default function Dashboard() {

    const auth = useContext(AuthContext);
    
    const [count, setCount] = useState(0);
    const [chartData, setchartData] = useState([{id: 0, label: 'loading...', value: 0}]);

    useEffect(()=> {
      setInterval(() => {
        
      }, 5);
    },[])

    
    useEffect(() => {
      (async function (){
        // count total

        const datacollection = collectionGroup(db, 'datacollection');
        const q = query(datacollection, where('user', '==', auth?.uid));
        const snapshot = await getAggregateFromServer(q, {
          subTotal: sum('amount')
        });

        setCount(snapshot.data().subTotal)

        // chart data

        if (auth?.uid) {
          const q = query(collection(db, auth?.uid));

          const querySnapshot = await getDocs(q);

          const docs = querySnapshot.docs;

          const namesList = docs.map((doc)=> {
            return {id: doc.id, name: doc.data().name}
          })
        

          let values = [];

          namesList.forEach(async(name) => {
            await getAggregateFromServer(collection(db, auth?.uid, name.id, "datacollection"), {
              sum: sum('amount')
            }).then((res) => {
              values = [...values, {id: name.name, label: name.name, value: res.data().sum}]
              setchartData(values)
            })
          })

        }
    })();

    },[auth])
    

    return (
        <Grid container rowGap={2} alignContent='space-between'>
              <Grid item xs={12} md={9}> 
                <Typography variant="h2">{count} LKR</Typography>
                <Typography variant="body">{count === undefined ? 'Calculating...' : "total money lended."}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <PieChart
                      series={[
                        {
                          data: chartData,
                          innerRadius: 40,
                          outerRadius: 90,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          startAngle: -90,
                          endAngle: 360,
                          cx: 85,
                          cy: 85,
                        },
                      ]}

                      slotProps={{
                          legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'left' },
                            itemMarkWidth: 10,
                            itemMarkHeight: 10,
                            padding: 0,
                            hidden: false
                          }}}
                      
                      width={190}
                      height={290}
                />
              </Grid>
              <Grid item xs={12} md={12} component={Stack} justifyContent='flex-end'>
                <img src="./lendest.svg" alt="" width={120}/>
              </Grid>
      </Grid>
    )
}