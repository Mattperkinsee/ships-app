'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { RadialBar, RadialBarChart } from 'recharts';

import { NoSsr } from '@/components/no-ssr';

export function AppLimits({ usage }) {
  const chartSize = 240;

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
            barSize={24}
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
              fill="var(--mui-palette-primary-main)"
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
