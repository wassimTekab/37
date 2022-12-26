import { ApiProperty } from "@nestjs/swagger";
import { Book } from "./Book";
export class getListBookDto {
  @ApiProperty({
    type: [Book],
  })
  readonly paginatedResult!: [Book];

  @ApiProperty({
    type: Number,
  })
  readonly totalCount!: number;
}
