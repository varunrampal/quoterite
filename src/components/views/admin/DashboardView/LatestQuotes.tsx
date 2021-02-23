import React from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { IQuote } from '../../../../types/appTypes';

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

interface IProps {

    className?:string,
    quotes: IQuote[]
}

const LatestQuotes:React.FC<IProps> = ({ className,quotes,...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Latest Quotes" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Quote Ref
                </TableCell>
                <TableCell>
                  Customer
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip
                    enterDelay={300}
                    title="Sort"
                  >
                    <TableSortLabel
                      active
                      direction="desc"
                    >
                      Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow
                  hover
                  key={quote.id}
                >
                  <TableCell>
                    {quote.id}
                  </TableCell>
                  <TableCell>
                    {quote.customerName}
                  </TableCell>
                  <TableCell>
                    {quote.customerEmail}
                  </TableCell>
                  <TableCell>
                    {quote.customerPhone}
                  </TableCell>
                  <TableCell>
                   {quote.createDate}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color="primary"
                      label={quote.status}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

export default LatestQuotes;
