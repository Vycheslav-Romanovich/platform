import React from 'react';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { parseDate } from '../../lib/parseDate';
import { PaymentHistory } from '../../module/types';
import { chipColors } from './config';

type Props = {
  platformPaymentHistory: PaymentHistory[];
};

export const PaymentHistoryBlock: React.FC<Props> = ({ platformPaymentHistory }) => {
  const isMobile = useMediaQuery('(max-width:767px)');

  return (
    <TableContainer sx={{ borderTopRightRadius: 8, borderTopLeftRadius: 8 }}>
      <Table aria-label="simple table">
        <TableHead sx={{ backgroundColor: 'var(--Silver)', border: 0 }}>
          <TableRow
            sx={{
              '& th': {
                borderBottom: '1px solid var(--Sky)',
                padding: { md: '0 16px', xs: '0 10px' },
                height: '48px',
              },
            }}
          >
            <TableCell align="left">
              <Typography variant="h5m" sx={{ color: 'var(--L_Grey)' }}>
                Date
              </Typography>
            </TableCell>

            <TableCell align="left">
              <Typography variant="h5m" sx={{ color: 'var(--L_Grey)' }}>
                Amount
              </Typography>
            </TableCell>

            <TableCell align="left">
              <Typography variant="h5m" sx={{ color: 'var(--L_Grey)' }}>
                State
              </Typography>
            </TableCell>

            <TableCell align="left">
              <Typography variant="h5m" sx={{ color: 'var(--L_Grey)' }}>
                Details
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {platformPaymentHistory.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                '& tr, & td': {
                  borderBottom: '1px solid var(--Sky)',
                  padding: { md: '0 16px', xs: '0 10px' },
                  height: '48px',
                },
              }}
            >
              <TableCell align="left">
                <Typography
                  variant={isMobile ? 'body3' : 'body2'}
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {parseDate(item.orderCustomerTime)}
                </Typography>
              </TableCell>

              <TableCell align="left">
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                  {`${item.price} ${item.currencyCode}`}
                </Typography>
              </TableCell>

              <TableCell align="left">
                <Chip
                  label={
                    <Typography
                      variant="body3"
                      sx={{
                        color: chipColors[item.orderStatus].textColor,
                        lineHeight: '20px',
                      }}
                    >
                      {item.orderStatus}
                    </Typography>
                  }
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: chipColors[item.orderStatus].bgc,
                    '& span': { padding: 0 },
                    height: 'fit-content',
                    padding: '2px 7px',
                  }}
                />
              </TableCell>

              <TableCell align="left" sx={{ minWidth: '200px' }}>
                <Typography variant="body2" sx={{ color: 'var(--Grey)' }}>
                  {item.subscriptionType}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
