/*
//------------------------------------------------------------------------------ 
// This code was generated by Amplication. 
// 
// Changes to this file will be lost if the code is regenerated. 
//
// There are other ways to to customize your code, see this doc to learn more
// https://docs.amplication.com/docs/how-to/custom-code
//
//------------------------------------------------------------------------------
  */
import { PrismaService } from "nestjs-prisma";
import { Prisma, Book } from "@prisma/client";
import { PaginatedInterface } from "../../util/PaginatedInterface";
import { DbService } from "src/dbService/db.service";

export class BookServiceBase {
  constructor(protected readonly prisma: DbService) {}

  async count<T extends Prisma.BookFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BookFindManyArgs>
  ): Promise<number> {
    return this.prisma.book.count(args);
  }

  async findMany<T extends Prisma.BookFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BookFindManyArgs>
  ): Promise<PaginatedInterface<Book>> {
    const [data, totalCount] = await Promise.all([
      this.prisma.book.findMany(args),
      this.prisma.book.count({ where: { deletedAt: null } }),
    ]);

    return { paginatedResult: data, totalCount };
  }
  async findOne<T extends Prisma.BookFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.BookFindUniqueArgs>
  ): Promise<Book | null> {
    return this.prisma.book.findUnique(args);
  }
  async create<T extends Prisma.BookCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BookCreateArgs>
  ): Promise<Book> {
    return this.prisma.book.create<T>(args);
  }
  async update<T extends Prisma.BookUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BookUpdateArgs>
  ): Promise<Book> {
    return this.prisma.book.update<T>(args);
  }
  async delete<T extends Prisma.BookDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.BookDeleteArgs>
  ): Promise<Book> {
    return this.prisma.book.delete(args);
  }
}