// Importing required modules
const Coupon = require("../../Models/CouponSchema") // Adjust path as needed

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { couponName, price, numberOfBottles } = req.body

    // Validation
    if (!couponName || !price || !numberOfBottles) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ message: "Price must be a positive number" })
    }

    if (typeof numberOfBottles !== "number" || numberOfBottles < 0) {
      return res.status(400).json({ message: "Number of bottles must be a positive number" })
    }

    const newCoupon = new Coupon({ couponName, price, numberOfBottles })
    await newCoupon.save()

    res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon })
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

// Get all coupons
 exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
    res.status(200).json(coupons)
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

// Get a single coupon by ID
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params
    const coupon = await Coupon.findById(id)

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }

    res.status(200).json(coupon)
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

// Update a coupon by ID
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params
    const { couponName, price, numberOfBottles } = req.body

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return res.status(400).json({ message: "Price must be a positive number" })
    }

    if (numberOfBottles !== undefined && (typeof numberOfBottles !== "number" || numberOfBottles < 0)) {
      return res.status(400).json({ message: "Number of bottles must be a positive number" })
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, { couponName, price, numberOfBottles }, { new: true, runValidators: true })

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }

    res.status(200).json({ message: "Coupon updated successfully", coupon: updatedCoupon })
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

// Delete a coupon by ID
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params
    const deletedCoupon = await Coupon.findByIdAndDelete(id)

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }

    res.status(200).json({ message: "Coupon deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}


