import mongoose from "mongoose";

const scrapeSchema = mongoose.Schema({
    symbol: {
        type: String,
        required: true,
    },
    ltp: {
        type: Number,
        required: true,
    },
    changePercent: {
        type: Number,
        required: true,
    },
    open: {
        type: Number,
        required: true,
    },
    high: {
        type: Number,
        required: true,
    },
    low: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
})

export const Scrape = mongoose.model('Scrape', scrapeSchema);

