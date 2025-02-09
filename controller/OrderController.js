const Order = require('../Models/OrderSchema');
const Customer = require('../Models/CustomerSchema')
const SubRoute = require('../Models/SubrouteSchema');
const Item = require('../Models/ItemSchema');
const moment = require('moment-timezone');
const Account = require('../Models/account');
const TrialBalance = require('../Models/trialBalance');

 
// exports.createOrder = async (req, res) => {
//   console.log("Create Order Request:", req.body);

//   try {
//     const cleanedData = cleanCustomerData(req.body);
//     cleanedData.stock = (cleanedData.stock || [])
//       .map(item => cleanCustomerData(item))
//       .filter(item => item.itemId && item.itemId.trim() !== "");

//     // Validate required fields
//     if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Main Route' });
//     }
//     if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Sub Route' });
//     }
//     if (!cleanedData.customerId) {
//       return res.status(400).json({ success: false, message: 'Select a Customer' });
//     }
//     if (!cleanedData.orderNumber) {
//       return res.status(400).json({ success: false, message: 'Enter Order Number' });
//     }
//     if (!cleanedData.stock || cleanedData.stock.length === 0) {
//       return res.status(400).json({ success: false, message: 'Select an item' });
//     }

//     // Fetch subroute and customer
//     const subRoute = await SubRoute.findById(cleanedData.subRouteId);
//     if (!subRoute) {
//       return res.status(404).json({ success: false, message: 'Sub Route not found' });
//     }

//     const customer = await Customer.findById(cleanedData.customerId);
//     if (!customer) {
//       return res.status(404).json({ success: false, message: 'Customer not found' });
//     }

//     console.log('SubRoute Before Update:', subRoute);
//     console.log('Customer Before Update:', customer);

//     const subRouteStock = subRoute.stock || [];
//     const customerStock = customer.stock || [];

//     // Validate item availability in the subroute stock
//     for (const item of cleanedData.stock) {
//       const subRouteItem = subRouteStock.find(stock => stock.itemId === item.itemId);

//       if (!subRouteItem) {
//         return res.status(400).json({
//           success: false,
//           message: `Item ${item.itemName} is not available in the subroute`
//         });
//       }

//       if (item.quantity > subRouteItem.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient quantity for item ${item.itemName}. Available: ${subRouteItem.quantity}, Requested: ${item.quantity}`
//         });
//       }
//     }

//     // Update stocks
//     for (const item of cleanedData.stock) {
//       const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

//       if (subRouteItemIndex >= 0) {
//         const subRouteItem = subRouteStock[subRouteItemIndex];

//         // Decrement quantity in subroute
//         subRouteItem.quantity -= item.quantity;

//         // Remove the item from subroute stock if quantity becomes 0
//         if (subRouteItem.quantity <= 0) {
//           subRouteStock.splice(subRouteItemIndex, 1);
//         }
//       }

//       // Fetch item details from Item schema
//       const itemDetails = await Item.findById(item.itemId);
//       if (!itemDetails) {
//         return res.status(404).json({ success: false, message: `Item ${item.itemName} not found in inventory` });
//       }

//       // Check if the item is resaleable
//       const isResalable = itemDetails.resaleable;

//       // Add or update the item in the customer's stock
//       const customerItemIndex = customerStock.findIndex(stock => stock.itemId === item.itemId);

//       if (customerItemIndex >= 0) {
//         // If the item already exists in customer stock, update its quantity
//         customerStock[customerItemIndex].quantity += item.quantity;
//         customerStock[customerItemIndex].status = isResalable ? "Filled" : undefined;
//       } else {
//         // Add new item to the customer stock
//         customerStock.push({
//           itemId: item.itemId,
//           itemName: item.itemName,
//           quantity: item.quantity,
//           status: isResalable ? "Filled" : undefined,
//         });
//       }
//     }

//     // Save the updated subroute stock
//     subRoute.stock = subRouteStock;
//     await subRoute.save();

//     // Save the updated customer stock
//     customer.stock = customerStock;
//     await customer.save();

//     console.log('Updated SubRoute Stock:', subRouteStock);
//     console.log('Updated Customer Stock:', customerStock);

//     // Create an order record
//     const order = new Order({
//       ...cleanedData,
//       stock: cleanedData.stock.map(item => ({
//         itemId: item.itemId,
//         itemName: item.itemName,
//         quantity: item.quantity,
//         status: "Sold",
//       })),
//     });

//     await order.save();

//     // Send success response
//     res.status(200).json({ success: true, message: 'Order created successfully' });

//   } catch (error) {
//     console.error(error);

//     // Send error response
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while creating the order"
//     });
//   }
// };




// function cleanCustomerData(data) {
//   const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
//   return Object.keys(data).reduce((acc, key) => {
//     acc[key] = cleanData(data[key]);
//     return acc;
//   }, {});
// }


// Function to view a single order by ID





// Fetch existing data





const dataExist = async ( customerId , depositAccountId ) => {
    const [ customerAccount, saleAccount, depositAccount ] = await Promise.all([
      Account.findOne({  accountId:customerId }),
      Account.findOne({  accountName:"Sales" }),
      Account.findOne({  _id:depositAccountId }),
    ]);
    return { customerAccount, saleAccount, depositAccount};
};

// exports.createOrder = async (req, res) => {
//   console.log("Create Order Request:", req.body);

//   try {
//     const cleanedData = cleanCustomerData(req.body);
//     cleanedData.stock = (cleanedData.stock || [])
//       .map(item => cleanCustomerData(item))
//       .filter(item => item.itemId && item.itemId.trim() !== "");

