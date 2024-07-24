import millify from 'millify'

// Utility function to format numbers with millify and include a currency name
const numberConvert = (num: number = 0, currencyName: string = ''): string => {
  return num
    ? `${currencyName} ${millify(num, {
        units: ['', 'k', 'M', 'B', 'T'],
        space: true,
      })}`
    : '0'
}

export default numberConvert
