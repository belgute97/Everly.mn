export interface Sign {
  id: string
  name: string
  symbol: string
  element: string
  range: string // харуулах огнооны завсар
  from: [number, number] // [сар, өдөр] эхлэх
  traits: string
}

// Эхлэх огноогоор эрэмбэлсэн. Матар нь оны эхэнд болон төгсгөлд хоёр удаа орно
export const signs: Sign[] = [
  { id: 'capricorn', name: 'Матар', symbol: '♑', element: 'Шороо', range: '12/22 – 1/19', from: [12, 22], traits: 'Зорилготой, тэвчээртэй, хариуцлагатай.' },
  { id: 'aquarius', name: 'Усчин', symbol: '♒', element: 'Агаар', range: '1/20 – 2/18', from: [1, 20], traits: 'Бие даасан, шинийг эрэлхийлэгч, найрсаг.' },
  { id: 'pisces', name: 'Загас', symbol: '♓', element: 'Ус', range: '2/19 – 3/20', from: [2, 19], traits: 'Мэдрэмтгий, уран сэтгэмжтэй, энэрэнгүй.' },
  { id: 'aries', name: 'Хуц', symbol: '♈', element: 'Гал', range: '3/21 – 4/19', from: [3, 21], traits: 'Эрч хүчтэй, зоригтой, тэргүүлэх зан.' },
  { id: 'taurus', name: 'Үхэр', symbol: '♉', element: 'Шороо', range: '4/20 – 5/20', from: [4, 20], traits: 'Тогтвортой, ухаалаг, тав тухыг эрхэмлэгч.' },
  { id: 'gemini', name: 'Ихэр', symbol: '♊', element: 'Агаар', range: '5/21 – 6/20', from: [5, 21], traits: 'Сониуч, харилцаа сайтай, уян хатан.' },
  { id: 'cancer', name: 'Мэлхий', symbol: '♋', element: 'Ус', range: '6/21 – 7/22', from: [6, 21], traits: 'Халамжтай, гэр бүлч, өгөөмөр.' },
  { id: 'leo', name: 'Арслан', symbol: '♌', element: 'Гал', range: '7/23 – 8/22', from: [7, 23], traits: 'Өөртөө итгэлтэй, өгөөмөр, нөлөө бүхий.' },
  { id: 'virgo', name: 'Онгон', symbol: '♍', element: 'Шороо', range: '8/23 – 9/22', from: [8, 23], traits: 'Нягт нямбай, дүн шинжилгээ сайтай.' },
  { id: 'libra', name: 'Жин', symbol: '♎', element: 'Агаар', range: '9/23 – 10/22', from: [9, 23], traits: 'Тэнцвэрийг эрхэмлэгч, шударга, дипломат.' },
  { id: 'scorpio', name: 'Хилэнц', symbol: '♏', element: 'Ус', range: '10/23 – 11/21', from: [10, 23], traits: 'Хүчтэй зорилготой, нууцлаг, үнэнч.' },
  { id: 'sagittarius', name: 'Нум', symbol: '♐', element: 'Гал', range: '11/22 – 12/21', from: [11, 22], traits: 'Өөдрөг, аялах дуртай, чөлөөт сэтгэлгээтэй.' },
]

// "YYYY-MM-DD" -> орд. Огноог хэсэглэн задалж, цагийн бүсийн алдаанаас сэргийлнэ
export function signOf(birthday: string): Sign | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday)
  if (!m) return null
  const key = Number(m[2]) * 100 + Number(m[3])
  if (key < 120 || key >= 1222) return signs[0]
  let found = signs[1]
  for (const s of signs.slice(1)) {
    if (key >= s.from[0] * 100 + s.from[1]) found = s
  }
  return found
}

const animals = ['Хулгана', 'Үхэр', 'Бар', 'Туулай', 'Луу', 'Могой', 'Морь', 'Хонь', 'Бич', 'Тахиа', 'Нохой', 'Гахай']
// 1900 он бол Хулгана жил. Монголын жил Цагаан сараар солигддог ч энд календарийн оноор ойролцоолно
export const animalOf = (birthday: string) => animals[(((Number(birthday.slice(0, 4)) - 1900) % 12) + 12) % 12]

const ADVICE = {
  love: ['Хайртай хүнтэйгээ нээлттэй ярилцахад тохиромжтой өдөр.', 'Хуучин танилаас сайхан мэдээ ирж магадгүй.', 'Өөрийгөө эрхэмлэх нь харилцаанд эерэгээр нөлөөлнө.', 'Жижиг анхаарал халамж их утгатай байх болно.'],
  money: ['Том худалдан авалт хийхээс өмнө дахин тооцоол.', 'Хуримтлал хийхэд таатай өдөр.', 'Санаандгүй бага хэмжээний орлого гарч болно.', 'Төсвөө шинэчилж хараарай.'],
  work: ['Эхэлсэн ажлаа дуусгахад анхаар.', 'Багийн ажилд таны санал үнэлэгдэнэ.', 'Шинэ зүйл сурахад тохиромжтой цаг.', 'Тодорхой төлөвлөгөө гаргавал үр дүн гарна.'],
  health: ['Хангалттай ус уугаарай.', 'Богино алхалт ч сэтгэлийг сэргээнэ.', 'Эрт унтах нь маргаашийн эрч хүчийг нэмнэ.', 'Дасгалаа хэт ачаалахгүй байх нь зүйтэй.'],
}

const COLORS = ['Улаан', 'Хөх', 'Ногоон', 'Шар', 'Ягаан', 'Цагаан', 'Улбар шар', 'Хар']

// Орд, өдрөөс хамаарсан тогтмол санамсаргүй тоо: нэг өдөрт нэг хариулт
function hash(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export interface Reading {
  love: { stars: number; text: string }
  money: { stars: number; text: string }
  work: { stars: number; text: string }
  health: { stars: number; text: string }
  luckyNumber: number
  luckyColor: string
}

export function dailyReading(signId: string, date: string): Reading {
  const pick = (topic: keyof typeof ADVICE): { stars: number; text: string } => {
    const h = hash(`${signId}|${date}|${topic}`)
    return { stars: (h % 5) + 1, text: ADVICE[topic][(h >>> 3) % ADVICE[topic].length] }
  }
  const h = hash(`${signId}|${date}|lucky`)
  return {
    love: pick('love'),
    money: pick('money'),
    work: pick('work'),
    health: pick('health'),
    luckyNumber: (h % 9) + 1,
    luckyColor: COLORS[(h >>> 4) % COLORS.length],
  }
}
