// Utility to generate a unique order number
const UniqueOrderNumber = (orderResponse: any[], prefix: string = "ORD"): string => {
    // Extract all existing order numbers from the orderResponse
    const previouslyUsedOrderNumbers = new Set(
        orderResponse.map((order) => order.orderNumber) // Collect all order numbers into a Set
    );

    let orderNumber: string;

    // Generate a unique order number
    do {
        const randomNum = Math.floor(Math.random() * 90000) + 10000; // Generate a 5-digit random number
        orderNumber = `${prefix}-${randomNum}`; // Prefix with 'ORD' or custom prefix
    } while (previouslyUsedOrderNumbers.has(orderNumber)); // Ensure uniqueness

    return orderNumber;
};

export default UniqueOrderNumber;
