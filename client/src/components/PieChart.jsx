import React from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { tokens } from '../theme'
import { useTheme } from '@mui/material'

const PieChartComp = ({ data, width = 400, height = 300, isPercentage = false, cx = 150, cy = 150 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode,theme.palette.variantColor);
  return (
    <PieChart
      series={[
        {
          data: data,
          innerRadius: 30,
          outerRadius: 80,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 180,
          cx: cx,
          cy: cy,
          arcLabel: (item) => `${item.value}${isPercentage ? '%' : ''}`,
          arcLabelMinAngle: '45'
        }
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: colors.text,
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: '16px'
        },
      }}
      width={width}
      height={height}
    />
  )
}

export default PieChartComp
