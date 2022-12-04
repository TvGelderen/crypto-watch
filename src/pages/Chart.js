import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Skeleton, Typography, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { CurrencyState } from "../context/CurrencyContext";
import axios from "axios";
import { Coin, CoinHistory } from "../config/ApiUrl";
import { addCommas } from "../utils/utils";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, LineController, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from "chart.js";
import parse from 'html-react-parser';

ChartJS.register(
    LineElement,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip,
);

export default function Chart() 
{
    const [coin, setCoin] = useState();
    const [loadingCoin, setLoadingCoin] = useState();
    const [coinHistory, setCoinHistory] = useState();
    const [loadingHistory, setLoadingHistory] = useState();
    const [days, setDays] = useState(7);

    const { id } = useParams();
    const { currency, symbol } = CurrencyState();

    useEffect(() => {
        setLoadingCoin(true);

        axios.get(Coin(id))
            .then(response => {
                setCoin(response.data);
                setLoadingCoin(false);
            })
            .catch(error => console.error(error));     
    }, [id, currency]);

    useEffect(() => {
        setLoadingHistory(true);

        axios.get(CoinHistory(id, currency, days))
            .then(response => {
                setCoinHistory(response.data);
                setLoadingHistory(false);
            })
            .catch(error => console.error(error));        
    }, [id, currency, days]);

    console.log(coinHistory.prices)

    return (
      <Box className="min-h-100 w-100 p-2">
        <Grid container spacing={2}>
            <Grid item xl={3} lg={12} md={12} sm={12} xs={12}>
                {!loadingCoin 
                    ? coin !== undefined 
                        ?   <Paper elevation={6} style={{textAlign: "center"}}>
                                <Box padding={3}>
                                    <img 
                                        src={coin.image['large']} 
                                        alt={coin.name}
                                        height="180" 
                                        style={{marginBottom: 18}}
                                    /> 
                                    <Typography variant="h3" style={{fontFamily: ["Montserrat", "sans-serif"]}}>{coin.name}</Typography>
                                    <Typography style={{fontFamily: ["Montserrat", "sans-serif"], padding: 10}}>Created: {coin.genesis_date}</Typography>
                                    <Typography style={{fontFamily: ["Montserrat", "sans-serif"], textAlign: "justify", marginTop: 5}}>
                                        {parse(coin.description.en)}
                                    </Typography>
                                    <br />
                                    <Divider />
                                    <br />
                                    <div style={{textAlign: "left"}}>
                                        <Typography variant="h5" style={{fontFamily: ["Montserrat", "sans-serif"]}}><span style={{fontWeight: 900}}>Rank: </span> {coin.market_cap_rank}</Typography>
                                        <Typography variant="h5" style={{fontFamily: ["Montserrat", "sans-serif"]}}><span style={{fontWeight: 900}}>Current Price: </span> {symbol + addCommas(coin.market_data.current_price[currency.toLowerCase()].toFixed(2))} 
                                            <sup>{coin.market_data.price_change_percentage_24h_in_currency[currency.toLowerCase()] < 0
                                                ? <span className="red"> {coin.market_data.price_change_percentage_24h_in_currency[currency.toLowerCase()].toFixed(2)}%</span>
                                                : <span className="green"> {coin.market_data.price_change_percentage_24h_in_currency[currency.toLowerCase()].toFixed(2)}%</span>}</sup>
                                        </Typography>
                                        <Typography variant="h5" style={{fontFamily: ["Montserrat", "sans-serif"]}}><span style={{fontWeight: 900}}>Market Cap: </span> {symbol + addCommas(coin.market_data.market_cap[currency.toLowerCase()].toFixed(2))}</Typography>
                                    </div>
                                </Box>
                            </Paper>
                        : <></>
                    : <div>
                        <Skeleton variant="rectangular" height={360} />
                      </div>}
            </Grid>
            <Grid item xl={9} lg={12} md={12} sm={12} xs={12}>
                {!loadingHistory
                    ?
                    coinHistory !== undefined
                        ? <Box>
                            <Paper elevation={6} style={{ display: "flex", justifyContent: "center" }}>
                                <Typography className="py-1 px-2 m-2 rounded" style={{ backgroundColor: "#3e3e3e", cursor: "pointer" }} onClick={() => setDays(1)}>1 Day</Typography>
                                <Typography className="py-1 px-2 m-2 rounded" style={{ backgroundColor: "#3e3e3e", cursor: "pointer" }} onClick={() => setDays(7)}>7 Days</Typography>
                                <Typography className="py-1 px-2 m-2 rounded" style={{ backgroundColor: "#3e3e3e", cursor: "pointer" }} onClick={() => setDays(30)}>30 Days</Typography>
                                <Typography className="py-1 px-2 m-2 rounded" style={{ backgroundColor: "#3e3e3e", cursor: "pointer" }} onClick={() => setDays(60)}>60 Days</Typography>
                                <Typography className="py-1 px-2 m-2 rounded" style={{ backgroundColor: "#3e3e3e", cursor: "pointer" }} onClick={() => setDays(365)}>365 Days</Typography>                                
                            </Paper>
                            <Paper elevation={6} className="mt-3" style={{ overflow: "scroll" }}>
                                <Box padding={3} style={{ textAlign: "center", minWidth: "1000px" }}>
                                    <Typography variant="h2" style={{fontFamily: ["Montserrat", "sans-serif"]}}>Price Chart</Typography>
                                    <Line 
                                        data={{
                                            labels: coinHistory.prices.map(price => {
                                                const date = new Date(price[0]);
                                                const time = `${date.toLocaleDateString()} ${date.getHours()}:00`;
                                                return days <= 7 ? time : date.toLocaleDateString();
                                            }),
                                            datasets: [{
                                                backgroundColor: 'rgb(255, 99, 132)',
                                                borderColor: 'rgb(255, 99, 132)',
                                                data: coinHistory.prices.map(price => price[1]),
                                                label: `Price (past ${days} days) in ${currency}`,
                                            }]
                                        }}
                                        
                                    />
                                </Box>
                            </Paper>
                            <Paper elevation={6} className="mt-3" style={{ overflow: "scroll" }}>
                                <Box padding={3} style={{ textAlign: "center", minWidth: "1000px" }}>
                                    <Typography variant="h2" style={{fontFamily: ["Montserrat", "sans-serif"]}}>Market Cap Chart</Typography>
                                    <Line 
                                        data={{
                                            labels: coinHistory.market_caps.map(price => {
                                                const date = new Date(price[0]);
                                                const time = `${date.toLocaleDateString()} ${date.getHours()}:00`;
                                                return days <= 7 ? time : date.toLocaleDateString();
                                            }),
                                            datasets: [{
                                                backgroundColor: 'rgb(255, 99, 132)',
                                                borderColor: 'rgb(255, 99, 132)',
                                                data: coinHistory.market_caps.map(price => price[1]),
                                                label: `Price (past ${days} days) in ${currency}`,
                                            }]
                                        }}
                                        
                                    />
                                </Box>
                            </Paper>
                            </Box>
                        : <></>
                    : <div>
                        <div>
                            <Skeleton variant="rectangular" height={40} />
                        </div>
                        <div className="mt-3">
                            <Skeleton variant="rectangular" height={360} />
                        </div>
                        <div className="mt-3">
                            <Skeleton variant="rectangular" height={360} />
                        </div>
                    </div>}
            </Grid>
        </Grid>
      </Box>
    );
}