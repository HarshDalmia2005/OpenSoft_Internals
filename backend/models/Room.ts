export interface Room {
  id: string;
  name: string;
  owner_id: string;
  access_code?: string;
  is_public: boolean;
  max_participants: number;
  canvas_snapshot?: Buffer;  // Yjs binary state
  created_at: Date;
  updated_at: Date;
}

export interface CreateRoomDTO {
  name: string;
  is_public?: boolean;
  access_code?: string;
  max_participants?: number;
}

export interface UpdateRoomDTO {
  name?: string;
  is_public?: boolean;
  access_code?: string;
  max_participants?: number;
}

export interface RoomParticipant {
  room_id: string;
  user_id: string;
  joined_at: Date;
  is_active: boolean;
}

export interface InviteLink {
  room_id: string;
  join_url: string;
  access_code?: string;
}
