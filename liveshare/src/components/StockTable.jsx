"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from "lucide-react"
import "./StockTable.css"

const StockTable = () => {
  const [stockData, setStockData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchStockData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get("http://localhost:5000/api/scrape")
      // Map scraped quantity -> volume for table consistency
      const mappedData = response.data.map(item => ({
        ...item,
        volume: item.quantity,
      }))
      setStockData(mappedData)
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.")
      console.error("Error fetching stock data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()
  }, [])

  const formatCurrency = (value) => {
    const number = parseFloat(value)
    return isNaN(number)
      ? "-"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }).format(number)
  }

  const formatNumber = (value) => {
    const number = parseFloat(value)
    return isNaN(number)
      ? "-"
      : new Intl.NumberFormat("en-IN").format(number)
  }

  const getChangeBadgeClass = (change) => {
    const num = parseFloat(change)
    if (num > 0) return "badge-positive"
    if (num < 0) return "badge-negative"
    return "badge-neutral"
  }

  const LoadingSkeleton = () => (
    <div className="skeleton-container">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton skeleton-symbol"></div>
          <div className="skeleton skeleton-price"></div>
          <div className="skeleton skeleton-change"></div>
          <div className="skeleton skeleton-price"></div>
          <div className="skeleton skeleton-price"></div>
          <div className="skeleton skeleton-price"></div>
          <div className="skeleton skeleton-volume"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="card">
          <div className="card-header">
            <div className="header-content">
              <div className="header-text">
                <h1 className="dashboard-title">Stock Market Dashboard</h1>
                <p className="dashboard-subtitle">
                  Real-time stock information and market data
                </p>
              </div>
              <button
                onClick={fetchStockData}
                disabled={loading}
                className="refresh-button"
              >
                <RefreshCw className={`refresh-icon ${loading ? "spinning" : ""}`} />
                Refresh
              </button>
            </div>
            {lastUpdated && (
              <p className="last-updated">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>

          <div className="card-content">
            {error && (
              <div className="error-alert">
                <AlertCircle className="error-icon" />
                <p className="error-text">{error}</p>
              </div>
            )}

            {loading ? (
              <LoadingSkeleton />
            ) : stockData.length === 0 ? (
              <div className="empty-state">
                <AlertCircle className="empty-icon" />
                <p className="empty-text">No stock data available</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="stock-table">
                  <thead>
                    <tr className="table-header">
                      <th className="th-right">S.No</th>
                      <th className="th-left">Symbol</th>
                      <th className="th-right">LTP</th>
                      <th className="th-right">Change</th>
                      <th className="th-right">Change %</th>
                      <th className="th-right">Open</th>
                      <th className="th-right">High</th>
                      <th className="th-right">Low</th>
                      <th className="th-right">Volume</th>
                      <th className="th-right">Prev Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.map((stock, index) => (
                      <tr key={index} className="table-row">
                        <td className="td-right">{stock.sno ?? index + 1}</td>
                        <td className="td-symbol">
                          <div className="symbol-text">{stock.symbol}</div>
                        </td>
                        <td className="td-right">{formatCurrency(stock.ltp)}</td>
                        <td className="td-right">{stock.pointChange ?? "-"}</td>
                        <td className="td-right">
                          <span
                            className={`change-badge ${getChangeBadgeClass(
                              stock.changePercent ?? stock.percentChange
                            )}`}
                          >
                            {parseFloat(stock.changePercent ?? stock.percentChange) > 0 && (
                              <TrendingUp className="trend-icon" />
                            )}
                            {parseFloat(stock.changePercent ?? stock.percentChange) < 0 && (
                              <TrendingDown className="trend-icon" />
                            )}
                            {parseFloat(stock.changePercent ?? stock.percentChange) > 0 ? "+" : ""}
                            {stock.changePercent ?? stock.percentChange}%
                          </span>
                        </td>
                        <td className="td-right td-gray">{formatCurrency(stock.open)}</td>
                        <td className="td-right td-green">{formatCurrency(stock.high)}</td>
                        <td className="td-right td-red">{formatCurrency(stock.low)}</td>
                        <td className="td-right">{formatNumber(stock.volume)}</td>
                        <td className="td-right">{formatCurrency(stock.prevClose)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {stockData.length > 0 && (
              <div className="table-footer">
                <div className="footer-content">
                  <span>Showing {stockData.length} stocks</span>
                  <span>Data refreshed automatically</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockTable
