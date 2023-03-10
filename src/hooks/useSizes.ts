import useSWR from 'swr'
import { fetcher } from 'src/helper'

interface SizeType {
    size: number
}

const useSizes = () => {
    const {data, ...res} = useSWR<any[]>('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/option_size', fetcher)
    const newData = data?.filter(data => {
        if (!(data.size && !isNaN(data.size))) return false
        return true                             
    })
    .map(data => {
        data.size = parseInt(data.size)
        return data
    })
    .reduce<SizeType[]>((prevData, data: SizeType) => prevData.find(({size}) => size === data.size) ? prevData : [...prevData, data], [])
    .sort((a, b) => a.size - b.size)

    return {data: newData, ...res}
}

export type {
    SizeType
}
export default useSizes