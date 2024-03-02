/**
 * Function to create a unique identifier for a direct message
 * @param {number} senderId - The ID of the sender
 * @param {number} receiverId - The ID of the receiver
 * @returns {string} - The unique identifier for the direct message
 */
export function createDmIdentifier(
  senderId: number,
  receiverId: number,
): string {
  return [senderId, receiverId].sort().join("_");
}