//     // Validate required fields
//     if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Main Route' });
//     }
//     if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Sub Route' });
//     }
//     if (!cleanedData.customerId) {
//       return res.status(400).json({ success: false, message: 'Select a Customer' });
//     }
//     if (!cleanedData.stock || cleanedData.stock.length === 0) {
//       return res.status(400).json({ success: false, message: 'Select an item' });
//     }

//     const { customerAccount, saleAccount, depositAccount } = await dataExist( cleanedData.customerId, cleanedData.depositAccountId );
//     if (!customerAccount) {
//         res.status(404).json({ message: "Customer Account not found" });
//         return false;
//       }   


//     // Fetch subroute and customer
//     const subRoute = await SubRoute.findById(cleanedData.subRouteId);
//     if (!subRoute) {
//       return res.status(404).json({ success: false, message: 'Sub Route not found' });
//     }

//     const customer = await Customer.findById(cleanedData.customerId);
//     if (!customer) {
//       return res.status(404).json({ success: false, message: 'Customer not found' });
//     }

//     console.log('SubRoute Before Update:', subRoute);
//     console.log('Customer Before Update:', customer);

//     const subRouteStock = subRoute.stock || [];
//     const customerStock = customer.stock || [];

//     // Validate item availability in the subroute stock
//     for (const item of cleanedData.stock) {
//       const subRouteItem = subRouteStock.find(stock => stock.itemId === item.itemId);

//       if (!subRouteItem) {
//         return res.status(400).json({
//           success: false,
//           message: `Item ${item.itemName} is not available in the subroute`
//         });
//       }

//       if (item.quantity > subRouteItem.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient quantity for item ${item.itemName}. Available: ${subRouteItem.quantity}, Requested: ${item.quantity}`
//         });
//       }
//     }

//     // Update stocks
//     for (const item of cleanedData.stock) {
//       const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

//       if (subRouteItemIndex >= 0) {
//         const subRouteItem = subRouteStock[subRouteItemIndex];

//         // Decrement quantity in subroute
//         subRouteItem.quantity -= item.quantity;

//         // Remove the item from subroute stock if quantity becomes 0
//         if (subRouteItem.quantity <= 0) {
//           subRouteStock.splice(subRouteItemIndex, 1);
//         }
//       }

//       // Fetch item details from Item schema
//       const itemDetails = await Item.findById(item.itemId);
//       if (!itemDetails) {
//         return res.status(404).json({ success: false, message: `Item ${item.itemName} not found in inventory` });
//       }

//       // Check if the item is resaleable
//       const isResalable = itemDetails.resaleable;

//       // Add or update the item in the customer's stock
//       const customerItemIndex = customerStock.findIndex(stock => stock.itemId === item.itemId);

//       if (customerItemIndex >= 0) {
//         // If the item already exists in customer stock, update its quantity
//         customerStock[customerItemIndex].quantity += item.quantity;
//         customerStock[customerItemIndex].status = isResalable ? "Filled" : undefined;
//       } else {
//         // Add new item to the customer stock
//         customerStock.push({
//           itemId: item.itemId,
//           itemName: item.itemName,
//           quantity: item.quantity,
//           status: isResalable ? "Filled" : undefined,
//         });
//       }
//     }

//     // Handle return bottles
//     if (cleanedData.returnBottle && cleanedData.returnBottle > 0) {
//       const returnBottleAmount = cleanedData.returnBottle;

//       for (const item of cleanedData.stock || []) {
//         // Update customer's stock to reflect the return
//         const customerItemIndex = customerStock.findIndex(stock => stock.itemId === item.itemId);

//         if (customerItemIndex >= 0) {
//           const customerItem = customerStock[customerItemIndex];

//           if (returnBottleAmount > customerItem.quantity) {
//             return res.status(400).json({
//               success: false,
//               message: `Return amount for item ${item.itemName} exceeds customer's current stock. Available: ${customerItem.quantity}, Returned: ${returnBottleAmount}`
//             });
//           }

//           // Decrement the return amount from customer's stock
//           customerItem.quantity -= returnBottleAmount;

//           // Remove the item from customer stock if quantity becomes 0
//           if (customerItem.quantity <= 0) {
//             customerStock.splice(customerItemIndex, 1);
//           }
//         } else {
//           return res.status(400).json({
//             success: false,
//             message: `Customer does not have item ${item.itemName} in stock for return`
//           });
//         }

//         // Update subroute stock to reflect the returned items
//         const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

//         if (subRouteItemIndex >= 0) {
//           subRouteStock[subRouteItemIndex].quantity += returnBottleAmount;
//           // Increment returnBottle count in subroute
//           subRouteStock[subRouteItemIndex].returnBottle = (subRouteStock[subRouteItemIndex].returnBottle || 0) + returnBottleAmount;
//         } else {
//           subRouteStock.push({
//             itemId: item.itemId,
//             itemName: item.itemName,
//             quantity: returnBottleAmount,
//             returnBottle: returnBottleAmount
//           });
//         }
//       }
//     }

//     // Save the updated subroute stock
//     subRoute.stock = subRouteStock;
//     await subRoute.save();

//     // Save the updated customer stock
//     customer.stock = customerStock;
//     await customer.save();

//     console.log('Updated SubRoute Stock:', subRouteStock);
//     console.log('Updated Customer Stock:', customerStock);


// // Prefix generation
// let nextId = 1;
// const lastPrefix = await Order.findOne().sort({ _id: -1 });

// if (lastPrefix && lastPrefix.orderNumber) {
//   const lastIdString = lastPrefix.orderNumber.replace("ORDER-", ""); // Extract the number part
//   const lastId = parseInt(lastIdString, 10); // Convert to number

//   // Check if lastId is a valid number
//   if (!isNaN(lastId)) {
//     nextId = lastId + 1;
//   }
// }

