import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, SortingState, ColumnDef, FilterFn, getFilteredRowModel } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { RankFish } from 'src/services/fish'
import { RiSearch2Line } from 'react-icons/ri'
import 'src/styles/pages/home/tableRankFish.scss'
import { Overwrite, parseNumberFormatID } from 'src/helper'
import { rankItem } from '@tanstack/match-sorter-utils'
import RowTableRankFishSkeleton from './rowTableRankFishSkeleton'
import SortColumnTable from '../sortColumnTable'

interface RankFishProps {
    rankFish: RankFish[]
}

type RankFishTable = Overwrite<RankFish, {
    index: number
    last_price: string
    average_size: string
    average_price: string
}>

const TableRankFish = ({ rankFish }: RankFishProps) => {
    const [data, setData] = useState<RankFishTable[]>([])
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [sortRankFish, setSortRankFish] = useState<SortingState>([])
    const columns = useMemo<ColumnDef<RankFishTable>[]>(() => [
        {
            accessorKey: 'index',
            header: 'No',
            cell: info => (
                <div>
                    {info.getValue<number>()}
                </div>
            )
        },
        {
            accessorKey: 'id',
            header: 'Ikan',
            cell: info => info.getValue()
        },
        {
            accessorKey: 'last_price',
            header: 'Harga',
            cell: info => info.getValue()
        },
        {
            accessorKey: 'average_size',
            header: 'Ukuran Rata Rata',
            cell: info => info.getValue()
        },
        {
            accessorKey: 'average_price',
            header: 'Harga Rata Rata',
            cell: info => info.getValue()
        },
        {
            accessorKey: 'last_update',
            header: 'Update Terakhir',
            cell: info => info.getValue()
        },
    ], [])
    const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value)

        addMeta({
            itemRank,
        })

        return itemRank.passed
    }

    useEffect(() => {
        setData(rankFish.map((data, index) => ({
            ...data,
            index: index + 1,
            last_price: `Rp ${parseNumberFormatID(data.last_price)}`,
            average_size: `${data.average_size.toFixed(data.average_size % 1 === 0 ? 0 : 1)} cm`,
            average_price: `Rp ${parseNumberFormatID(parseFloat(data.average_price.toFixed(0)))}`
        })))
    }, [rankFish])

    const table = useReactTable<RankFishTable>({
        data,
        columns,
        filterFns: {
            fuzzyFilter
        },
        state: {
            sorting: sortRankFish,
            globalFilter
        },
        onSortingChange: setSortRankFish,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
    })

    return (
        <div className='wrap-table-rank-fish column'>
            <div className="header-table-rank-fish row">
                <div className="column">
                    <h1>Ikan Berkualitas</h1>
                    <p>Lihat harga dari ikan paling berkualitas</p>
                </div>
                <div className="search row">
                    <RiSearch2Line className='icon' />
                    <input type="text" placeholder='Cari ikan...' value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} />
                </div>
            </div>
            <div className="wrap-table-rank-fish-overflow">
                <table className='table-rank-fish' cellPadding={0}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        <div className="wrap-th" onClick={header.column.getToggleSortingHandler()}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            {{
                                                asc: <SortColumnTable down={true} />,
                                                desc: <SortColumnTable up={true} />,
                                            }[header.column.getIsSorted() as string] ?? <SortColumnTable />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className={cell.id.split('_')[1]}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {
                            !rankFish.length && (
                                <>
                                    <RowTableRankFishSkeleton />
                                    <RowTableRankFishSkeleton />
                                    <RowTableRankFishSkeleton />
                                    <RowTableRankFishSkeleton />
                                </>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TableRankFish