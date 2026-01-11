import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
export interface Room {
  id: string;
  name: string;
  roomType: string;
  price: number;
  available: boolean;
}
export interface Images
{
  id: string;
  url: string;
  thumbnails: string;
}
export interface Amenities
{
  id: string;
  name: string;
  count: number;
}
export interface BranchHotel {
  id: string;
  hotelId: string;
  address: string;
  city: string;
  street: string;
  rating: number;
  description:string
  rooms: Room[];
  images: Images[]
  amenities:Amenities[]

  hotel: { id: string; name: string };
}
export function fetchHotelDetails(
  id: string,
  opts?: { checkIn?: DOMStringList, checkOut?: string, type?: string }
):Promise<BranchHotel>
{
  return axios.get(`/api/hotels/${id}`, {
    params:opts
  }).then(res=>res.data)
}
export function useHotelDetails(
  id: string,
  opts?: { checkIn?: string; checkOut?: string; type?: string }
)
{
  return useQuery<BranchHotel>({
    queryKey: ["hotel", id, opts],
    queryFn: () => fetchHotelDetails(id,opts),
    enabled:Boolean(id)
  })
}
