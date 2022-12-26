import { Module } from "@nestjs/common";
import { DbService } from "src/dbService/db.service";
import { BookModuleBase } from "./base/book.module.base";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { BookResolver } from "./book.resolver";

@Module({
  imports: [BookModuleBase],
  controllers: [BookController],
  providers: [BookService, BookResolver, DbService],
  exports: [BookService],
})
export class BookModule {}
