import { useMemo } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { SummaryCard } from "@/components/SummaryCard.tsx";

import { useBudgetOverview } from "@/hooks/useBudgetOverview.tsx";
import { DashboardCard } from "@/components/DashboardCard";
import { formatCurrency } from "@/utils/formatCurrency";
import { PieChart, pieClasses } from "@mui/x-charts/PieChart";
import type { ChartsLabelCustomMarkProps } from "@mui/x-charts/ChartsLabel";
import { Gauge } from "@mui/x-charts/Gauge";
import { BarChart, barClasses } from "@mui/x-charts/BarChart";
import type { SvgIconComponent } from "@mui/icons-material";

export const Reports = () => {
  const { kpiData, categoryProgressOverview, expensesProgressValue } = useBudgetOverview();

  const createLegendIcon = (Icon: SvgIconComponent) => {
    return ({ className, color }: ChartsLabelCustomMarkProps) => (
      <Icon
        className={className}
        sx={{ color: color, display: "block", width: "100%", height: "100%" }}
      />
    );
  };

  const pieChartCategoryData = useMemo(() => (
    categoryProgressOverview ?? []).map((i) => ({
        label: i.label,
        value: i.percentage,
        labelMarkType: i.Icon ? createLegendIcon(i.Icon) : undefined,
      })),
    [categoryProgressOverview],
  );

  const barChartCategoryData = useMemo(() => (
    categoryProgressOverview ?? []).map((i) => ({
        label: i.label,
        value: i.amount,
      })),
    [categoryProgressOverview],
  );

  return (
    <Container maxWidth="xl" sx={{ mb: 2 }}>
      <Grid container spacing={3} sx={{ mt: 3, alignItems: "stretch" }}>
        {kpiData.map((i) => (
          <Grid
            key={i.title}
            size={{ xs: 12, md: 6, lg: 3 }}
            sx={{ display: "flex", minWidth: 0 }}
          >
            <SummaryCard title={i.title} value={i.value} description={i.description} icon={i.icon} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ mt: 3, alignItems: "stretch" }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", minWidth: 0 }}>
          <DashboardCard>
            <Typography variant="h6" sx={{ color: "var(--color-text-main)", fontWeight: 600 }} >
              Expenses by category
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-text-secondary)", mb: 2 }} >
              Share of monthly income spent in each category.
            </Typography>
            <Box sx={{ width: "100%", height: "auto" }}>
              <PieChart
                series={[
                  {
                    paddingAngle: 2,
                    innerRadius: "50%",
                    outerRadius: "90%",
                    data: pieChartCategoryData,
                    valueFormatter: (item) => `${item.value}%`,
                    arcLabel: (item) => `${item.value}%`,
                    arcLabelMinAngle: 20,
                  },
                ]}
                sx={{
                  [`& .${pieClasses.arcLabel}`]: {
                    fill: "white",
                    fontSize: "14px",
                  },
                }}
                slotProps={{
                  legend: {
                    sx: {
                      "& .MuiChartsLegend-series": {
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "16px",
                      },

                      "& .MuiChartsLegend-mark": {
                        width: 20,
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      },

                      "& .MuiChartsLabel-root": {
                        lineHeight: "20px",
                      },
                    },
                  },
                }}
                height={300}
              />
            </Box>
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <DashboardCard>
            <Typography variant="h6" sx={{ color: "var(--color-text-main)", fontWeight: 600 }} >
              Budget usage
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-text-secondary)", mb: 2 }}>
              Monthly expenses as a share of your income
            </Typography>
            <Box sx={{ width: "100%", height: "auto", display: "flex", alignItems: "center", justifyContent: "center", }} >
              <Gauge
                startAngle={-110}
                endAngle={110}
                value={expensesProgressValue}
                innerRadius="80%"
                outerRadius="100%"
                width={300}
                height={300}
                text={({ value }) => `${value}% of income`}
              />
            </Box>
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: "flex" }}>
          <DashboardCard>
            <Typography variant="h6" sx={{ color: "var(--color-text-main)", fontWeight: 600 }}>
              Amount spent by category
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-text-secondary)", mb: 2 }}>
              Total amount spent in each category this month.
            </Typography>
            <Box sx={{ width: "100%", minHeight: "300px" }}>
              <BarChart
                series={[
                  {
                    data: barChartCategoryData.map((item) => item.value),
                    label: "Spent amount",
                    color: "#78909c",
                    barLabel: (item) => item?.value == null ? undefined : formatCurrency(item.value),
                    valueFormatter: (value) => value == null ? "" : formatCurrency(value), },
                ]}
                yAxis={[
                  {
                    width: 90,
                    scaleType: "band",
                    data: barChartCategoryData.map((item) => item.label),
                  },
                ]}
                height={300}
                layout="horizontal"
                sx={{
                  [`& .${barClasses.label}`]: {
                    fill: "white",
                    fontSize: "14px",
                  },
                  [`& .${barClasses.element}`]: {
                    fill: "#78909c",
                  },
                }}
              />
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Container>
  );
};
