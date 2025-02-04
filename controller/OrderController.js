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

    const { customerAccount, saleAccount, depositAccount } = await dataExist( cleanedData.customerId, cleanedData.depositAccountId );
    if (!customerAccount) {
        res.status(404).json({ message: "Customer Account not found" });
        return false;
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


// Prefix generation
let nextId = 1;
const lastPrefix = await Order.findOne().sort({ _id: -1 });

if (lastPrefix && lastPrefix.orderNumber) {
  const lastIdString = lastPrefix.orderNumber.replace("ORDER-", ""); // Extract the number part
  const lastId = parseInt(lastIdString, 10); // Convert to number

  // Check if lastId is a valid number
  if (!isNaN(lastId)) {
    nextId = lastId + 1;
  }
}

const orderNumber = `ORD-${nextId}`;

// Create an order record
const order = new Order({
  ...cleanedData,
  orderNumber: orderNumber,
  balanceAmount: (cleanedData.totalAmount - cleanedData.paidAmount) || 0,
  stock: cleanedData.stock.map(item => ({
    itemId: item.itemId,
    itemName: item.itemName,
    quantity: item.quantity,
    status: "Sold",
  })),
});

await order.save();


    console.log('Order Created:', order);
    

     //Journal
     await journal( order, customerAccount, saleAccount, depositAccount );

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


exports.editOrder = async (req, res) => {
  console.log("Edit Order Request:", req.body);

  const { id } = req.params;
  console.log("Order ID:", id);

  try {
    const cleanedData = cleanCustomerData(req.body);
    cleanedData.stock = (cleanedData.stock || [])
      .map(item => cleanCustomerData(item))
      .filter(item => item.itemId && item.itemId.trim() !== "");

    if (!id) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    // Fetch existing order
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const { customerAccount, saleAccount, depositAccount } = await dataExist(
      cleanedData.customerId,
      cleanedData.depositAccountId
    );

    if (!customerAccount) {
      return res.status(404).json({ message: "Customer Account not found" });
    }

    const subRoute = await SubRoute.findById(cleanedData.subRouteId);
    if (!subRoute) {
      return res.status(404).json({ success: false, message: "Sub Route not found" });
    }

    const customer = await Customer.findById(cleanedData.customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const subRouteStock = subRoute.stock || [];
    const customerStock = customer.stock || [];

    console.log("Validating and updating stock for new order data...");
    // Validate and update stock for new items
    for (const newItem of cleanedData.stock) {
      console.log(`Processing new order item ${newItem.itemName} (ID: ${newItem.itemId}) with new quantity ${newItem.quantity}`);
      const existingOrderItem = existingOrder.stock.find(item => item.itemId === newItem.itemId);

      if (existingOrderItem) {
        // Calculate quantity difference
        const quantityDiff = newItem.quantity - existingOrderItem.quantity;
        console.log(`For item ${newItem.itemName}: previous quantity = ${existingOrderItem.quantity}, new quantity = ${newItem.quantity}, difference = ${quantityDiff}`);

        // Check if the new order quantity is greater than subroute stock
        const subRouteItem = subRouteStock.find(stock => stock.itemId === newItem.itemId);
        const currentSubRouteQuantity = Number(subRouteItem?.quantity || 0);

        if (newItem.quantity <= 0) {
          // Validate that the new quantity is greater than 0
          console.log(`Invalid quantity for ${newItem.itemName}: Quantity must be greater than 0`);
          return res.status(400).json({
            success: false,
            message: `Quantity for ${newItem.itemName} must be greater than 0.`,
          });
        }

        if (quantityDiff > 0) {
          // If quantity increased, decrement the difference from subroute stock
          console.log(
            `Decreasing ${quantityDiff} from subRoute stock for ${newItem.itemName}. SubRoute stock before: ${currentSubRouteQuantity}`
          );
          if (currentSubRouteQuantity < quantityDiff) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for item ${newItem.itemName}. Available: ${currentSubRouteQuantity}, Requested additional: ${quantityDiff}`,
            });
          }
          subRouteItem.quantity = currentSubRouteQuantity - quantityDiff;
          console.log(`SubRoute updated for ${newItem.itemName}: new quantity = ${subRouteItem.quantity}`);
        } else if (quantityDiff < 0) {
          // If quantity decreased, increment the difference to subroute stock
          console.log(
            `Returning ${Math.abs(quantityDiff)} to subRoute stock for ${newItem.itemName}. SubRoute stock before: ${currentSubRouteQuantity}`
          );
          subRouteItem.quantity = currentSubRouteQuantity + Math.abs(quantityDiff);
          console.log(`SubRoute updated for ${newItem.itemName}: new quantity = ${subRouteItem.quantity}`);
        }

        // Update customer stock
        const customerItem = customerStock.find(stock => stock.itemId === newItem.itemId);
        if (customerItem) {
          const currentCustomerQuantity = Number(customerItem.quantity) || 0;
          const updatedCustomerQuantity = currentCustomerQuantity + quantityDiff;
          customerItem.quantity = updatedCustomerQuantity;
          console.log(`Customer: ${newItem.itemName} updated from ${currentCustomerQuantity} to ${updatedCustomerQuantity}`);

          if (updatedCustomerQuantity <= 0) {
            console.log(`Customer: Removing ${newItem.itemName} as quantity <= 0`);
            customerStock.splice(customerStock.indexOf(customerItem), 1);
          }
        } else if (newItem.quantity > 0) {
          console.log(`Customer: Adding ${newItem.itemName} with quantity ${newItem.quantity}`);
          customerStock.push({
            itemId: newItem.itemId,
            itemName: newItem.itemName,
            quantity: newItem.quantity,
            status: "Filled",
          });
        }
      } else {
        // Replacing an item entirely (which is not allowed in order editing)
        console.log(`Attempted to add or replace item ${newItem.itemName} which is not allowed in order editing.`);
        return res.status(400).json({
          success: false,
          message: "Replacing or adding entirely new items is not permitted during order editing.",
        });
      }
    }

    // Save updated stocks
    subRoute.stock = subRouteStock;
    console.log("Saving updated subRoute stock:", subRoute.stock);
    await subRoute.save();

    customer.stock = customerStock;
    console.log("Saving updated customer stock:", customer.stock);
    await customer.save();

    // Update order details
    console.log("Updating order details...");
    existingOrder.stock = cleanedData.stock.map(item => ({
      itemId: item.itemId,
      itemName: item.itemName,
      quantity: item.quantity,
      status: "Sold",
    }));
    existingOrder.totalAmount = cleanedData.totalAmount;
    existingOrder.paidAmount = cleanedData.paidAmount;
    existingOrder.balanceAmount = (cleanedData.totalAmount - cleanedData.paidAmount) || 0;
    existingOrder.note = cleanedData.note;

    console.log("Saving updated order:", existingOrder);
    await existingOrder.save();

    // Update journal entries
    console.log("Updating journal entries...");
    console.log("Journal params:", {
      order: existingOrder,
      customerAccount,
      saleAccount,
      depositAccount,
    });
    await journal(existingOrder, customerAccount, saleAccount, depositAccount);
    console.log("Journal update completed.");

    res.status(200).json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error editing order:", error);
    res.status(500).json({ success: false, message: "An error occurred while editing the order." });
  }
};





  // Function to generate time and date for storing in the database
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


  async function journal( order, customerAccount, saleAccount, depositAccounts ) {  

    console.log('customeracc:',customerAccount);
    console.log('orderdepositid:',order.depositAccountId);
    console.log('saleaccount:',saleAccount);
    console.log('depositacc:',depositAccounts);
    

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
      debitAmount: order.totalAmount || 0,
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
      creditAmount: order.paidAmount || 0,
      remark: order.note,
    };
    let depositAccount 
   
    if(depositAccounts){
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

    // console.log("sale", sale.debitAmount,  sale.creditAmount);
    // console.log("customer", customer.debitAmount,  customer.creditAmount);
    // console.log("customerPaid", customerPaid.debitAmount,  customerPaid.creditAmount);
    // console.log("depositAccount", depositAccount.debitAmount,  depositAccount.creditAmount);

    // const  debitAmount =  sale.debitAmount  + customer.debitAmount + customerPaid.debitAmount +  depositAccount.debitAmount;
    // const  creditAmount = sale.creditAmount  + customer.creditAmount + customerPaid.creditAmount +  depositAccount.creditAmount ;
  
    // console.log("Total Debit Amount: ", debitAmount );
    // console.log("Total Credit Amount: ", creditAmount );

    const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai","DD/MM/YY","/");
    const openingDate = generatedDateTime.dateTime; 

    //credit
    createTrialEntry( sale ,openingDate )
    createTrialEntry( customer,openingDate )

    if(order.paymentMode === 'Cash'){
        createTrialEntry( customerPaid,openingDate )
        createTrialEntry( depositAccount,openingDate )
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