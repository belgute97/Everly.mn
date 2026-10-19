export interface OrderForm {
  name: string
  phone: string
  address: string
  date: string
}

export type OrderErrors = Partial<Record<keyof OrderForm, string>>

// "9911 2233", "9911-2233" гэх мэтийг зөвшөөрч, зай, зураасыг хасна
export const normalizePhone = (phone: string) => phone.replace(/[\s-]/g, '')

export function validateField(key: keyof OrderForm, value: string, today: string): string | undefined {
  switch (key) {
    case 'name':
      return value.trim() ? undefined : 'Нэрээ оруулна уу'
    case 'phone': {
      const phone = normalizePhone(value)
      if (!phone) return 'Утасны дугаараа оруулна уу'
      return /^\d{8}$/.test(phone) ? undefined : 'Утас 8 оронтой тоо байх ёстой'
    }
    case 'address':
      return value.trim() ? undefined : 'Хаягаа оруулна уу'
    case 'date':
      if (!value) return 'Хүргэлтийн өдрөө сонгоно уу'
      return value < today ? 'Өнгөрсөн өдөр сонгох боломжгүй' : undefined
  }
}

export function validateOrder(form: OrderForm, today: string): OrderErrors {
  const errors: OrderErrors = {}
  for (const key of Object.keys(form) as (keyof OrderForm)[]) {
    const message = validateField(key, form[key], today)
    if (message) errors[key] = message
  }
  return errors
}
