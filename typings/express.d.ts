declare namespace Express {
  export interface Request {
    userId?: string;
    cookies?: {
      "access-token"?: string;
      "refresh-token"?: string;
    };
  }
}
