//(((((((((((((((DEFINE COMO ES EL CARRITO QUE CONTIENE LOS PERFUMES))))))))))

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("carts", cartSchema);

export default Cart;