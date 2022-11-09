import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';
import { CurrencyState } from '../context/CurrencyContext';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import "../css/style.css";
import { TrendingCoins } from '../config/ApiUrl';
import { addCommas } from '../utils/utils'

export default function Home()
{
    const [coins, setCoins] = useState();
    const [loading, setLoading] = useState();

    const { currency, symbol } = CurrencyState();

    useEffect(() => {
        setLoading(true);

        axios.get(TrendingCoins(currency))
            .then(response => {
                setCoins(response.data);
                setLoading(false);
            })
            .catch(error => console.error(error));
    }, [currency]);

    const carouselItem = {
        textDecoration: "none",
        width: "60px"
    }

    const carouselIcon = {
        height: "90px",
        marginTop: "30px",
        marginBottom: "10px"
    }

    const items = coins !== undefined ? 
        coins.map(coin => {
            const change = coin.price_change_percentage_24h;

            return (
                <Link style={carouselItem} to={`/chart/${coin.id}`} >
                    <img src={coin.image} alt={coin.name} style={carouselIcon} />
                    <p>
                        {coin.symbol.toUpperCase()}&nbsp;
                        {change >= 0 
                            ? <span className="green">+ {change.toFixed(2)}%</span> 
                            : <span className="red">{change.toFixed(2)}%</span>}
                        <br/>
                        <span style={{fontSize: 20, fontWeight: 600}}>
                            {symbol + addCommas(coin.current_price.toFixed(2))}
                        </span>
                    </p>
                    
                </Link>
            );
        })
    :
        [];

    return (
        <Box className="min-vh-100 w-100 text-center">
            <h1 className='py-4'>Crypto Watch</h1>
            <Paper className='banner' style={{position: "relative", overflow: "hidden"}} elevate={6}>
                {loading 
                    ? <CircularProgress style={{marginTop: 80}} />
                    : <AliceCarousel
                        mouseTracking
                        infinite
                        autoPlayInterval={1000}
                        animationDuration={2000}
                        disableDotsControls
                        disableButtonsControls
                        responsive={{
                            0: { items: 2 },
                            512: { items: 3 },
                            720: { items: 4 },
                            1080: { items: 6 },
                            1440: { items: 8 }
                        }}
                        autoPlay
                        items={items}
                      />
                }  
            </Paper>
        </Box>
    );
}