// const orderNumber = `ORD-${nextId}`;

// // Create an order record
// const order = new Order({
//   ...cleanedData,
//   orderNumber: orderNumber,
//   balanceAmount: (cleanedData.totalAmount - cleanedData.paidAmount) || 0,
//   stock: cleanedData.stock.map(item => ({
//     itemId: item.itemId,
//     itemName: item.itemName,
//     quantity: item.quantity,
//     status: "Sold",
//   })),
// });

// await order.save();


//     console.log('Order Created:', order);
    

//      //Journal
//      await journal( order, customerAccount, saleAccount, depositAccount );

//     // Send success response
//     res.status(200).json({ success: true, message: 'Order created successfully' });

//   } catch (error) {
//     console.error(error);

//     // Send error response
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while creating the order"
//     });
//   }
// };




// exports.createOrder = async (req, res) => {
//   console.log("Create Order Request:", req.body);

//   try {
//     const cleanedData = cleanCustomerData(req.body);
//     cleanedData.stock = (cleanedData.stock || [])
//       .map(item => cleanCustomerData(item))
//       .filter(item => item.itemId && item.itemId.trim() !== "");

//     // Validate required fields
//     if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Main Route' });
//     }
//     if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Sub Route' });
//     }
//     if (!cleanedData.customerId) {
//       return res.status(400).json({ success: false, message: 'Select a Customer' });
//     }
//     if (!cleanedData.stock || cleanedData.stock.length === 0) {
//       return res.status(400).json({ success: false, message: 'Select an item' });
//     }

//     const { customerAccount, saleAccount, depositAccount } = await dataExist(cleanedData.customerId, cleanedData.depositAccountId);
//     if (!customerAccount) {
//       return res.status(404).json({ message: "Customer Account not found" });
//     }

//     // Fetch subroute and customer
//     const subRoute = await SubRoute.findById(cleanedData.subRouteId);
//     if (!subRoute) {
//       return res.status(404).json({ success: false, message: 'Sub Route not found' });
//     }

//     const customer = await Customer.findById(cleanedData.customerId);
//     if (!customer) {
//       return res.status(404).json({ success: false, message: 'Customer not found' });
//     }

//     console.log('SubRoute Before Update:', subRoute);
//     console.log('Customer Before Update:', customer);

//     const subRouteStock = subRoute.stock || [];
//     const customerStock = customer.stock || [];

//     // Validate item availability in the subroute stock
//     for (const item of cleanedData.stock) {
//       const subRouteItem = subRouteStock.find(stock => stock.itemId === item.itemId);

//       if (!subRouteItem) { 
//         return res.status(400).json({
//           success: false,
//           message: `Item ${item.itemName} is not available in the subroute`
//         });
//       }

//       if (item.quantity > subRouteItem.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient quantity for item ${item.itemName}. Available: ${subRouteItem.quantity}, Requested: ${item.quantity}`
//         });
//       }
//     }

//     // Update stocks
//     for (const item of cleanedData.stock) {
//       const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

//       if (subRouteItemIndex >= 0) {
//         const subRouteItem = subRouteStock[subRouteItemIndex];

//         // Decrement quantity in subroute
//         subRouteItem.quantity -= item.quantity;

//         // Remove the item from subroute stock if quantity becomes 0
// // Set the quantity to 0 instead of removing the item if quantity becomes 0
// if (subRouteItem.quantity <= 0) {
//   subRouteItem.quantity = 0;
// }
//       }

//       // Fetch item details from Item schema
//       const itemDetails = await Item.findById(item.itemId);
//       if (!itemDetails) {
//         return res.status(404).json({ success: false, message: `Item ${item.itemName} not found in inventory` });
//       }

//       // Check if the item is resaleable
//       const isResalable = itemDetails.resaleable;

//       // Add or update the item in the customer's stock
//       const customerItemIndex = customerStock.findIndex(stock => stock.itemId === item.itemId);

//       if (customerItemIndex >= 0) {
//         // If the item already exists in customer stock, update its quantity
//         customerStock[customerItemIndex].quantity += item.quantity;
//         customerStock[customerItemIndex].status = isResalable ? "Filled" : undefined;
//       } else {
//         // Add new item to the customer stock
//         customerStock.push({
//           itemId: item.itemId,
//           itemName: item.itemName,
//           quantity: item.quantity,
//           status: isResalable ? "Filled" : undefined,
//         });
//       }
//     }

//     // Handle return bottles
//     if (cleanedData.returnBottle && cleanedData.returnBottle > 0) {
//       const returnBottleAmount = cleanedData.returnBottle;

//       for (const item of cleanedData.stock || []) {
//         // Update customer's stock to reflect the return
//         const customerItemIndex = customerStock.findIndex(stock => stock.itemId === item.itemId);

//         if (customerItemIndex >= 0) {
//           const customerItem = customerStock[customerItemIndex];

//           if (returnBottleAmount > customerItem.quantity) {
//             return res.status(400).json({
//               success: false,
//               message: `Return amount for item ${item.itemName} exceeds customer's current stock. Available: ${customerItem.quantity}, Returned: ${returnBottleAmount}`
//             });
//           }

//           // Decrement the return amount from customer's stock
//           customerItem.quantity -= returnBottleAmount;

//           // Remove the item from customer stock if quantity becomes 0
//           if (customerItem.quantity <= 0) {
//             customerStock.splice(customerItemIndex, 1);
//           }
//         } else {
//           return res.status(400).json({
//             success: false,
//             message: `Customer does not have item ${item.itemName} in stock for return`
//           });
//         }

//         // Update subroute stock to reflect the returned items
//         const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

