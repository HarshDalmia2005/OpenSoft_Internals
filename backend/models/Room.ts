export interface Room {
  id: string;
  name: string;
  owner_id: string;
  access_code?: string;
  is_public: boolean;
  max_participants: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRoomDTO {
  name: string;
  owner_id: string;
  access_code?: string;
  is_public?: boolean;
  max_participants?: number;
}

export interface RoomParticipant {
  room_id: string;
  user_id: string;
  joined_at: Date;
  is_active: boolean;
}
