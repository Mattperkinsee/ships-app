'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RadialBar, RadialBarChart } from 'recharts';
import PropTypes from "prop-types"; 
import { useTheme } from '@mui/material/styles'; //

import { NoSsr } from '@/components/no-ssr';

export function AppLimits({ usage }) {
  const theme = useTheme();
  const chartSize = 240;
  console.log('usage', usage)
  const data = [
    { name: 'Empty', value: 100 },
    { name: 'Usage', value: usage },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <NoSsr fallback={<Box sx={{ height: `${chartSize}px` }} />}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            // hide the empty bar
            '& .recharts-layer path[name="Empty"]': { display: 'none' },
            '& .recharts-layer .recharts-radial-bar-background-sector': { fill: 'var(--mui-palette-neutral-100)' },
          }}
        >
          <RadialBarChart
            barSize={12}
            data={data}
            endAngle={-10}
            height={chartSize}
            innerRadius={166}
            startAngle={190}
            width={chartSize}
          >
            <RadialBar
              animationDuration={300}
              background
              cornerRadius={10}
              dataKey="value"
              endAngle={-320}
              fill={theme.palette.primary.main} 
              startAngle={20}
            />
          </RadialBarChart>
          <Box
            sx={{
              alignItems: 'center',
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              left: 0,
              position: 'absolute',
              right: 0,
              top: 0,
            }}
          >
            <Box sx={{ textAlign: 'center', mt: '-40px' }}>
              <Typography variant="h5">
                {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(usage / 100)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </NoSsr>
    </Box>
  );
}

AppLimits.propTypes = {
  usage: PropTypes.node.isRequired,
};
