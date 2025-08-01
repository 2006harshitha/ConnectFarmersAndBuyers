{
  /*import React, { useEffect, useState } from "react";
import { getFarmerOrders } from "../../services/farmerService";
import { useAuth } from "../../context/authContext";

const FarmerAnalytics = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) getFarmerOrders(user._id).then((res) => setOrders(res.data));
  }, [user]);

  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <h2>Analytics</h2>
      <p>Total Sales: ${totalSales}</p>
      <p>Pending Orders: {pendingOrders}</p>
    </div>
  );
};

export default FarmerAnalytics;*/
}
