/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'

interface EventBus {
  $emit(event: string, ...args: any[]): this;
  $on(event: string | string[], callback: Function): this;
  $once(event: string | string[], callback: Function): this;
  $off(event?: string | string[], callback?: Function): this;
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $bus: EventBus
  }
}
