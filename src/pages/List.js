import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Box, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Skeleton, Typography } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { CurrencyState } from '../context/CurrencyContext';
import '../css/style.css';
import { CoinList } from '../config/ApiUrl';
import { addCommas } from '../utils/utils';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#111111",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "#333333",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const columns = [
    { id: 'market_cap_rank', label: '#', minWidth: 40 },
    { id: 'name', label: 'Name', minWidth: 180 },
    {
      id: 'symbol',
      label: 'Symbol',
      minWidth: 40,
      format: (value) => value.toUpperCase()
    },
    {
      id: 'current_price',
      label: 'Price',
      minWidth: 100,
      align: 'right',
      format: (value) => value.toFixed(2).toLocaleString('en-US'),
    },
    {
      id: 'price_change_percentage_24h',
      label: 'Change (24h)',
      minWidth: 60,
      align: 'right',
      format: (value) => value.toFixed(2),
      style: (value) => value < 0 ? 'red' : 'green',
    },
    {
      id: 'total_volume',
      label: 'Total Volume',
      minWidth: 160,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'market_cap',
      label: 'Market Cap',
      minWidth: 160,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
  ];

export default function List() 
{
    const [data, setData ] = useState();
    const [loading, setLoading] = useState();
    const [searchQuery, setSearchQuery] = useState("");

    const { currency, symbol } = CurrencyState();

    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true);

        axios.get(CoinList(currency))
            .then(response => {
              setData(response.data);
              setLoading(false);
            })
            .catch(error => console.error(error));
    }, [currency]);

    return (
      <Box className='mx-4 mt-3 min-vh-100 w-100'>
        <form>
            <TextField 
              id="outlined-basic" 
              label="Search" 
              placeholder="Search..." 
              variant="outlined"
              onInput={event => {
                setSearchQuery(event.target.value);
              }}
              fullWidth
            />
        </form>
        <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={6} className='mt-3'>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth, fontFamily: ["Montserrat", "sans-serif"] }}
                                >
                                {column.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading 
                        ? <TableRow role="checkbox" tabIndex={-1} key={1}>
                            {columns.map((column) => (
                                  <TableCell
                                    key={column.id + column.name}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                  >
                                    <Skeleton width="100%">
                                      <Typography>.</Typography>
                                    </Skeleton>
                                  </TableCell>
                            ))}
                          </TableRow>
                        : data !== undefined 
                            ? data
                            .filter(coin => coin.name.toLowerCase().includes(searchQuery.toLowerCase())
                                          || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(coin => {
                              return (
                                  <StyledTableRow  hover role="checkbox" tabIndex={-1} key={coin.id} style={{cursor: "pointer"}}>
                                      {columns.map(column => {
                                          const value = coin[column.id];
                                          return (
                                            <StyledTableCell 
                                              key={coin.id} 
                                              align={column.align}
                                              style={{ fontFamily: ["Montserrat", "sans-serif"] }}
                                              onClick={() => navigate(`/chart/${coin.id}`)}
                                            >
                                              {column.id === 'name' ? <span><img className='coin-icon' src={coin.image} alt="icon" />&nbsp;&nbsp;</span> : <></>}
                                              {(column.format && typeof value === 'number') 
                                                ? column.id === "price_change_percentage_24h"
                                                  ? value < 0 
                                                    ? <span style={{ color: "red" }}>{column.format(value)}%</span> 
                                                    : <span style={{ color: "green" }}>+{column.format(value)}%</span> 
                                                  : <span>{symbol + column.format(value)}</span>
                                                : column.id === 'symbol' ? addCommas(column.format(value)) : value}
                                            </StyledTableCell>
                                          );
                                        })}
                                    </StyledTableRow >
                                )})
                            : <></>}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
      </Box>
    );
}