//         if (subRouteItemIndex >= 0) {
//           // Only increment returnBottle count without affecting available stock
//           subRouteStock[subRouteItemIndex].returnBottle = (subRouteStock[subRouteItemIndex].returnBottle || 0) + returnBottleAmount;
//         } else {
//           subRouteStock.push({
//             itemId: item.itemId,
//             itemName: item.itemName,
//             returnBottle: returnBottleAmount
//           });
//         }
//       }
//     }

//     // Save the updated subroute stock
//     subRoute.stock = subRouteStock;
//     await subRoute.save();

//     // Save the updated customer stock
//     customer.stock = customerStock;
//     await customer.save();

//     console.log('Updated SubRoute Stock:', subRouteStock);
//     console.log('Updated Customer Stock:', customerStock);

//     // // Prefix generation
//     // let nextId = 1;
//     // const lastPrefix = await Order.findOne().sort({ _id: -1 }); 
//     // console.log('Last Prefix:----------------------------------------------', lastPrefix.orderNumber.slice(6));
    
//     // if (lastPrefix) {
//     //   const lastId = parseInt(lastPrefix.orderNumber.slice(6)); 
//     //   nextId = lastId + 1; 
//     // }    
//     // const orderNumber = `ORDER-${nextId}`;

//     let nextId = 1;
//     let orderNumber = ''; // Declare outside to avoid scoping issues
    
//     try {
//       const lastPrefix = await Order.findOne().sort({ _id: -1 });
    
//       if (lastPrefix?.orderNumber?.startsWith('ORDER-')) {
//         const lastId = parseInt(lastPrefix.orderNumber.split('-')[1]);
//         if (!isNaN(lastId)) {
//           nextId = lastId + 1;
//         }
//       }
    
//       orderNumber = `ORDER-${String(nextId).padStart(3, '0')}`; // e.g., ORDER-001
//       console.log('Generated Order Number:', orderNumber);
//     } catch (error) {
//       console.error('Error generating order number:', error);
//     }
    
//     const order = new Order({
//       ...cleanedData,
//       orderNumber,
//       balanceAmount: cleanedData.paymentMode === 'Credit' 
//         ? Number(cleanedData.totalAmount) 
//         : (Number(cleanedData.totalAmount) - Number(cleanedData.paidAmount)) || 0,
//       paidAmount: cleanedData.paymentMode === 'Credit' 
//         ? 0 
//         : Number(cleanedData.paidAmount),
//       stock: cleanedData.stock.map(item => ({
//         itemId: item.itemId,
//         itemName: item.itemName,
//         quantity: item.quantity,
//         status: "Sold",
//       })),
//     });
    
//     console.log("Debug - Balance Amount:", order.balanceAmount);
//     console.log("Debug - Paid Amount:", order.paidAmount);
    
    
//     await order.save();
    

//     console.log("Order created:", JSON.stringify(order, null, 2));

//     // Journal
//     await journal(order, customerAccount, saleAccount, depositAccount);

//     // Send success response
//     res.status(200).json({ success: true, message: 'Order created successfully' });

//   } catch (error) {
//     console.error(error);

//     // Send error response
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while creating the order"
//     });
//   }
// };



