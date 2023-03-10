import useSWR from 'swr'
import { fetcher } from 'src/helper'

interface FishType {
    uuid: string,
    komoditas: string,
    area_provinsi: string,
    area_kota: string,
    size: number,
    price: number,
    tgl_parsed: string,
    timestamp: number,
}

const useFishs = () => {
    const { data, ...res } = useSWR<any[]>('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list', fetcher)
    const newData: FishType[] | undefined = data?.filter(data => {
        if (!(data.uuid && data.komoditas && data.area_provinsi && data.area_kota && data.size && data.price && data.tgl_parsed && data.timestamp)) return false
        if (isNaN(data.size) || isNaN(data.price) || isNaN(data.timestamp)) return false
        return true
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(data => {
        data.size = parseInt(data.size)
        data.price = parseFloat(data.price)
        data.timestamp = parseInt(data.timestamp)
        return data
    })
    
    return { data: newData, ...res }
}

export type {
    FishType
}
export default useFishs