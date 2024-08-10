import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        const start = Date.now();
        res.on('finish', () => {
          const { method, originalUrl } = req;
          const { statusCode } = res;
          const timeTaken = Date.now() - start;
          console.log(`${method} ${originalUrl} ${statusCode} ${timeTaken} ms`);
        });
        next();
      }
}