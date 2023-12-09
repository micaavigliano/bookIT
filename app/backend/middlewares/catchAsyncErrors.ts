import { NextRequest, NextResponse } from "next/server";

type handlerFunct = (req: NextRequest, params: any) => Promise<NextResponse>;

interface IValidationError {
  message: string;
}

export const catchAsyncError =
  (handler: handlerFunct) => async (request: NextRequest, params: any) => {
    try {
      return await handler(request, params);
    } catch (error: any) {
      if (error?.name === "CastError") {
        error.message = `Resource not found. Invalid ${error?.path}`;
        error.statusCode = 400;
      }

      if (error?.name === "ValidationError") {
        error.message = Object.values<IValidationError>(error.errors).map(
          (val) => val.message
        );
        error.statusCode = 400;
      }

      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.statusCode || 500,
        }
      );
    }
  };
