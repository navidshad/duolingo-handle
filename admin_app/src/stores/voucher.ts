import { COLLECTIONS, DB } from '@/static/database'
import type { VoucherType } from '@/views/voucher/types/voucher.type'
import { dataProvider } from '@modular-rest/client'
import type { PaginatedResponseType } from '@modular-rest/client/dist/types/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const voucherStore = defineStore('voucher', () => {
  const list = ref<VoucherType[]>([])
  const pagination = ref<PaginatedResponseType<VoucherType> | null>(null)

  async function getList() {
    pagination.value = await dataProvider.list<VoucherType>(
      {
        database: DB.exam,
        collection: COLLECTIONS.voucher,
        query: {},
        options: {
          sort: {
            _id: -1
          }
        }
      },
      {
        limit: 50,
        page: 1
      }
    )

    await pagination.value?.updatePagination()

    return pagination.value.fetchPage(1).then((data) => {
      list.value = data
    })
  }

  return { list, pagination, getList }
})
