import formatDuration from 'format-duration'

// This component is for formatting our times and dates to be used in our songs in sonsTable component

// this function will take in a time in seconds (default to zero just in case)
export const formatTime = (timeInSeconds = 0) => {
  // whatever the time in seconds that you had, times 1,000 milliseconds
  return formatDuration(timeInSeconds * 1000)
}

// this function is going to take in a date object
export const formatDate = (date: Date) => {
  // how we want our date formatted
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
