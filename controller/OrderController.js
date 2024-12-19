const Order = require('../Models/OrderSchema');
const Customer = require('../Models/CustomerSchema')
const SubRoute = require('../Models/SubrouteSchema');
const Item = require('../Models/ItemSchema');
 
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
    if (!cleanedData.orderNumber) {
      return res.status(400).json({ success: false, message: 'Enter Order Number' });
    }
    if (!cleanedData.stock || cleanedData.stock.length === 0) {
      return res.status(400).json({ success: false, message: 'Select an item' });
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

    console.log('SubRoute Before Update:', subRoute);
    console.log('Customer Before Update:', customer);

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

        // Remove the item from subroute stock if quantity becomes 0
        if (subRouteItem.quantity <= 0) {
          subRouteStock.splice(subRouteItemIndex, 1);
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
        // If the item already exists in customer stock, update its quantity
        customerStock[customerItemIndex].quantity += item.quantity;
        customerStock[customerItemIndex].status = isResalable ? "Filled" : undefined;
      } else {
        // Add new item to the customer stock
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
        // Update customer's stock to reflect the return
        const customerItemIndex = customerStock.findIndex(stock => stock.itemId === item.itemId);

        if (customerItemIndex >= 0) {
          const customerItem = customerStock[customerItemIndex];

          if (returnBottleAmount > customerItem.quantity) {
            return res.status(400).json({
              success: false,
              message: `Return amount for item ${item.itemName} exceeds customer's current stock. Available: ${customerItem.quantity}, Returned: ${returnBottleAmount}`
            });
          }

          // Decrement the return amount from customer's stock
          customerItem.quantity -= returnBottleAmount;

          // Remove the item from customer stock if quantity becomes 0
          if (customerItem.quantity <= 0) {
            customerStock.splice(customerItemIndex, 1);
          }
        } else {
          return res.status(400).json({
            success: false,
            message: `Customer does not have item ${item.itemName} in stock for return`
          });
        }

        // Update subroute stock to reflect the returned items
        const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

        if (subRouteItemIndex >= 0) {
          subRouteStock[subRouteItemIndex].quantity += returnBottleAmount;
          // Increment returnBottle count in subroute
          subRouteStock[subRouteItemIndex].returnBottle = (subRouteStock[subRouteItemIndex].returnBottle || 0) + returnBottleAmount;
        } else {
          subRouteStock.push({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: returnBottleAmount,
            returnBottle: returnBottleAmount
          });
        }
      }
    }

    // Save the updated subroute stock
    subRoute.stock = subRouteStock;
    await subRoute.save();

    // Save the updated customer stock
    customer.stock = customerStock;
    await customer.save();

    console.log('Updated SubRoute Stock:', subRouteStock);
    console.log('Updated Customer Stock:', customerStock);

    // Create an order record
    const order = new Order({
      ...cleanedData,
      stock: cleanedData.stock.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        status: "Sold",
      })),
    });

    await order.save();

    // Send success response
    res.status(200).json({ success: true, message: 'Order created successfully' });

  } catch (error) {
    console.error(error);

    // Send error response
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



  //Clean Data 
  function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }