export interface ExamVoucher {
  _id: string
  remainingExams: number
  machineId: string
}

export interface VoucherType {
  _id?: string
  email: string
  examVouchers?: ExamVoucher[]
}
