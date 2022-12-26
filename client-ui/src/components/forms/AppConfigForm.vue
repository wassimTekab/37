<template>
  <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
    <el-form-item label="value" prop="value">
      <el-input v-model="form.value" />
    </el-form-item>
    <el-form-item label="key" prop="key">
      <el-input v-model="form.key" />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button @click="resetForm(ruleFormRef)">Cancel</el-button>
      <el-button type="primary" @click="onSubmit(ruleFormRef)"
        >Create</el-button
      >
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { supabase } from "@/core/services/SupabaseClientService";
import { useAppConfigStore } from "@/store/useAppConfigModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
const props = defineProps({
  isEdit: { type: Boolean, default: false },
});

const { appconfig, error } = storeToRefs(useAppConfigStore());
const {
  getAppConfigById,
  createAppConfig,
  editAppConfig,
} = useAppConfigStore();
const route = useRoute();
const router = useRouter();
const initialState = { value: "", key: "" };
const form = reactive({ ...initialState });
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
  value: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  key: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
});

const handleSubmitForm = async () => {
  if (props.isEdit) {
    const id = route?.params?.id as string;
    return await editAppConfig({ data: form, id });
  } else await createAppConfig(form);
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else router.push({ name: "list-appconfig" });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  Object.assign(form, initialState);
  formEl.resetFields();
};
const getCurrentAppConfig = async (id: string) => {
  if (props.isEdit) {
    await getAppConfigById(id);
  }
};

onMounted(async () => {
  const id = route.params.id as string;

  await getCurrentAppConfig(id);
  if (!!appconfig.value && props.isEdit) {
    ["value", "key"].forEach((item) => {
      form[item] = appconfig.value[item];
    });
  }
});
</script>
