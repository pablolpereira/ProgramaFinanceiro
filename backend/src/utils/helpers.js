export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

export const calculatePercentage = (part, total) => {
  if (total === 0) return 0
  return (part / total) * 100
}

export const sum = (array, property) => {
  return array.reduce((acc, obj) => acc + parseFloat(obj[property] || 0), 0)
}