exports.createOrder = async (req, res) => {
  console.log("Create Order Request:", req.body);

  try {
    const cleanedData = cleanCustomerData(req.body);
    cleanedData.stock = (cleanedData.stock || [])
      .map(item => cleanCustomerData(item))
      .filter(item => item.itemId && item.itemId.trim() !== "");

    // Validate required fields
    if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
      return res.status(400).json({ success: false, message: 'Select Main Route' });
    }
    if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
      return res.status(400).json({ success: false, message: 'Select Sub Route' });
    }
    if (!cleanedData.customerId) {
      return res.status(400).json({ success: false, message: 'Select a Customer' });
    }
    if (!cleanedData.stock || cleanedData.stock.length === 0) {
      return res.status(400).json({ success: false, message: 'Select an item' });
    }

    // Calculate total quantity for the order
    cleanedData.totalQuantity = cleanedData.stock.reduce((sum, item) => sum + item.quantity, 0);

    const { customerAccount, saleAccount, depositAccount } = await dataExist(cleanedData.customerId, cleanedData.depositAccountId);
    if (!customerAccount) {
      return res.status(404).json({ message: "Customer Account not found" });
    }

    // Fetch subroute and customer
    const subRoute = await SubRoute.findById(cleanedData.subRouteId);
    if (!subRoute) {
      return res.status(404).json({ success: false, message: 'Sub Route not found' });
    }

    const customer = await Customer.findById(cleanedData.customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Log the customer details and CouponBottle field
    console.log('Customer Details:', customer);
    console.log('Customer CouponBottle:', customer.CouponBottle);

    // Ensure CouponBottle is a number and default it to 0 if undefined
    const customerCoupons = customer.CouponBottle || 0;
    console.log("Total Order Quantity:", cleanedData.totalQuantity);
    console.log("Customer Available Coupons:", customerCoupons);

    // Validate coupon availability only for customers who use coupons
    if (cleanedData.paymentMode === 'Coupon') {
      if (customerCoupons < cleanedData.totalQuantity) {
        return res.status(400).json({
          success: false,
          message: "Coupons for this customer are finished"
        });
      }

      // Deduct the coupon bottles
      customer.CouponBottle -= cleanedData.totalQuantity;
      console.log(`Customer coupon bottles updated: ${customer.CouponBottle}`);
    } else {
      // No coupon validation needed for non-coupon customers (e.g., Cash or Credit)
      console.log("No coupon validation required for this customer.");
    }

    const subRouteStock = subRoute.stock || [];
    const customerStock = customer.stock || [];

    // Validate item availability in the subroute stock
    for (const item of cleanedData.stock) {
      const subRouteItem = subRouteStock.find(stock => stock.itemId === item.itemId);

      if (!subRouteItem) {
        return res.status(400).json({
          success: false,
          message: `Item ${item.itemName} is not available in the subroute`
        });
      }

      if (item.quantity > subRouteItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for item ${item.itemName}. Available: ${subRouteItem.quantity}, Requested: ${item.quantity}`
        });
      }
    }

    // Update stocks
    for (const item of cleanedData.stock) {
      const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

      if (subRouteItemIndex >= 0) {
        const subRouteItem = subRouteStock[subRouteItemIndex];

        // Decrement quantity in subroute
        subRouteItem.quantity -= item.quantity;

        // Set quantity to 0 instead of removing the item if quantity becomes 0
        if (subRouteItem.quantity <= 0) {
          subRouteItem.quantity = 0;
        }
      }

      // Fetch item details from Item schema
      const itemDetails = await Item.findById(item.itemId);
      if (!itemDetails) {
        return res.status(404).json({ success: false, message: `Item ${item.itemName} not found in inventory` });
      }

      // Check if the item is resaleable
      const isResalable = itemDetails.resaleable;

      // Add or update the item in the customer's stock
      const customerItemIndex = customerStock.findIndex(stock => stock.itemId === item.itemId);

      if (customerItemIndex >= 0) {
        customerStock[customerItemIndex].quantity += item.quantity;
        customerStock[customerItemIndex].status = isResalable ? "Filled" : undefined;
      } else {
        customerStock.push({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          status: isResalable ? "Filled" : undefined,
        });
      }
    }

    // Handle return bottles
    if (cleanedData.returnBottle && cleanedData.returnBottle > 0) {
      const returnBottleAmount = cleanedData.returnBottle;

      for (const item of cleanedData.stock || []) {
        const customerItemIndex = customerStock.findIndex(stock => stock.itemId === item.itemId);

        if (customerItemIndex >= 0) {
          const customerItem = customerStock[customerItemIndex];

          if (returnBottleAmount > customerItem.quantity) {
            return res.status(400).json({
              success: false,
              message: `Return amount for item ${item.itemName} exceeds customer's current stock. Available: ${customerItem.quantity}, Returned: ${returnBottleAmount}`
            });
          }

          customerItem.quantity -= returnBottleAmount;

          if (customerItem.quantity <= 0) {
            customerStock.splice(customerItemIndex, 1);
          }
        } else {
          return res.status(400).json({
            success: false,
            message: `Customer does not have item ${item.itemName} in stock for return`
          });
        }

        const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

        if (subRouteItemIndex >= 0) {
          subRouteStock[subRouteItemIndex].returnBottle = (subRouteStock[subRouteItemIndex].returnBottle || 0) + returnBottleAmount;
        } else {
          subRouteStock.push({
            itemId: item.itemId,
            itemName: item.itemName,
            returnBottle: returnBottleAmount
          });
        }
      }
    }

    subRoute.stock = subRouteStock;
    await subRoute.save();

    customer.stock = customerStock;
    await customer.save();

    let nextId = 1;
    let orderNumber = ''; 
    
    try {
      const lastPrefix = await Order.findOne().sort({ _id: -1 });
      if (lastPrefix?.orderNumber?.startsWith('ORDER-')) {
        const lastId = parseInt(lastPrefix.orderNumber.split('-')[1]);
        if (!isNaN(lastId)) {
          nextId = lastId + 1;
        }
      }
      orderNumber = `ORDER-${String(nextId).padStart(3, '0')}`;
      console.log('Generated Order Number:', orderNumber);
    } catch (error) {
      console.error('Error generating order number:', error);
    }

    const order = new Order({
      ...cleanedData,
      orderNumber,
      balanceAmount: cleanedData.paymentMode === 'Credit' 
        ? Number(cleanedData.totalAmount) 
        : (Number(cleanedData.totalAmount) - Number(cleanedData.paidAmount)) || 0,
      paidAmount: cleanedData.paymentMode === 'Credit' 
        ? 0 
        : Number(cleanedData.paidAmount),
      stock: cleanedData.stock.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        status: "Sold",
      })),
    });

    await order.save();
    await journal(order, customerAccount, saleAccount, depositAccount);

    res.status(200).json({ success: true, message: 'Order created successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the order"
    });
  }
};







exports.viewOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Orderbalanceamt:', order.balanceAmount);
    
    
    const customer = await Customer.findById(order.customerId).select('fullName mobileNo');
    
    const orderWithCustomerInfo = {
      ...order.toObject(),
      customerName: customer ? customer.fullName : 'Unknown',
      customerMobile: customer ? customer.mobileNo : 'N/A'
    };

    res.status(200).json(orderWithCustomerInfo);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching order', 
      error: error.message 
    });
  }
};




// Function to view all orders
exports.viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    
    const ordersWithCustomerInfo = await Promise.all(orders.map(async (order) => {
      const customer = await Customer.findById(order.customerId).select('fullName');
      
      return {
        ...order.toObject(),
        customerName: customer ? customer.fullName : 'Unknown'
      };
    }));

    res.status(200).json(ordersWithCustomerInfo);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
};



