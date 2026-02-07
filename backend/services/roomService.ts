import sql from '../db';
import { Room, CreateRoomDTO, UpdateRoomDTO, RoomParticipant, InviteLink } from '../models/Room';
import crypto from 'crypto';

// Generate random access code for private rooms
export function generateAccessCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Generate invite link
export function generateInviteLink(roomId: string, accessCode?: string): InviteLink {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const params = accessCode ? `?code=${accessCode}` : '';
  
  return {
    room_id: roomId,
    join_url: `${baseUrl}/room/${roomId}${params}`,
    access_code: accessCode
  };
}

// Create a new room
export async function createRoom(ownerId: string, roomData: CreateRoomDTO): Promise<Room> {
  const accessCode = roomData.is_public === false 
    ? (roomData.access_code || generateAccessCode())
    : null;

  const [room] = await sql<Room[]>`
    INSERT INTO rooms (name, owner_id, access_code, is_public, max_participants)
    VALUES (
      ${roomData.name}, 
      ${ownerId}, 
      ${accessCode},
      ${roomData.is_public ?? true},
      ${roomData.max_participants ?? 10}
    )
    RETURNING *
  `;

  // Add owner as first participant
  await addParticipant(room.id, ownerId);

  return room;
}

// Get room by ID
export async function getRoomById(roomId: string): Promise<Room | null> {
  const [room] = await sql<Room[]>`
    SELECT * FROM rooms WHERE id = ${roomId}
  `;
  return room || null;
}

// Update room
export async function updateRoom(roomId: string, updateData: UpdateRoomDTO): Promise<Room | null> {
  const updates: Record<string, any> = {};
  
  if (updateData.name !== undefined) {
    updates.name = updateData.name;
  }
  if (updateData.is_public !== undefined) {
    updates.is_public = updateData.is_public;
  }
  if (updateData.access_code !== undefined) {
    updates.access_code = updateData.access_code;
  }
  if (updateData.max_participants !== undefined) {
    updates.max_participants = updateData.max_participants;
  }

  if (Object.keys(updates).length === 0) {
    return await getRoomById(roomId);
  }

  updates.updated_at = sql`CURRENT_TIMESTAMP`;

  const [room] = await sql<Room[]>`
    UPDATE rooms 
    SET ${sql(updates)}
    WHERE id = ${roomId}
    RETURNING *
  `;
  
  return room || null;
}

// Delete room
export async function deleteRoom(roomId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM rooms WHERE id = ${roomId}
  `;
  return result.count > 0;
}

// Add participant to room
export async function addParticipant(roomId: string, userId: string): Promise<RoomParticipant> {
  const [participant] = await sql<RoomParticipant[]>`
    INSERT INTO room_participants (room_id, user_id, is_active)
    VALUES (${roomId}, ${userId}, true)
    ON CONFLICT (room_id, user_id) 
    DO UPDATE SET is_active = true, joined_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return participant;
}

// Remove participant from room
export async function removeParticipant(roomId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE room_participants 
    SET is_active = false
    WHERE room_id = ${roomId} AND user_id = ${userId}
  `;
  return result.count > 0;
}

// Verify access code
export async function verifyAccessCode(roomId: string, accessCode?: string): Promise<boolean> {
  const [room] = await sql<{ access_code: string | null; is_public: boolean }[]>`
    SELECT access_code, is_public FROM rooms WHERE id = ${roomId}
  `;
  
  if (!room) return false;
  if (room.is_public) return true; // Public room, no code needed
  if (!room.access_code) return true; // No code set
  
  return room.access_code === accessCode;
}

// Check if room is full
export async function isRoomFull(roomId: string): Promise<boolean> {
  const [result] = await sql<{ current_count: string; max_participants: number }[]>`
    SELECT 
      COUNT(rp.user_id) as current_count,
      r.max_participants
    FROM rooms r
    LEFT JOIN room_participants rp ON r.id = rp.room_id AND rp.is_active = true
    WHERE r.id = ${roomId}
    GROUP BY r.id, r.max_participants
  `;
  
  if (!result) return false;
  return parseInt(result.current_count) >= result.max_participants;
}
