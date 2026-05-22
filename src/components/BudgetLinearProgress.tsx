//import React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
        }),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: 'var(--color-primary)',
        ...theme.applyStyles('dark', {
            backgroundColor: 'var(--color-primary)',
        }),
    },
}));

type LinearProgressProps = {
    progressValue: number;
}

export const BudgetLinearProgress = ({progressValue}:LinearProgressProps) => {
    return (
        <BorderLinearProgress
            variant="determinate"
            value={progressValue}
            aria-label="Export data"
        />
    );
};

