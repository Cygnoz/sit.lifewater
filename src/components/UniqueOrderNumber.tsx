const UniqueOrderNumber = (orderResponse: any[], prefix: string = "ORD"): string => {
    // Determine the new order number based on the length of orderResponse
    const newOrderNumber = orderResponse.length + 1;

    // Return the new order number with the prefix in 5-digit format
    return `${prefix}-${newOrderNumber.toString().padStart(5, "0")}`;
};

export default UniqueOrderNumber;
