import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

export type JWTBody = {
    userId: number
  }
  
export type RequestWithJWTBody = Request & {
    jwtBody?: JWTBody
  }

export const authenticationMiddleware: RequestHandler = async (req: RequestWithJWTBody, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      // Throws error if invalid token
      const jwtBody = jwt.verify(token || '', process.env.ENCRYPTION_KEY!!) as JWTBody;
      req.jwtBody = jwtBody;
    } catch (error) {
      console.log("Failed Token Validation");
    }
  }
  next();
}