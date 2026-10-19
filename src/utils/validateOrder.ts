export interface OrderForm {
  name: string
  phone: string
  address: string
  date: string
}

export type OrderErrors = Partial<Record<keyof OrderForm, string>>

export function validateOrder(form: OrderForm, today: string): OrderErrors {
  const errors: OrderErrors = {}
  if (!form.name.trim()) errors.name = 'Нэрээ оруулна уу'
  if (!form.phone.trim()) errors.phone = 'Утасны дугаараа оруулна уу'
  else if (!/^\d{8}$/.test(form.phone.trim())) errors.phone = 'Утас 8 оронтой тоо байх ёстой'
  if (!form.address.trim()) errors.address = 'Хаягаа оруулна уу'
  if (!form.date) errors.date = 'Хүргэлтийн өдрөө сонгоно уу'
  else if (form.date < today) errors.date = 'Өнгөрсөн өдөр сонгох боломжгүй'
  return errors
}
