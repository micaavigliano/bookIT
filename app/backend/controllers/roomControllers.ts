import { NextRequest, NextResponse } from "next/server";
import Room, { IRoom } from "../models/room";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import APIFilters from "../utils/apiFilters";

//get all rooms
export const allRooms = catchAsyncError(async (req: NextRequest) => {
  const resPerPage: number = 4;
  //const rooms = await Room.find();
  const { searchParams } = new URL(req.url);
  const queryStr: any = {};

  searchParams.forEach((val, key) => {
    queryStr[key] = val;
  });

  const roomsCount: number = await Room.countDocuments();

  const apiFilters = new APIFilters(Room, queryStr).search().filter();

  let rooms: IRoom[] = await apiFilters.query;
  const filteredRoomsCount: number = rooms.length;

  apiFilters.pagination(resPerPage);
  rooms = await apiFilters.query.clone();

  return NextResponse.json({
    success: true,
    resPerPage,
    roomsCount,
    filteredRoomsCount,
    rooms,
  });
});

// create new room
export const newRoom = catchAsyncError(async (req: NextRequest) => {
  const body = await req.json();

  const room = await Room.create(body);

  return NextResponse.json({
    success: true,
    room,
  });
});

//get room details
export const getRoomDetails = catchAsyncError(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const room = await Room.findById(params.id);

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    return NextResponse.json({
      success: true,
      room,
    });
  }
);

//update room
export const updateRoom = catchAsyncError(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    let room = await Room.findById(params.id);
    const body = await req.json();

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    room = await Room.findByIdAndUpdate(params.id, body, { new: true });

    return NextResponse.json({
      success: true,
      room,
    });
  }
);

// delete room => /api/admin/rooms/:id
export const deleteRoom = catchAsyncError(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    let room = await Room.findById(params.id);

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    // todo delete images associated with the room
    await Room.deleteOne();

    return NextResponse.json({
      success: true,
      room,
    });
  }
);
