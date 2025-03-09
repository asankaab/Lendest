import { useContext, useEffect, useState, Suspense } from "react";

import { Grid, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { collection, getAggregateFromServer, getDocs, getFirestore, limit, query, sum, where } from "firebase/firestore";
import { AuthContext } from "./Context";
import { app } from "./Context";
import Login from "./Login";
  
export default function Dashboard() {

    const auth = useContext(AuthContext);

    const db = getFirestore(app);
    
    const [count, setCount] = useState(0);
    const [chartData, setchartData] = useState([]);

    useEffect(()=> {
      setInterval(() => {
        
      }, 5);
    },[])

    
    useEffect(() => {
      async function getChartDataAndTotal (){
        // chart data
        
          const chartDataQuery = query(collection(db, auth?.uid), limit(8));

          const chartQuerySnapshot = await getDocs(chartDataQuery);

          const names = chartQuerySnapshot.docs.map((doc)=> {
            return {id: doc.id, name: doc.data().name}
          })
        

          let namevalues = [];

          names.forEach(async(name) => {
            await getAggregateFromServer(collection(db, auth?.uid, name.id, "datacollection"), {
              sum: sum('amount')
            }).then((res) => {
              namevalues = [...namevalues, {id: name.name, label: name.name, value: res.data().sum}]
              setchartData(namevalues)
            })
          })

        // total count

          const totalQuery = query(collection(db, auth?.uid));

          const totalQuerySnapshot = await getDocs(totalQuery);

          let totalArray = [];

          totalQuerySnapshot.forEach((doc) => {
            getAggregateFromServer(collection(db, auth?.uid, doc.id, "datacollection"), {
              sum: sum('amount')
            }).then((data) => {
              const sumVal = data.data().sum;
              totalArray = [...totalArray, sumVal]
              setCount(totalArray.reduce((acc, curr) => acc + curr, 0))
            })
          })
    }

    if (auth) {
      getChartDataAndTotal();
    }

    },[auth, db])

    const matches = useMediaQuery('(min-width:600px)');
    
    if (!auth) return <Login/>

    return (
      <Stack direction="column" justifyContent="space-between" minHeight={matches ? '90vh' : '80vh'}>
        <Grid container rowGap={2} alignContent='flex-start' wrap="wrap">
              <Grid item xs={12} md={8}>
                <Suspense fallback={<Skeleton/>}>
                  <Typography variant="h2" noWrap>{count} <Typography variant="subtitle2" component="sup">LKR</Typography></Typography>
                </Suspense>
                <Typography variant="body">{count === undefined ? 'Calculating...' : "total money lended."}</Typography>
              </Grid>
              <Grid item xs={12} md={4} minWidth={60}>
                {chartData[0] &&
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
                          }
                          }}
                      
                      width={220}
                      height={260}
                />}
              </Grid>
        </Grid>
        <Grid direction="row-reverse" container justifyContent="space-between">
          <Grid item>
            <img src="./lendest.svg" alt="" width={120}/>
          </Grid>
        </Grid>
      </Stack>
    )
}