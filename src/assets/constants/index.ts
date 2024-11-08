
import dash from '../images/dash.svg'
import order from '../images/orders2.svg';
import staff from '../images/staff.svg'
import supply from '../images/supply.svg';
import customer from '../images/customer.svg';
import sale from '../images/sale.svg';
import purchase from '../images/purchase.svg';
import reports from '../images/reports.svg';
import accountant from '../images/sale.svg';
import vehicle from '../images/vehicle.svg';
import ride from '../images/ride.png'
import stock from '../images/stock.png'




const navlist = [
  {
    nav: "Dashboard",
    icon:dash,
    route: "/dashboard",
  },
  {
    nav: "Orders",
    icon:order,
    route: "/orders",
    subhead: [
      {
        headName: "Orders",
        subRoute: "/",
      },
    ],
  },
  {
    nav: "Staff",
    icon:staff,
    route: "/staff",
    subhead: [
      {
        headName: "Dashboard",
        subRoute: "/",
      }, 
    ],
  },
  {
    nav: "Route",
    icon:supply,
    route: "/route/createroute",
    subhead: [
      {
        headName: "Active Route",
        subRoute: "/route/activeroute",
      },
      {
        headName: "Main Route",
        subRoute: "/route/createroute",
      },
      {
        headName: "Sub Route",
        subRoute: "/route/subroute",
      },
     
    ],
  },
  {
    nav: "Vehicle",
    icon:vehicle,
    route: "/vehicle",
    subhead: [
      
      {
        headName: "Vehicle",
        subRoute: "/vehicle",
      },
      
    ],
  }, 

 
  {
    nav: "Stock",
    icon:stock,
    route: "/stockloaded",
    subhead: [
      {
        headName: "Stock Loaded",
        subRoute: "/stockloaded",
      },
      {
        headName: "Internal Transfer",
        subRoute: "/internaltransfer",
      },
      {
        headName: "Unload Stock",
        subRoute: "/unloadstock",
      },
      {
        headName: "Items",
        subRoute: "/item",
      },
      {
        headName: "Warehouse",
        subRoute: "/warehouse",
      },
      {
        headName: "W Stock",
        subRoute: "/warstock",
      },

      
      
    ],
  },  {
    nav: "Ride",
    icon:ride,
    route: "/ride",
    subhead: [
      
      {
        headName: "Ride",
        subRoute: "/ride",
      },
      
    ],
  },
  {
    nav: "Customer",
    icon:customer,
    route: "/customer",
    subhead: [
      {
        headName: "Customer",
        subRoute: "/customer"
      },
      
    ],
  },
  {
    nav: "Sales",
    icon:sale,
    route: "/invoice",
    subhead: [
      { headName: "Dashboard", subRoute: "/" },
      { headName: "Invoice", subRoute: "/invoice" },
      { headName: "Reciept", subRoute: "/reciept" },
      { headName: "Credit Notes", subRoute: "/creditnote" },
      { headName: "Bottles", subRoute: "/bottles" },
      { headName: "Coupon", subRoute: "/coupon" },
      { headName: "SalesmanSDr.", subRoute: "/salesman" },
     
    ],
  },
  {
    nav: "Purchase",
    icon:purchase,
    route: "/suppliers",
    subhead: [
      { headName: "Dashboard", subRoute: "/" },
      { headName: "Supplier", subRoute: "/suppliers" },
      { headName: "Purchase Order", subRoute: "/purchaseorder" },
      { headName: "Purchase", subRoute: "/purchase" },
      { headName: "Payment Reciept", subRoute: "/paymentreciept" },
     
    ],
  },
  {
    nav: "Accountant",
    icon:accountant,
    route: "/",
    subhead: [
      { headName: "Dashbord", subRoute: "/" },
      { headName: "Expense", subRoute: "/expense/home" },
    ],

  },
  {
    nav: "Reports",
    icon:reports,
    route: "/creditsale",
    subhead: [
      { headName: "Credit Sale", subRoute: "/creditsale" },
      { headName: "Cash Sale", subRoute: "/cashsale" },
      { headName: "Coupon Sale", subRoute: "/couponsale" },
      { headName: "Trail Balance", subRoute: "/trailbalance" },
      { headName: "Total Sale", subRoute: "/totalsale" },
      { headName: "Return Stock", subRoute: "/returnstock" },
      { headName: "Stock Sold", subRoute: "/stocksold" },
      { headName: "Profit & Lose", subRoute: "/profit-lose" },
      { headName: "Balance Sheet", subRoute: "/balancesheet" },
      { headName: "Day Book", subRoute: "/daybook" },
    ],

  },

 
];
 
export default navlist;