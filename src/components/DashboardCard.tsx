import React from 'react'
import { Paper} from "@mui/material";

type DashboardCardProps = {
    children: React.ReactNode;
}

export const DashboardCard = ({ children }: DashboardCardProps) => {
  return (
    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
        {children}
    </Paper>
  )
}
