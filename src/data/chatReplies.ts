// Хуурамч хариулт. Жинхэнэ AI холбосон үед энэ файл хэрэггүй болно.
export function getFakeReply(text: string): string {
  if (text.toLowerCase().includes('үнэ')) {
    return 'Үнэ барааны карт дээр бий'
  }
  return 'Удахгүй жинхэнэ туслах холбогдоно'
}
