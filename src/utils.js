export const toBrl = (value) => {
  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return brl.format(value);
};
