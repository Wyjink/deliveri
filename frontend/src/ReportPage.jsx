import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LineChart } from '@mui/x-charts/LineChart';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'date', label: 'Дата' },
  { key: 'transport_model', label: 'Модель транспорта', subkey: 'name' },
  { key: 'transport_number', label: 'Номер транспорта' },
  { key: 'package_type', label: 'Тип упаковки', subkey: 'name' },
  { key: 'service', label: 'Сервис', subkey: 'name' },
  { key: 'status', label: 'Статус', subkey: 'name' },
  { key: 'cargo_type', label: 'Тип груза', subkey: 'name' },
];

export default function ReportPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('');
  const [selectedCargoType, setSelectedCargoType] = useState('');

  useEffect(() => {
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/deliveries/`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then(data => setDeliveries(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Получаем уникальные значения для фильтров
  const deliveryTypes = Array.from(new Set(deliveries.map(d => d.service?.name).filter(Boolean)));
  const cargoTypes = Array.from(new Set(deliveries.map(d => d.cargo_type?.name).filter(Boolean)));

  // Фильтрация данных
  const filteredDeliveries = deliveries.filter(d =>
    (selectedDeliveryType ? d.service?.name === selectedDeliveryType : true) &&
    (selectedCargoType ? d.cargo_type?.name === selectedCargoType : true)
  );

  // Группировка по дате для графика
  const deliveriesByDate = {};
  filteredDeliveries.forEach(d => {
    deliveriesByDate[d.date] = (deliveriesByDate[d.date] || 0) + 1;
  });
  const chartData = Object.entries(deliveriesByDate).map(([date, count]) => ({ date, count }));

  return (
    <Box
      minHeight="100vh"
      minWidth="100vw"
      bgcolor="background.default"
      color="text.primary"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <Paper
        sx={{
          p: 3,
          maxWidth: 900,
          width: '100%',
          borderRadius: 3,
          boxShadow: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box width="100%">
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight={700} align="left">
              Отчёт по доставкам
            </Typography>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={5} md={4}>
              <TextField
                label="Период"
                fullWidth
                variant="outlined"
                value="01.01.2025 – 10.01.2025"
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Сервис</InputLabel>
                <Select
                  label="Сервис"
                  value={selectedDeliveryType}
                  onChange={e => setSelectedDeliveryType(e.target.value)}
                  displayEmpty
                  renderValue={selected => selected ? selected : "Все"}
                >
                  <MenuItem value="">Все</MenuItem>
                  {deliveryTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Тип груза</InputLabel>
                <Select
                  label="Тип груза"
                  value={selectedCargoType}
                  onChange={e => setSelectedCargoType(e.target.value)}
                  displayEmpty
                  renderValue={selected => selected ? selected : "Все"}
                >
                  <MenuItem value="">Все</MenuItem>
                  {cargoTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Paper sx={{ p: 2, mb: 3, background: 'rgba(255,255,255,0.02)' }}>
          <Typography variant="subtitle1" mb={1}>Количество доставок</Typography>
          <Box height={220} display="flex" alignItems="center" justifyContent="center" color="grey.600">
            {chartData.length === 0 ? (
              <Typography variant="body2">Нет данных для графика</Typography>
            ) : (
              <LineChart
                xAxis={[{ dataKey: 'date', label: 'Дата', scaleType: 'band' }]}
                series={[{ dataKey: 'count', label: 'Доставки', color: '#90caf9' }]}
                dataset={chartData}
                width={700}
                height={180}
                sx={{ background: 'transparent', color: 'text.primary' }}
              />
            )}
          </Box>
        </Paper>
        <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.02)' }}>
          <Typography variant="subtitle1" mb={1}>Таблица доставок</Typography>
          <Box height={320} overflow="auto">
            {loading ? (
              <Typography variant="body2">Загрузка...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : filteredDeliveries.length === 0 ? (
              <Typography variant="body2">Нет данных</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {columns.map(col => (
                        <TableCell key={col.key}>{col.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDeliveries.map((row, idx) => (
                      <TableRow key={idx}>
                        {columns.map(col => (
                          <TableCell key={col.key}>
                            {col.subkey ? row[col.key]?.[col.subkey] : row[col.key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>
      </Paper>
    </Box>
  );
} 