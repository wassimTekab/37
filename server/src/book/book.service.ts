import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { DbService } from "src/dbService/db.service";
import { BookServiceBase } from "./base/book.service.base";

@Injectable()
export class BookService extends BookServiceBase {
  constructor(protected readonly prisma: DbService) {
    super(prisma);
  }
}
