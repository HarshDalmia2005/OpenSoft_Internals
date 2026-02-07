import { Request, Response } from 'express';
import {
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  addParticipant,
  removeParticipant,
  verifyAccessCode,
  isRoomFull,
  generateInviteLink
} from '../services/roomService';
import { CreateRoomDTO, UpdateRoomDTO } from '../models/Room';

// POST /api/rooms - Create new room
export async function createRoomHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const roomData: CreateRoomDTO = req.body;

    if (!roomData.name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const room = await createRoom(userId, roomData);
    
    res.status(201).json({
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/rooms/:roomId - Get room details
export async function getRoomHandler(req: Request, res: Response) {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.user?.userId;

    const room = await getRoomById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Hide access code if not owner
    if (room.owner_id !== userId) {
      const { access_code, ...roomWithoutCode } = room;
      return res.json({ room: roomWithoutCode });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/rooms/:roomId - Update room
export async function updateRoomHandler(req: Request, res: Response) {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const room = await getRoomById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.owner_id !== userId) {
      return res.status(403).json({ error: 'Only the room owner can update the room' });
    }

    const updateData: UpdateRoomDTO = req.body;
    const updatedRoom = await updateRoom(roomId, updateData);

    res.json({
      message: 'Room updated successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/rooms/:roomId - Delete room
export async function deleteRoomHandler(req: Request, res: Response) {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const room = await getRoomById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.owner_id !== userId) {
      return res.status(403).json({ error: 'Only the room owner can delete the room' });
    }

    await deleteRoom(roomId);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/rooms/:roomId/join - Join room
export async function joinRoomHandler(req: Request, res: Response) {
  try {
    const roomId = req.params.roomId as string;
    const { access_code } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const room = await getRoomById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if room is full
    const roomFull = await isRoomFull(roomId);
    if (roomFull) {
      return res.status(403).json({ error: 'Room is full' });
    }

    // Verify access code for private rooms
    const isValid = await verifyAccessCode(roomId, access_code);
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid access code' });
    }

    const participant = await addParticipant(roomId, userId);

    res.json({
      message: 'Joined room successfully',
      participant
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/rooms/:roomId/leave - Leave room
export async function leaveRoomHandler(req: Request, res: Response) {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const room = await getRoomById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Prevent owner from leaving their own room
    if (room.owner_id === userId) {
      return res.status(403).json({ error: 'Room owner cannot leave. Delete the room instead.' });
    }

    await removeParticipant(roomId, userId);

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/rooms/:roomId/invite-link - Generate invite link
export async function generateInviteLinkHandler(req: Request, res: Response) {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const room = await getRoomById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.owner_id !== userId) {
      return res.status(403).json({ error: 'Only the room owner can generate invite links' });
    }

    const inviteLink = generateInviteLink(roomId, room.access_code || undefined);

    res.json({ inviteLink });
  } catch (error) {
    console.error('Generate invite link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/rooms/:roomId/verify-access - Verify access code
export async function verifyAccessHandler(req: Request, res: Response) {
  try {
    const roomId = req.params.roomId as string;
    const { access_code } = req.body;

    const isValid = await verifyAccessCode(roomId, access_code);

    res.json({ valid: isValid });
  } catch (error) {
    console.error('Verify access error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
