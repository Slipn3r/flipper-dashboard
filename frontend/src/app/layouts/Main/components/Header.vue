<template>
  <q-header>
    <q-toolbar>
      <q-btn
        v-show="$q.screen.xs"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="emit('toggleLeftDrawer')"
      />

      <img
        v-show="!$q.screen.xs"
        src="~assets/flipper_lab_logo_monochrome.svg"
        class="q-ml-xs"
        style="height: 36px"
      />

      <q-space />

      <q-btn
        v-if="$q.screen.xs"
        @click="linksMenu = !linksMenu"
        icon="open_in_new"
        dense
        flat
        round
        class="q-ml-sm"
      >
        <q-menu fit>
          <q-list class="nav-links nav-links__black">
            <EssentialLink
              v-for="link in extLinks"
              :key="link.title"
              v-bind="link"
            />
          </q-list>
        </q-menu>
      </q-btn>
      <template v-else>
        <div class="nav-links">
          <a
            v-for="link in extLinks"
            :key="link.title"
            v-bind="link"
            :href="link.link"
            class="q-mx-sm"
          >
            {{ link.title }}
          </a>
        </div>
      </template>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref } from 'vue'
import { EssentialLink } from 'shared/components/EssentialLink'

const emit = defineEmits(['toggleLeftDrawer'])

const extLinks = [
  {
    title: 'Home',
    icon: 'mdi-home-outline',
    link: 'https://flipperzero.one/',
    blank: true,
    router: false
  },
  {
    title: 'Shop',
    icon: 'mdi-cart-outline',
    link: 'https://shop.flipperzero.one/',
    blank: true,
    router: false
  },
  {
    title: 'Docs',
    icon: 'mdi-book-open-variant',
    link: 'https://docs.flipperzero.one/',
    blank: true,
    router: false
  },
  {
    title: 'Blog',
    icon: 'mdi-newspaper-variant-outline',
    link: 'https://blog.flipperzero.one/',
    blank: true,
    router: false
  },
  {
    title: 'Forum',
    icon: 'mdi-forum-outline',
    link: 'https://forum.flipperzero.one/',
    blank: true,
    router: false
  }
]

const linksMenu = ref(false)
</script>

<style lang="scss" scoped>
.nav-links {
  a {
    color: #ffffff !important;
    text-decoration: none !important;
    font-size: 15px;
    font-weight: 500;

    &:hover {
      text-decoration: underline !important;
    }
  }

  &__black {
    a {
      color: #000000 !important;
    }
  }
}
</style>
