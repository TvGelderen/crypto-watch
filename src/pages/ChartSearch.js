import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Skeleton, Typography } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { CurrencyState } from '../context/CurrencyContext';
import axios from 'axios';
import { CoinList } from '../config/ApiUrl';
import { Sparklines, SparklinesLine } from 'react-sparklines';

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
    { id: 'name', label: 'Name', minWidth: 140 },
    {
      id: 'symbol',
      label: 'Symbol',
      minWidth: 40,
      format: (value) => value.toUpperCase()
    },
    {
      id: 'current_price',
      label: 'Price',
      minWidth: 80,
      align: 'right',
      format: (value) => value.toFixed(2).toLocaleString('en-US'),
    },
    {
      id: 'sparkline_in_7d',
      label: '7 Days',
      minWidth: 260,
    }
  ];


export default function ChartSearch()
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
      <Box className="min-vh-100 w-100 p-2">
          <form>
            <div
              className='w-100 m-auto' 
              style={{maxWidth: "1200px"}}
            >
              <TextField 
                id="outlined-basic" 
                label="Search"
                onInput={event => {
                  setSearchQuery(event.target.value);
                }}
                fullWidth
                className="rounded"
                style={{backgroundColor: "#262626"}}
              />
            </div>
          </form>
          <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={6} className='mt-3 m-auto' style={{maxWidth: "1200px"}}>
              <TableContainer>
                  <Table>
                      <TableHead>
                          <TableRow>
                              {columns.map((column) => (
                                  <StyledTableCell
                                    key={column.path}
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
                                      key={column.path}
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
                                                key={coin.name} 
                                                align={column.align}
                                                style={{ fontFamily: ["Montserrat", "sans-serif"] }}
                                                onClick={() => navigate(`/chart/${coin.id}`)}
                                              >
                                                {column.id === 'name' 
                                                    ? <span><img className='coin-icon' src={coin.image} alt="icon" />&nbsp;&nbsp;{coin.name}</span> 
                                                    : column.id === 'symbol'
                                                        ? <span>{value.toUpperCase()}</span>
                                                        : column.id === 'current_price'
                                                            ? <span>{symbol + value.toFixed(2).toLocaleString('en-US')}</span>
                                                            : column.id === 'sparkline_in_7d'
                                                                ? <Sparklines data={value.price} limit={200} height={40}>
                                                                      <SparklinesLine color={
                                                                        value.price[0] > value.price[value.price.length - 1]
                                                                          ? "red" : "green"} />
                                                                  </Sparklines>
                                                                : <></>}
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