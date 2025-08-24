import { ResponsiveBar } from '@nivo/bar';
import React from 'react'
import { tokens } from '../theme';
import { Box, Typography, useTheme } from '@mui/material';

const BarChart = ({ data, metaData, isNonMediumScreen, isNonMobileScreen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);

  const customTooltip = ({ id, value, color }) => (
    <Box sx={{ backgroundColor: '#fff', borderRadius: '3px', p: '0.2rem 0.8rem', color: '#000' }} display='flex' justifyContent='space-between' alignItems='center'>
      <Box sx={{ backgroundColor: color, borderRadius: '2px', width: '15px', height: '15px', mr: '0.3rem' }} ></Box>
      <Typography variant='subtitle2' textAlign='center' >{id} - {Math.floor(value)}%</Typography>
    </Box >
  );

  return (
    <ResponsiveBar
      data={data}
      tooltip={customTooltip}
      theme={{
        tooltip: {
          basic: {
            color: '#000000'
          }
        },
        axis: {
          domain: {
            line: {
              stroke: colors.text
            }
          },
          legend: {
            text: {
              fill: colors.text,
            }
          },
          ticks: {
            line: {
              stroke: colors.text,
              strokeWidth: 1
            },
            text: {
              fill: colors.text
            }
          }
        },
        legends: {
          text: {
            fill: colors.text
          }
        }
      }}
      keys={metaData && metaData.keys}
      enableLabel={true}
      indexBy={metaData && metaData.indexBy}
      margin={{ top: 50, right: isNonMobileScreen ? 190 : 10, bottom: 50, left: isNonMobileScreen ? 50 : 35 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={metaData.colorTheme ? metaData.colors : { scheme: 'set1' }}
      borderColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            1.6
          ]
        ]
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={isNonMediumScreen ? {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 25,
        legend: metaData && metaData.legends.axisBottom,
        legendPosition: 'middle',
        legendOffset: 32,
        truncateTickAt: 0,
      } : null}
      axisLeft={{
        tickSize: 5,
        tickValues: 2,
        tickPadding: 5,
        tickRotation: 0,
        legend: isNonMobileScreen && metaData && metaData.legends.axisLeft,
        legendPosition: 'middle',
        legendOffset: -40,
        truncateTickAt: 0
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            10
          ]
        ]
      }}
      legends={
        isNonMobileScreen ? [
          {
            dataFrom: isNonMobileScreen && metaData && metaData.legends.dataForm,
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 80,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ] : []}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
    />
  )
}

export default BarChart
