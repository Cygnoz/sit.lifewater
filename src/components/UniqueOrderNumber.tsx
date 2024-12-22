// Utility to generate a unique order number
const UniqueOrderNumber = (orderResponse: any[], prefix: string = "ORD"): string => {
    // Find the highest existing order number
    const maxOrderNumber = orderResponse
        .map((order) => {
            const match = order.orderNumber.match(new RegExp(`^${prefix}-(\\d+)$`)); // Extract numeric part
            return match ? parseInt(match[1], 10) : 0; // Convert to a number, or 0 if invalid
        })
        .reduce((max, current) => Math.max(max, current), 0); // Get the maximum

    // Increment the highest order number
    const newOrderNumber = maxOrderNumber + 1;

    // Return the new order number with the prefix
    return `${prefix}-${newOrderNumber.toString().padStart(5, "0")}`; // Ensures 5-digit format
};

export default UniqueOrderNumber;