exports.getTodayOrders = async (req, res) => {
  try {
    const { rideId } = req.params;

    // Validate rideId
    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID is required',
      });
    }

    // Fetch orders for the given rideId
    const orders = await Order.find({ rideId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this ride',
      });
    }

    // Fetch associated customer info
    const ordersWithCustomerInfo = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findById(order.customerId).select('fullName');

        return {
          ...order.toObject(),
          customerName: customer ? customer.fullName : 'Unknown',
        };
      })
    );

    res.status(200).json({
      success: true,
      data: ordersWithCustomerInfo,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};



// Function to delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};


// exports.editOrder = async (req, res) => {
//   console.log("Edit Order Request:", req.body);

//   const { id } = req.params;
//   console.log("Order ID:", id);

//   try {
//     const cleanedData = cleanCustomerData(req.body);
//     cleanedData.stock = (cleanedData.stock || [])
//       .map(item => cleanCustomerData(item))
//       .filter(item => item.itemId && item.itemId.trim() !== "");

//     if (!id) {
//       return res.status(400).json({ success: false, message: "Order ID is required" });
//     }

//     // Fetch existing order
//     const existingOrder = await Order.findById(id);
//     if (!existingOrder) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     const { customerAccount, saleAccount, depositAccount } = await dataExist(
//       cleanedData.customerId,
//       cleanedData.depositAccountId
//     );

//     if (!customerAccount) {
//       return res.status(404).json({ message: "Customer Account not found" });
//     }

//     const subRoute = await SubRoute.findById(cleanedData.subRouteId);
//     if (!subRoute) {
//       return res.status(404).json({ success: false, message: "Sub Route not found" });
//     }

//     const customer = await Customer.findById(cleanedData.customerId);
//     if (!customer) {
//       return res.status(404).json({ success: false, message: "Customer not found" });
//     }

//     const subRouteStock = subRoute.stock || [];
//     const customerStock = customer.stock || [];

//     // Restore stock for existing order items before processing updates
//     for (const oldItem of existingOrder.stock) {
//       const subRouteItem = subRouteStock.find(stock => stock.itemId === oldItem.itemId);
//       if (subRouteItem) {
//         subRouteItem.quantity += oldItem.quantity;
//       }

//       const customerItem = customerStock.find(stock => stock.itemId === oldItem.itemId);
//       if (customerItem) {
//         customerItem.quantity -= oldItem.quantity;
//         if (customerItem.quantity <= 0) {
//           customerStock.splice(customerStock.indexOf(customerItem), 1);
//         }
//       }
//     }

//     // Process new stock updates
//     for (const newItem of cleanedData.stock) {
//       const subRouteItem = subRouteStock.find(stock => stock.itemId === newItem.itemId);

//       if (!subRouteItem) {
//         return res.status(400).json({
//           success: false,
//           message: `Item ${newItem.itemName} not found in SubRoute stock.`,
//         });
//       }

//       if (newItem.quantity <= 0) {
//         return res.status(400).json({
//           success: false,
//           message: `Quantity for ${newItem.itemName} must be greater than 0.`,
//         });
//       }

//       if (subRouteItem.quantity < newItem.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for item ${newItem.itemName}. Available: ${subRouteItem.quantity}, Requested: ${newItem.quantity}`,
//         });
//       }

//       // Update subRoute stock
//       subRouteItem.quantity -= newItem.quantity;

//       // Update customer stock
//       const customerItem = customerStock.find(stock => stock.itemId === newItem.itemId);
//       if (customerItem) {
//         customerItem.quantity += newItem.quantity;
//       } else {
//         customerStock.push({
//           itemId: newItem.itemId,
//           itemName: newItem.itemName,
//           quantity: newItem.quantity,
//           status: "Filled",
//         });
//       }
//     }

//     // Save updated stocks
//     subRoute.stock = subRouteStock;
//     console.log("Saving updated subRoute stock:", subRoute.stock);
//     await subRoute.save();

//     customer.stock = customerStock;
//     console.log("Saving updated customer stock:", customer.stock);
//     await customer.save();

//     // Update order details
//     console.log("Updating order details...");
//     existingOrder.stock = cleanedData.stock.map(item => ({
//       itemId: item.itemId,
//       itemName: item.itemName,
//       quantity: item.quantity,
//       status: "Sold",
//     }));
//     existingOrder.totalAmount = cleanedData.totalAmount;
//     existingOrder.paidAmount = cleanedData.paidAmount;
//     existingOrder.balanceAmount = (cleanedData.totalAmount - cleanedData.paidAmount) || 0;
//     existingOrder.note = cleanedData.note;

//     console.log("Saving updated order:", existingOrder);
//     await existingOrder.save();

//     res.status(200).json({ success: true, message: "Order updated successfully" });
//   } catch (error) {
//     console.error("Error editing order:", error);
//     res.status(500).json({ success: false, message: "An error occurred while editing the order." });
//   }
// };




  // Function to generate time and date for storing in the database













  exports.editOrder = async (req, res) => {
    console.log("Edit Order Request:", req.body);
  
    const { id } = req.params;
  
    try {
      if (!id) {
        console.log("Order ID is missing in the request.");
        return res.status(400).json({ success: false, message: "Order ID is required" });
      }
  
      const cleanedData = cleanCustomerData(req.body);
      console.log("Cleaned customer data:", cleanedData);
  
      cleanedData.stock = (cleanedData.stock || [])
        .map(item => cleanCustomerData(item))
        .filter(item => item.itemId && item.itemId.trim() !== "");
      console.log("Cleaned stock data:", cleanedData.stock);
  
      const existingOrder = await Order.findById(id);
      if (!existingOrder) {
        console.log(`Order with ID ${id} not found.`);
        return res.status(404).json({ success: false, message: "Order not found" });
      }
  
      console.log(`Found existing order:`, existingOrder);
  
      // Load previous customer and new customer data
      const prevCustomer = await Customer.findById(existingOrder.customerId);
      const newCustomer = await Customer.findById(cleanedData.customerId);
  
      if (!newCustomer) {
        console.log("New Customer not found.");
        return res.status(404).json({ success: false, message: "New Customer not found" });
      }
  
      console.log("Previous Customer:", prevCustomer);
      console.log("New Customer:", newCustomer);
  
      // Handle customer change scenario first
      const isCustomerChanged = prevCustomer && prevCustomer._id.toString() !== newCustomer._id.toString();
      if (isCustomerChanged) {
        console.log("Customer changed - handling stock transfer...");
        // Return all items to previous customer
        for (const oldItem of existingOrder.stock) {
          const prevCustomerItem = prevCustomer.stock.find(item => item.itemId === oldItem.itemId);
          if (prevCustomerItem) {
            prevCustomerItem.quantity += oldItem.quantity;
          } else {
            prevCustomer.stock.push({
              itemId: oldItem.itemId,
              itemName: oldItem.itemName,
              quantity: oldItem.quantity,
              status: "Filled",
            });
          }
        }
        await prevCustomer.save();
        console.log("Stock restored to previous customer.");
      }
  
      // Update subRoute and new customer stock
      const subRoute = await SubRoute.findById(cleanedData.subRouteId);
      if (!subRoute) {
        console.log("Sub Route not found.");
        return res.status(404).json({ success: false, message: "Sub Route not found" });
      }
  
      console.log("Sub Route found:", subRoute);
  
      const subRouteStock = subRoute.stock || [];
      const newCustomerStock = newCustomer.stock || [];
  
      // First, handle item removals and returns
      for (const existingItem of existingOrder.stock) {
        const newOrderItem = cleanedData.stock.find(item => item.itemId === existingItem.itemId);
        
        // If item is not in new order or quantity decreased, handle returns
        if (!newOrderItem || newOrderItem.quantity < existingItem.quantity) {
          const returnQuantity = !newOrderItem ? existingItem.quantity : 
                               (existingItem.quantity - newOrderItem.quantity);
  
          // Return stock to subRoute
          const subRouteItem = subRouteStock.find(item => item.itemId === existingItem.itemId);
          if (subRouteItem) {
            subRouteItem.quantity += returnQuantity;
          } else {
            subRouteStock.push({
              itemId: existingItem.itemId,
              itemName: existingItem.itemName,
              quantity: returnQuantity,
              status: "Filled",
            });
          }
  
          // Remove from customer stock if not changing customers
          if (!isCustomerChanged) {
            const customerItem = newCustomerStock.find(item => item.itemId === existingItem.itemId);
            if (customerItem) {
              customerItem.quantity -= returnQuantity;
              if (customerItem.quantity <= 0) {
                const index = newCustomerStock.indexOf(customerItem);
                newCustomerStock.splice(index, 1);
              }
            }
          }
        }
      }
  
      // Then handle new items and quantity increases
      for (const newItem of cleanedData.stock) {
        const existingOrderItem = existingOrder.stock.find(item => item.itemId === newItem.itemId);
        const quantityIncrease = existingOrderItem ? 
                                Math.max(0, newItem.quantity - existingOrderItem.quantity) : 
                                newItem.quantity;
  
        if (quantityIncrease > 0) {
          const subRouteItem = subRouteStock.find(stock => stock.itemId === newItem.itemId);
          if (!subRouteItem || subRouteItem.quantity < quantityIncrease) {
            console.log(`Insufficient stock for item ${newItem.itemName}.`);
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for item ${newItem.itemName}.`,
            });
          }
  
          // Deduct from subRoute
          subRouteItem.quantity -= quantityIncrease;
  
          // Add to customer
          const customerItem = newCustomerStock.find(item => item.itemId === newItem.itemId);
          if (customerItem) {
            customerItem.quantity += quantityIncrease;
          } else {
            newCustomerStock.push({
              itemId: newItem.itemId,
              itemName: newItem.itemName,
              quantity: newItem.quantity,
              status: "Filled",
            });
          }
        }
      }
  
      // Save updated stocks
      subRoute.stock = subRouteStock;
      await subRoute.save();
      console.log("Sub Route stock updated.");
  
      newCustomer.stock = newCustomerStock;
      await newCustomer.save();
      console.log("New Customer stock updated.");
  
      // Update order details
      existingOrder.customerId = cleanedData.customerId;
      existingOrder.stock = cleanedData.stock.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        status: "Sold",
      }));
      existingOrder.totalAmount = cleanedData.totalAmount;
      existingOrder.paidAmount = cleanedData.paidAmount;
      existingOrder.balanceAmount = cleanedData.totalAmount - cleanedData.paidAmount;
      existingOrder.notes = cleanedData.note;
  
      await existingOrder.save();
      console.log("Order updated successfully.");
  
      res.status(200).json({ success: true, message: "Order updated successfully" });
    } catch (error) {
      console.error("Error editing order:", error);
      res.status(500).json({ success: false, message: "An error occurred while editing the order." });
    }
  };
  










  function generateTimeAndDateForDB(
  timeZone,
  dateFormat,
  dateSplit,
  baseTime = new Date(),
  timeFormat = "HH:mm:ss",
  timeSplit = ":"
) {
  // Convert the base time to the desired time zone
  const localDate = moment.tz(baseTime, timeZone);

  // Format date and time according to the specified formats
  let formattedDate = localDate.format(dateFormat);

  // Handle date split if specified
  if (dateSplit) {
    // Replace default split characters with specified split characters
    formattedDate = formattedDate.replace(/[-/]/g, dateSplit); // Adjust regex based on your date format separators
  }

  const formattedTime = localDate.format(timeFormat);
  const timeZoneName = localDate.format("z"); // Get time zone abbreviation

  // Combine the formatted date and time with the split characters and time zone
  const dateTime = `${formattedDate} ${formattedTime
    .split(":")
    .join(timeSplit)}`;

  return {
    date: formattedDate,
    time: `${formattedTime} (${timeZoneName})`,
    dateTime: dateTime,
  };
}



  //Clean Data 
  function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }


//   async function journal( order, customerAccount, saleAccount, depositAccounts ) {  

//     console.log('customeracc:',customerAccount);
//     console.log('orderdepositid:',order.depositAccountId);
//     console.log('saleaccount:',saleAccount);
//     console.log('depositacc:',depositAccounts);
    

//     const sale = {
//       operationId: order._id,
//       transactionId: order.orderNumber,
//       date: order.createdDate,
//       accountId: saleAccount._id || undefined,
//       action: "Sales Invoice",
//       debitAmount: 0,
//       creditAmount: order.totalAmount,
//       remark: order.note,
//     };


//     const customer = {
//       operationId: order._id,
//       transactionId: order.orderNumber,
//       date: order.createdDate,
//       accountId: customerAccount._id || undefined,
//       action: "Sales Invoice",
//       debitAmount: order.totalAmount || 0,
//       creditAmount: 0,
//       remark: order.note,
//     };
//     const customerPaid = {
//       operationId: order._id,
//       transactionId: order.orderNumber,
//       date: order.createdDate,
//       accountId: customerAccount._id || undefined,
//       action: "Receipt",
//       debitAmount: 0,
//       creditAmount: order.paidAmount || 0,
//       remark: order.note,
//     };
//     let depositAccount 
   
//     if(depositAccounts){
//        depositAccount = {
//         operationId: order._id,
//         transactionId: order.orderNumber,
//         date: order.createdDate,
//         accountId: depositAccounts._id || undefined,
//         action: "Receipt",
//         debitAmount: order.paidAmount || 0,
//         creditAmount: 0,
//         remark: order.note,
//       };
//     }

//     // console.log("sale", sale.debitAmount,  sale.creditAmount);
//     // console.log("customer", customer.debitAmount,  customer.creditAmount);
//     // console.log("customerPaid", customerPaid.debitAmount,  customerPaid.creditAmount);
//     // console.log("depositAccount", depositAccount.debitAmount,  depositAccount.creditAmount);

//     // const  debitAmount =  sale.debitAmount  + customer.debitAmount + customerPaid.debitAmount +  depositAccount.debitAmount;
//     // const  creditAmount = sale.creditAmount  + customer.creditAmount + customerPaid.creditAmount +  depositAccount.creditAmount ;
  
//     // console.log("Total Debit Amount: ", debitAmount );
//     // console.log("Total Credit Amount: ", creditAmount );

//     const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai","DD/MM/YY","/");
//     const openingDate = generatedDateTime.dateTime; 

//     //credit
    
//     if(order.paymentMode === 'Cash'){
//       createTrialEntry( sale ,openingDate )
//       createTrialEntry( customer,openingDate )
//         createTrialEntry( customerPaid,openingDate )
//         createTrialEntry( depositAccount,openingDate )
//     }
// if(order.paymentMode === 'Credit'){
//   createTrialEntry( sale ,openingDate )
//   createTrialEntry( customer,openingDate )
//   }
// }


async function journal(order, customerAccount, saleAccount, depositAccounts) {
  const sale = {
    operationId: order._id,
    transactionId: order.orderNumber,
    date: order.createdDate,
    accountId: saleAccount._id || undefined,
    action: "Sales Invoice",
    debitAmount: 0,
    creditAmount: order.totalAmount,
    remark: order.note,
  };

  const customer = {
    operationId: order._id,
    transactionId: order.orderNumber,
    date: order.createdDate,
    accountId: customerAccount._id || undefined,
    action: "Sales Invoice",
    debitAmount: order.paymentMode === 'Credit' ? order.totalAmount : order.totalAmount || 0,
    creditAmount: 0,
    remark: order.note,
  };

  const customerPaid = {
    operationId: order._id,
    transactionId: order.orderNumber,
    date: order.createdDate,
    accountId: customerAccount._id || undefined,
    action: "Receipt",
    debitAmount: 0,
    creditAmount: order.paymentMode === 'Credit' ? 0 : order.paidAmount || 0,
    remark: order.note,
  };

  let depositAccount;
  if (depositAccounts && order.paymentMode !== 'Credit') {
    depositAccount = {
      operationId: order._id,
      transactionId: order.orderNumber,
      date: order.createdDate,
      accountId: depositAccounts._id || undefined,
      action: "Receipt",
      debitAmount: order.paidAmount || 0,
      creditAmount: 0,
      remark: order.note,
    };
  }

  const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai", "DD/MM/YY", "/");
  const openingDate = generatedDateTime.dateTime;

  // Handle journal entries based on payment mode
  if (order.paymentMode === 'Cash') {
    createTrialEntry(sale, openingDate);
    createTrialEntry(customer, openingDate);
    createTrialEntry(customerPaid, openingDate);
    if (depositAccount) createTrialEntry(depositAccount, openingDate);
  } else if (order.paymentMode === 'Credit') {
    createTrialEntry(sale, openingDate);
    createTrialEntry(customer, openingDate);
  }
}

  



  async function createTrialEntry( data,openingDate ) {
    const newTrialEntry = new TrialBalance({
        organizationId:data.organizationId,
        operationId:data.operationId,
        transactionId: data.transactionId,
        date:openingDate,
        accountId: data.accountId,
        action: data.action,
        debitAmount: data.debitAmount,
        creditAmount: data.creditAmount,
        remark: data.remark
  });
 const trial =  await newTrialEntry.save();



  
  console.log('output:',trial); 
  
  }