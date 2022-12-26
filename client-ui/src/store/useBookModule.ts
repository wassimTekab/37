import { BookUpdateInput, BookCreateInput, Book } from "./../../index";
import { defineStore } from "pinia";
import service from "@/service";
import { storeToRefs } from "pinia";
import { useBodyStore } from "@/store/useBodyModule";

interface IPagination {
  take: number;
  skip: number;
}
const { isLoading } = storeToRefs(useBodyStore());

export const useBookStore = defineStore("book-store", {
  state: () => {
    return {
      bookList: [] as Array<Book>,
      error: null as Object | any,
      book: null as Book | null,
      bookPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 3,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchBooks(payload: IPagination) {
      try {
        const { data } = await service.api.bookControllerFindMany({
          skip: payload.skip,
          take: payload.take,
        });
        this.bookList = data.paginatedResult;

        this.bookList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.bookPagination.total = data.totalCount;
        this.bookPagination = {
          ...this.bookPagination,
          skip: payload.skip,
          take: payload.take,
        };
        localStorage.setItem("take", payload?.take);
        this.error = null;
      } catch (err: any) {
        this.bookList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async deleteBook(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.bookControllerDelete(payload);
        this.bookList = this.bookList.filter((book) => book.id !== data.id);
        this.bookPagination.total--;
        isLoading.value = false;
        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        isLoading.value = false;
      } finally {
        isLoading.value = false;
      }
    },
    async editBook(payload: { data: BookUpdateInput; id: string }) {
      isLoading.value = true;
      try {
        const { data } = await service.api.bookControllerUpdate(
          payload.id,
          payload.data
        );
        this.bookList = this.bookList.map((item) =>
          item.id === payload.id ? { ...item, ...data } : item
        );
        this.error = null;
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async getBookById(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.bookControllerFindOne(payload);
        this.book = data;
        this.error = null;
      } catch (err: any) {
        this.book = null;
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async createBook(payload: BookCreateInput) {
      isLoading.value = true;
      try {
        const { data } = await service.api.bookControllerCreate(payload);
        this.bookList = [...this.bookList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
  },
});
