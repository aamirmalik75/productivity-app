export const rangeOption = {
  'Week': '1_week',
  'Month': '1_month',
  'Year': '1_year'
}

export const getColors = (identifier, mode) => {
  if (mode === '1_week')
    return dayColors(identifier);
  else if (mode === '1_month')
    return weekColors(identifier);
  else if (mode === '1_year')
    return monthColors(identifier);
}

export const dayColors = (identifier) => {
  if (identifier === 'Monday')
    return '#eb5e28';
  else if (identifier === 'Tuesday')
    return '#ffb703';
  else if (identifier === 'Wednesday')
    return '#219ebc';
  else if (identifier === 'Thursday')
    return '#d4a373';
  else if (identifier === 'Friday')
    return '#c1121f';
  else if (identifier === 'Saturday')
    return '#8338ec';
  else if (identifier === 'Sunday')
    return '#ff006e';
}

export const weekColors = (identifier) => {
  if (identifier === 'Week 1')
    return '#72b01d';
  else if (identifier === 'Week 2')
    return '#78290f';
  else if (identifier === 'Week 3')
    return '#8f2d56';
  else if (identifier === 'Week 4')
    return '#00cc66';
  else if (identifier === 'Week 5')
    return '#c6ac8f';
}

export const monthColors = (identifier) => {
  if (identifier === 'January')
    return '#218380';
  else if (identifier === 'February')
    return '#250902';
  else if (identifier === 'March')
    return '#ff6d00';
  else if (identifier === 'April')
    return '#0466c8';
  else if (identifier === 'May')
    return '#9c6644';
  else if (identifier === 'June')
    return '#e63946';
  else if (identifier === 'July')
    return '#00aeef';
  else if (identifier === 'August')
    return '#054a29';
  else if (identifier === 'September')
    return 'hsl(256,70%,50%)';
  else if (identifier === 'October')
    return 'hsl(224, 70%, 50%)';
  else if (identifier === 'November')
    return '#6C5F5B';
  else if (identifier === 'December')
    return '#FF9800';

}

export const timeIntervalFields1 = [
  "00:00:00 - 00:30:00",
  "00:30:00 - 01:00:00",
  "01:00:00 - 01:30:00",
  "01:30:00 - 02:00:00",
  "02:00:00 - 02:30:00",
  "02:30:00 - 03:00:00",
  "03:00:00 - 03:30:00",
  "03:30:00 - 04:00:00",
  "04:00:00 - 04:30:00",
  "04:30:00 - 05:00:00",
  "05:00:00 - 05:30:00",
  "05:30:00 - 06:00:00",
];

export const timeIntervalFields2 = [
  "06:00:00 - 06:30:00",
  "06:30:00 - 07:00:00",
  "07:00:00 - 07:30:00",
  "07:30:00 - 08:00:00",
  "08:00:00 - 08:30:00",
  "08:30:00 - 09:00:00",
  "09:00:00 - 09:30:00",
  "09:30:00 - 10:00:00",
  "10:00:00 - 10:30:00",
  "10:30:00 - 11:00:00",
  "11:00:00 - 11:30:00",
  "11:30:00 - 12:00:00",
];

export const timeIntervalFields3 = [
  "12:00:00 - 12:30:00",
  "12:30:00 - 13:00:00",
  "13:00:00 - 13:30:00",
  "13:30:00 - 14:00:00",
  "14:00:00 - 14:30:00",
  "14:30:00 - 15:00:00",
  "15:00:00 - 15:30:00",
  "15:30:00 - 16:00:00",
  "16:00:00 - 16:30:00",
  "16:30:00 - 17:00:00",
  "17:00:00 - 17:30:00",
  "17:30:00 - 18:00:00",
];

export const timeIntervalFields4 = [
  "18:00:00 - 18:30:00",
  "18:30:00 - 19:00:00",
  "19:00:00 - 19:30:00",
  "19:30:00 - 20:00:00",
  "20:00:00 - 20:30:00",
  "20:30:00 - 21:00:00",
  "21:00:00 - 21:30:00",
  "21:30:00 - 22:00:00",
  "22:00:00 - 22:30:00",
  "22:30:00 - 23:00:00",
  "23:00:00 - 23:30:00",
  "23:30:00 - 24:00:00",
];

