import { Router } from 'express';
import {
  createRoomHandler,
  getRoomHandler,
  updateRoomHandler,
  deleteRoomHandler,
  joinRoomHandler,
  leaveRoomHandler,
  generateInviteLinkHandler,
  verifyAccessHandler
} from '../controllers/roomController';
import { authenticateToken } from '../middleware/userMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Basic CRUD
router.post('/', createRoomHandler);                              // Create room
router.get('/:roomId', getRoomHandler);                           // Get room details
router.put('/:roomId', updateRoomHandler);                        // Update room
router.delete('/:roomId', deleteRoomHandler);                     // Delete room

// Room Access
router.post('/:roomId/join', joinRoomHandler);                    // Join room
router.post('/:roomId/leave', leaveRoomHandler);                  // Leave room
router.post('/:roomId/invite-link', generateInviteLinkHandler);   // Generate invite link
router.post('/:roomId/verify-access', verifyAccessHandler);       // Verify access code

export default router;
