import {useMemo} from 'react'
import {Container, Grid, Stack, Typography} from "@mui/material";
import {SummaryCard} from "@/components/SummaryCard.tsx";

import {useBudgetOverview} from "@/hooks/useBudgetOverview.tsx";
import {DashboardCard} from "@/components/DashboardCard";
import { PieChart } from '@mui/x-charts/PieChart';
import type { ChartsLabelCustomMarkProps } from '@mui/x-charts/ChartsLabel';
import type { SvgIconComponent } from '@mui/icons-material';

export const Reports = () => {
  const {kpiData, categoryProgressOverview} = useBudgetOverview();

    const createLegendIcon = (Icon:SvgIconComponent) => {
        return ({ className, color }: ChartsLabelCustomMarkProps)=> (
                <Icon className={className}  sx={{color:  color, display: 'block', width: '100%', height: '100%',}} />
        );
    };

  const chartCategoryData = useMemo(()=>
      (categoryProgressOverview ?? []).map((i)=>({
          label: i.label,
          value: i.percentage,
          labelMarkType: createLegendIcon(i.Icon),
      })
  ),[categoryProgressOverview]);

  const size = {
    width: 300,
    height: 300,
  };



  return (
      <Container maxWidth="xl" sx={{mb:2}}>
        <Grid container spacing={3} sx={{mt: 3, alignItems: 'stretch' }} >
          {kpiData.map((i) => (
              <Grid key={i.title} size={{xs: 12, md: 6, lg: 3}} sx={{ display: 'flex', minWidth: 0 }} >
                <SummaryCard title={i.title} value={i.value} description={i.description} icon={i.icon}/>
              </Grid>
          ))}
        </Grid>
          <Grid container spacing={3} sx={{mt: 3, alignItems: 'stretch' }} >
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', minWidth: 0 }}>
                  <DashboardCard>
                      <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Expenses by category</Typography>
                      <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                          Share of total expenses.
                      </Typography>
                      <Stack sx={{width: '100%', height:'auto'}}>
                          <PieChart
                              series={[{
                                  paddingAngle: 5,
                                  innerRadius: '60%',
                                  outerRadius: '90%',
                                  data: chartCategoryData,
                              },]}
                              slotProps={{
                                  legend: {
                                      sx: {
                                          '& .MuiChartsLegend-series': {
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '8px',
                                              fontSize: '16px',
                                          },

                                          '& .MuiChartsLegend-mark': {
                                              width: 20,
                                              height: 20,
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              flexShrink: 0,
                                          },

                                          '& .MuiChartsLabel-root': {
                                              lineHeight: '20px',
                                          },
                                      },
                                  },
                              }}
                              {...size}
                          />
                      </Stack>

                  </DashboardCard>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                  <DashboardCard>
                      <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Budget usage</Typography>
                      <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                          Track how much of your budget has been used so far.
                      </Typography>

                  </DashboardCard>
              </Grid>
          </Grid>
      </Container>
  )
}
