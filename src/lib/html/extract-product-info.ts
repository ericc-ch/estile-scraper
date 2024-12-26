export interface ProductInfo {
  id: string
  title: string
  price: string
  shipping: string
  location: string
  condition: string
  link: string
  imageUrl: string
}

export function extractProductInfo($: cheerio.Root, element: cheerio.Element) {
  const productInfo: ProductInfo = {
    id: $(element).attr("id") ?? globalThis.crypto.randomUUID(),
    title: $(element).find(".s-item__title span").text().trim(),
    price: $(element).find(".s-item__price").text().trim(),
    shipping: $(element).find(".s-item__shipping").text().trim(),
    location: $(element).find(".s-item__location").text().trim(),
    condition: $(element)
      .find(".s-item__subtitle .SECONDARY_INFO")
      .text()
      .trim(),
    link: $(element).find(".s-item__link").attr("href") ?? "",
    imageUrl: $(element).find(".s-item__image-wrapper img").attr("src") ?? "",
  }

  return productInfo
}
