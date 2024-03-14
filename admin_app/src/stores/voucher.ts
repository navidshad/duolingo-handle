import { COLLECTIONS, DB } from '@/static/database'
import type { VoucherType } from '@/views/voucher/types/voucher.type'
import { dataProvider } from '@modular-rest/client'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const voucherStore = defineStore('voucher', () => {
  const list = ref<VoucherType[]>([])
  const pagination = ref()

  async function getList() {
    const _pagination = await dataProvider.list<VoucherType>(
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

    pagination.value = _pagination

    return _pagination.fetchPage(1).then((data) => (list.value = data))
  }

  return { list, pagination, getList }
})
