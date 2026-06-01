//import React from 'react'
import { Container, Grid } from "@mui/material";
import {SummaryCard} from "@/components/SummaryCard.tsx";

import {useBudgetOverview} from "@/hooks/useBudgetOverview.tsx";

export const Reports = () => {
  const {kpiData} = useBudgetOverview();
  return (
      <Container maxWidth="xl" sx={{mb:2}}>
        <Grid container spacing={3} sx={{mt: 3, alignItems: 'stretch' }} >
          {kpiData.map((i) => (
              <Grid key={i.title} size={{xs: 12, md: 6, lg: 3}} sx={{ display: 'flex', minWidth: 0 }} >
                <SummaryCard title={i.title} value={i.value} description={i.description} icon={i.icon}/>
              </Grid>
          ))}
        </Grid>
      </Container>
  )
}
