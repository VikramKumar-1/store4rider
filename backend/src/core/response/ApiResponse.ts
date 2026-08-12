import { NextResponse } from "next/server";
import { IApiResponse, IPaginatedResponse } from "@store4riders/shared-types";

/**
 * Standardized API response builder.
 */
export class ApiResponse {
  /**
   * Returns a success response.
   */
  static success<T>(data: T, message: string = "Success", statusCode = 200): NextResponse {
    const response: IApiResponse<T> = {
      success: true,
      data,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * Returns a paginated success response.
   */
  static paginated<T>(items: T[], totalCount: number, page: number, limit: number): NextResponse {
    const totalPages = Math.ceil(totalCount / limit);
    const data: IPaginatedResponse<T> = { items, totalCount, page, limit, totalPages };
    return this.success(data, "Fetched successfully");
  }

  /**
   * Returns an error response.
   */
  static error(error: string, statusCode = 500): NextResponse {
    const response: IApiResponse<null> = {
      success: false,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: statusCode });
  }
}
