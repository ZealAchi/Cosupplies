const mongoose = require("mongoose");

const proyectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    typeProyect: {
      type: Number,
      required: true,
    },
    place: {
      country: { type: String, required: true },
      state: { type: String, required: true },
    },
    Ending: { type: Date, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    projectDescription: {
      type: String,
    },
    projectImage: {
      type: String,
    },
    paymentConditions: {
      advance: { type: String, required: true },
      uponDelivery: { type: String, required: true },
      credit: { type: String, required: true },
    },
    materialLot: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MaterialLot",
      },
    ],
    created: {
      type: Date,
      default: Date.now,
    },
    updated: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Proyect", proyectSchema);
