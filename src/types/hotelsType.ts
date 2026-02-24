export interface RoomData {
  id: string;
  name: string;
  price: number;
  available: boolean;
  type: 'SINGLE' | 'DOUBLE' | 'SUITE';
}
export interface Image {
  id?: string;
  url: string;
  thumbnail?: string;
}
export interface BranchHotelSearch {
  id: string;
  hotelId: string;
  hotelName: string;
  city: string;
  address: string;
  rooms: RoomData[];
  rating: number;
  images: Image[];
}

export interface BranchSuggestion {
  id: string;
  hotelId: string;
  name: string;
  city: string;
  address: string;
  type: 'city' | 'hotel';
}

export interface searchParamsType {
  name: string;
  checkIn: string;
  checkOut: string;
  ratingGte: string;
  minPrice: string;
  maxPrice: string;
}

interface RoomItem {
  roomId: string;
  roomName: string;
  roomType: string;
  roomPrice: number;
  quantity: number;
}

interface BookingRequestData {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  nights: number;
  items: RoomItem[];
  branchId: string;
}
