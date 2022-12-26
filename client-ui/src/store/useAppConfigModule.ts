import {
  AppConfigUpdateInput,
  AppConfigCreateInput,
  AppConfig,
} from "./../../index";
import { defineStore } from "pinia";
import service from "@/service";
import { storeToRefs } from "pinia";
import { useBodyStore } from "@/store/useBodyModule";

interface IPagination {
  take: number;
  skip: number;
}
const { isLoading } = storeToRefs(useBodyStore());

export const useAppConfigStore = defineStore("appconfig-store", {
  state: () => {
    return {
      appconfigList: [] as Array<AppConfig>,
      error: null as Object | any,
      appconfig: null as AppConfig | null,
      appconfigPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 3,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchAppConfigs(payload: IPagination) {
      try {
        const { data } = await service.api.appConfigControllerFindMany({
          skip: payload.skip,
          take: payload.take,
        });
        this.appconfigList = data.paginatedResult;

        this.appconfigList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.appconfigPagination.total = data.totalCount;
        this.appconfigPagination = {
          ...this.appconfigPagination,
          skip: payload.skip,
          take: payload.take,
        };
        localStorage.setItem("take", payload?.take);
        this.error = null;
      } catch (err: any) {
        this.appconfigList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async deleteAppConfig(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerDelete(payload);
        this.appconfigList = this.appconfigList.filter(
          (appconfig) => appconfig.id !== data.id
        );
        this.appconfigPagination.total--;
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
    async editAppConfig(payload: { data: AppConfigUpdateInput; id: string }) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerUpdate(
          payload.id,
          payload.data
        );
        this.appconfigList = this.appconfigList.map((item) =>
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
    async getAppConfigById(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerFindOne(payload);
        this.appconfig = data;
        this.error = null;
      } catch (err: any) {
        this.appconfig = null;
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async createAppConfig(payload: AppConfigCreateInput) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerCreate(payload);
        this.appconfigList = [...this.appconfigList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
  },
});
