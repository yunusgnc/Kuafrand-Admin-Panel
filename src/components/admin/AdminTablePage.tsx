'use client'

import type { ReactNode } from 'react'
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Stack,
  Skeleton
} from '@mui/material'
import { RiSearchLine } from 'react-icons/ri'

type Column<T> = {
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  width?: number | string
}

type Props<T> = {
  title: string
  rows?: T[]
  isLoading: boolean
  columns: Column<T>[]
  actions?: (row: T) => ReactNode
  emptyText?: string
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  page: number
  rowsPerPage: number
  total: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  toolbar?: ReactNode
  idPrefix: string
}

export default function AdminTablePage<T>({
  title,
  rows,
  isLoading,
  columns,
  actions,
  emptyText = 'Veri bulunamadı',
  search,
  onSearchChange,
  searchPlaceholder = 'Ara',
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  toolbar,
  idPrefix
}: Props<T>) {
  const searchInputId = `${idPrefix}-search`
  const rowsPerPageLabelId = `${idPrefix}-rows-per-page-label`
  const rowsPerPageSelectId = `${idPrefix}-rows-per-page`

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        {title}
      </Typography>

      <Card>
        <Box sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems='center' justifyContent='space-between'>
            <TextField
              size='small'
              placeholder={searchPlaceholder}
              id={searchInputId}
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <RiSearchLine size={18} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{ minWidth: 240 }}
            />
            {toolbar}
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index} align={column.align} sx={{ width: column.width }}>
                    {column.header}
                  </TableCell>
                ))}
                {actions && <TableCell align='right'>İşlemler</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: columns.length + (actions ? 1 : 0) }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : rows?.map((row, rowIndex) => (
                    <TableRow key={rowIndex} hover>
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex} align={column.align}>
                          {column.render(row)}
                        </TableCell>
                      ))}
                      {actions && <TableCell align='right'>{actions(row)}</TableCell>}
                    </TableRow>
                  ))}
              {!isLoading && (!rows || rows.length === 0) && (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>{emptyText}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component='div'
          count={total}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
          labelRowsPerPage='Sayfa başına satır'
          SelectProps={{ id: rowsPerPageSelectId, labelId: rowsPerPageLabelId }}
        />
      </Card>
    </Box>
  )
}
