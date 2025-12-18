"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, LogOut } from "lucide-react"

interface OrderType {
  _id: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
  }
  items: any[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderType[]>([])

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      fetchOrders()
    }
    setLoading(false)
  }, [router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderType["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)))
      }
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("admin-token")
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>

        <Card className="overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Payment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm font-mono">{order._id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 text-sm">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                      <td className="px-6 py-4 text-sm font-semibold">PKR {order.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-xs">
                          <div className="font-mono">****{(order as any).paymentInfo?.cardNumber?.slice(-4) || "****"}</div>
                          <div className="text-muted-foreground">{(order as any).paymentInfo?.cardExpiry || "--/--"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as OrderType["status"])}
                          className={`px-3 py-1 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                            order.status === "delivered"
                              ? "bg-green-50 text-green-700"
                              : order.status === "shipped"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
