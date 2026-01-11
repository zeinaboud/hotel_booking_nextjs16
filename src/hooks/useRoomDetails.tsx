import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export async function fetchRoomById(roomId: string, hotelId: string) {
  return axios
    .get(`/api/hotels/${hotelId}/room/${roomId}`)
    .then(res => res.data);
}

const useRoomDetails = (roomId:string,hotelId:string) => {
  return useQuery({
    queryKey: ["room", roomId, hotelId],
    queryFn: () => fetchRoomById(roomId,hotelId),
    enabled: Boolean(roomId&& hotelId),
  })
}

export default useRoomDetails
