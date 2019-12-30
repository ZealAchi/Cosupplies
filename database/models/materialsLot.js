const mongoose = require("mongoose");

const materialLotSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },   
    nameMaterialLot: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitMeasurement: {
      type: String,
      required: true,
    },
    technicalData: {
      type: [],
      required: true,
    },
    blueprints: {
      type: [],
    },
    proyect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyects",
    },
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

module.exports = mongoose.model("MaterialLot", materialLotSchema);
