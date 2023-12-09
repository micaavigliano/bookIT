import {
  deleteRoom,
  updateRoom,
} from "../../../../backend/controllers/roomControllers";
import dbConnect from "@/app/backend/config/dbConnects";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

dbConnect();

router.put(updateRoom);
router.delete(deleteRoom);

export async function PUT(req: NextRequest, ctx: RequestContext) {
  return router.run(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: RequestContext) {
  return router.run(req, ctx);
}
