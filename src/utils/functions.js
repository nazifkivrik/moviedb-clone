export function GroupBy(array, objKey) {
  let reduced = array.reduce((obj, item) => {
    if (obj[item[objKey]]) {
      obj[item[objKey]].push(item)
    } else {
      obj[item[objKey]] = [item]
    }
    return obj
  }, {})

  return reduced
}
export function iso8601(duration) {
  let hour, minute, second
  if (duration.includes('H')) {
    hour = duration.substring(duration.indexOf('T') + 1, duration.indexOf('H'))
    minute = duration.substring(duration.indexOf('H') + 1, duration.indexOf('M'))
    second = duration.substring(duration.indexOf('M') + 1, duration.indexOf('S'))

    return hour + ':' + minute + ':' + second
  } else if (!duration.includes('H') && duration.includes('M')) {
    minute = duration.substring(duration.indexOf('T') + 1, duration.indexOf('M'))
    second = duration.substring(duration.indexOf('M') + 1, duration.indexOf('S'))
    return minute + ':' + second
  } else {
    second = duration.substring(duration.indexOf('T') + 1, duration.indexOf('S'))
    return '0:' + second
  }
}

export function minuteToFull(minute) {
  if (minute) {
    return Math.floor(minute / 60) + 'h ' + (minute % 60) + 'm'
  } else return '-'
}
/**
 * Sorts object array with specified object key
 * @param {arr} arr object Array
 * @param {objKey} objKey Sort by object key
 * @returns
 */
export function SortBy(arr, objKey) {
  function sortFunc(a, b) {
    if (a[objKey] < b[objKey]) {
      return 1
    }
    if (a[objKey] > b[objKey]) {
      return -1
    }
    return 0
  }
  if (arr) {
    arr.sort(sortFunc)
  }

  return arr
}
/**
 * filter object array with specified keys and filters
 * @param {objectArray} objectArray
 * @param {filterArray} filterArray
 * @param {objKey} objKey
 * @returns
 */
export function filterObjectArray(objectArray, filterArray, objKey) {
  let arr = new Array()
  objectArray.map((item) =>
    filterArray.forEach((filter) =>
      item[objKey] === filter ? arr.push({ ...item, [objKey]: item[objKey] }) : ''
    )
  )
  return arr
}

export function ageCalculator(birthdate) {
  const today = new Date()
  const birthday = new Date(birthdate)
  const age =
    today.getFullYear() -
    birthday.getFullYear() -
    (today.getMonth() < birthday.getMonth() ||
      (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate()))
  return age
}

export function getRandomColor() {
  var letters = '01234567'.split('')
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color
}

export function sortObjByKeys(unorderedObj) {
  const ordered = Object.keys(unorderedObj)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unorderedObj[key]
      return obj
    }, {})
  return ordered
}
