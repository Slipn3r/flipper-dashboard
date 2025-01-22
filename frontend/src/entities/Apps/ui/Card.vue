<template>
  <div tabindex="0" class="card cursor-pointer" @click="onClick">
    <div class="card__wrapper">
      <div class="card__image-wrapper bg-primary q-mb-sm q-pa-xs">
        <q-img
          class="card__image"
          :src="currentVersion.screenshots[0]"
          :ratio="256 / 128"
          spinner-color="primary"
          spinner-size="82px"
        />
      </div>
      <div class="row justify-between no-wrap full-width">
        <p class="col text-h6 q-ma-none q-mr-xs ellipsis">
          {{ currentVersion.name }}
        </p>
        <div class="col-shrink row items-center no-wrap">
          <!-- <div
            class="q-mr-sm"
            style="background-color: blue; width: 14px; height: 14px"
          ></div> -->
          <q-icon
            v-show="getCategoryIcon"
            class="q-mr-sm"
            :name="`img:${getCategoryIcon}`"
            size="14px"
          />
          <span class="q-ma-none">
            {{ getCategoryName }}
          </span>
        </div>
      </div>
      <div class="row justify-between items-end no-wrap">
        <p
          class="col card__description text-grey-7 text-caption q-ma-none q-mr-xs ellipsis-2-lines"
        >
          {{ currentVersion.shortDescription }}
        </p>
        <div class="col-shrink card__button-wrapper">
          <slot name="button" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { CategoryModel } from 'entity/Category'
import { App } from '../model/types'

type Props = Pick<App, 'alias' | 'currentVersion' | 'categoryId'>

const props = defineProps<Props>()

const emit = defineEmits(['click'])

const store = CategoryModel.useCategoriesStore()
const categories = computed(() => store.categories)

const getCategoryIcon = computed(
  () => categories.value?.find((e) => e.id === props.categoryId)?.iconUri
)
const getCategoryName = computed(
  () => categories.value?.find((e) => e.id === props.categoryId)?.name
)

const onClick = () => {
  emit('click', props.alias)
}
</script>

<style scoped lang="scss">
@import 'styles';
</style>
