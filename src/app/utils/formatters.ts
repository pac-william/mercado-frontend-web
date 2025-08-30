export function formatPrice(price: number, locale: string = "pt-BR") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "BRL",
    }).format(price);
}