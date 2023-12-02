export function longestSequenceOfOnes(array: number[]): number {
  let count = 0 // Counter for the current sequence of ones
  let maxCount = 0 // Counter for the longest sequence of ones found

  for (let i = 0; i < array.length; i++) {
    if (array[i] === 1) {
      count++ // Increment the counter if encountering a 1
      if (count > maxCount) {
        maxCount = count // Update the maximum if needed
      }
    } else {
      count = 0 // Reset the counter if encountering a 0
    }
  }

  return maxCount
}
