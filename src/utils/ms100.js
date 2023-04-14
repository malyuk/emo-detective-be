import HMS from "@100mslive/server-sdk";
import * as dotenv from "dotenv";
dotenv.config();
// const hms = new HMS.SDK(process.env.HMS_ACCESS_KEY, process.env.HMS_SECRET);
const hms = new HMS.SDK(process.env.HMS_ACCESS_KEY, process.env.HMS_SECRET);

export const createRoom = async (roomName) => {
  const room = await hms.rooms.create({
    name: roomName,
    description: "",
    template_id: process.env.MS100_TEMPLATE_ID,
    region: process.env.MS100_REGION,
  });
  const roomCodesForRoom = await hms.roomCodes.create(room.id);
  let hostRoomCode,
    guestRoomCode = "";
  roomCodesForRoom.map((roomCode) => {
    if (roomCode.role === "host") {
      hostRoomCode = roomCode.code;
    }
    if (roomCode.role === "guest") {
      guestRoomCode = roomCode.code;
    }
  });
  return {
    hostRoomCode: hostRoomCode,
    guestRoomCode: guestRoomCode,
  };
};
