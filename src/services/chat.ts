import { getFakeReply } from '../data/chatReplies'

const DELAY_MS = 1000

// Жинхэнэ AI-д холбохдоо зөвхөн энэ функцийн биеийг солино.
// "алдаа" гэсэн үгтэй мессеж эхний удаа алдаа шиднэ (туршилтад зориулсан).
const failedOnce = new Set<string>()

export async function sendMessage(text: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
  if (text.toLowerCase().includes('алдаа') && !failedOnce.has(text)) {
    failedOnce.add(text)
    throw new Error('Холболт тасарлаа')
  }
  return getFakeReply(text)
}
