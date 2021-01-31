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
    makeStyles,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { IQuote } from '../../../../types/appTypes';

const useStyles = makeStyles(() => ({
    root: {},
    actions: {
        justifyContent: 'flex-end',
    },
}));

interface IProps {
    className?: string;
    quotes: IQuote[];
}

const LatestQuotes: React.FC<IProps> = ({ className, quotes, ...rest }) => {
    const classes = useStyles();

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader title="Latest Quotes" />
            <Divider />
            <PerfectScrollbar>
                <Box minWidth={800}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Quote Ref</TableCell>
                                <TableCell sortDirection="desc">
                                    <Tooltip enterDelay={300} title="Sort">
                                        <TableSortLabel active direction="desc">
                                            Date
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotes.length > 0 ? (
                                quotes.map((quote) => (
                                    <TableRow hover key={quote.id}>
                                        <TableCell>{quote.id}</TableCell>

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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        No record found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            {quotes.length > 0 ? (
              <Box display="flex" justifyContent="flex-end" p={2}>
              <Button
                  color="primary"
                  endIcon={<ArrowRightIcon />}
                  size="small"
                  variant="text"
              >
                  View all
              </Button>
          </Box>

            ):(
              <Box display="flex" justifyContent="flex-end" p={2}></Box>
            )
            
        }
        </Card>
    );
};

export default LatestQuotes;
