<template>
  <div class="mx-auto mt-5 ms-4 me-4">
    <el-card shadow="never" class="card">
      <div class="header__wrapper">
        <div class="text-color">
          {{ $t("entityList.pagination.display") }}
          {{ bookPagination.total._count?._all }}
          {{ $t("entityList.pagination.items") }}
        </div>
        <div class="d-flex flex-column flex-sm-row align-items-center">
          <Pagination
            :itemsPerPage="bookPagination.take"
            :set-items-per-page="setItemsPerPage"
            :page="Math.floor(bookPagination.skip / bookPagination.take) + 1"
            :current-page-change="currentPageChange"
            :total="bookPagination.total._count?._all"
            :pages-array="[3, 6, 9, 12]"
          />
        </div>
      </div>
      <el-table
        :data="bookList"
        :row-style="{ background: '$primary' }"
        v-loading="isLoading"
        height="calc(100vh - 420px)"
      >
        <el-table-column :prop="'id'" :label="'id'">
          <template #default="scope">
            <router-link
              :to="`/${entityPluralName}/${bookList[scope.$index].id}`"
              >{{ bookList[scope.$index].id }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          v-for="fieldName in fieldsName"
          :key="fieldName"
          :prop="fieldName"
          :label="fieldName.charAt(0).toUpperCase() + fieldName.slice(1)"
        />
        <el-table-column prop="actions" align="right" width="150">
          <template #default="scope">
            <router-link
              :to="`/${entityPluralName}/edit/${bookList[scope.$index].id}`"
              :underline="false"
              type="primary"
              class="me-3"
            >
              <el-button icon="Edit" circle plain link type="success" />
            </router-link>

            <el-button
              @click="() => handleOpenConfirmModal(bookList[scope.$index]?.id)"
              icon="Delete"
              circle
              plain
              type="danger"
            />
            <ConfirmModal
              :title="$t('confirmModal.deleteTitle')"
              :isOpenModal="
                isOpenModal && modalId === bookList[scope.$index].id
              "
              @close-confirm-modal="
                isOpenModal = false;
                modalId = null;
              "
              @approve-confirm-modal="
                () => handleRemoveEntity(bookList[scope.$index]?.id)
              "
            >
              <span>{{ $t("confirmModal.deleteContent") }} </span>
            </ConfirmModal>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer__wrapper">
        <Pagination
          :itemsPerPage="bookPagination.take"
          :set-items-per-page="setItemsPerPage"
          :page="Math.floor(bookPagination.skip / bookPagination.take) + 1"
          :current-page-change="currentPageChange"
          :total="bookPagination.total._count?._all"
          :pages-array="[3, 6, 9, 12]"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineAsyncComponent } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import { storeToRefs } from "pinia";
import { useBookStore } from "@/store/useBookModule";
import Pagination from "@/components/shared/pagination/Pagination.vue";
import { useBodyStore } from "@/store/useBodyModule";

const ConfirmModal = defineAsyncComponent(
  () => import("@/components/modals/ConfirmModal.vue")
);
const entityPluralName = "books";
const fieldsName = ref(["title"]);
const isOpenModal = ref(false);
const modalId = ref<string | null>(null);
const { isLoading } = storeToRefs(useBodyStore());
const { bookList, bookPagination } = storeToRefs(useBookStore());
const { fetchBooks, deleteBook } = useBookStore();

const handleRemoveEntity = async (id: string) => {
  await deleteBook(id);
};
const handleOpenConfirmModal = (id: string) => {
  isOpenModal.value = true;
  modalId.value = id;
};
const setItemsPerPage = async (event: any) => {
  await fetchBooks({
    skip: 0,
    take: parseInt(event.target.value),
  });
};
const currentPageChange = async (val: number) => {
  await fetchBooks({
    skip: (val - 1) * bookPagination.value.take,
    take: bookPagination.value.take,
  });
};
onMounted(async () => {
  setCurrentPageBreadcrumbs(entityPluralName, []);
  await fetchBooks({
    skip: 0,
    take: bookPagination.value.take,
  });
  isLoading.value = false;
});
</script>

<style scoped lang="scss">
.header__wrapper {
  border-bottom: solid 1px $bd-card-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 20px;
  height: 76px;

  div {
    font-size: 0.875rem;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    height: auto;
    row-gap: 10px;
    padding-block: 10px;
    justify-content: unset;
  }
}
.footer__wrapper {
  border-top: solid 1px $bd-card-color;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-inline: 20px;
  height: 76px;
  margin-bottom: 0;
}
</style>
