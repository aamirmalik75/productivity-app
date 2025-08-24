import { useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line'
import { tokens } from '../theme';

const MyResponsiveLine = ({ data, isNonMediumScreen, isNonMobileScreen }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);

  return (
    <ResponsiveLine
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
              fill: colors.text
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
        },
        crosshair: {
          line: {
            stroke: theme.palette.background.default
          }
        }
      }}
      data={data}
      colors={data.map(d => d.color)}
      margin={{ top: 50, right: isNonMobileScreen ? 110 : 10, bottom: 50, left: isNonMobileScreen ? 60 : 35 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      yFormat=" >-"
      enableArea={false}
      axisTop={null}
      axisRight={null}
      axisBottom={isNonMediumScreen ? {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'TimeLine',
        legendOffset: 36,
        legendPosition: 'middle',
        truncateTickAt: 0
      } : null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickValues: 5,
        tickRotation: 0,
        legend: isNonMobileScreen && 'Counts',
        legendOffset: -40,
        legendPosition: 'middle',
        truncateTickAt: 0
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={isNonMobileScreen ? [
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ] : []}
    />
  )
};

export default MyResponsiveLine;
