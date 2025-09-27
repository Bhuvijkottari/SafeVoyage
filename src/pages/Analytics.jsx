import React from "react";

export default function Analytics({ users, geofences }) {
  const totalUsers = users.length;
  const totalRoutes = users.length;
  const usersInGeofence = users.filter((user) =>
    geofences.some((g) => {
      const distance = L.latLng(user.currentLocation).distanceTo(L.latLng(g.center));
      return distance <= g.radius;
    })
  ).length;

  const avgDistance =
    users.reduce((sum, u) => sum + u.route.distance, 0) / users.length || 0;

  return (
    <div className="flex gap-4 mb-4">
      <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-purple-500/30 flex-1">
        <p className="text-gray-400">Total Users</p>
        <p className="text-white text-2xl font-bold">{totalUsers}</p>
      </div>
      <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-purple-500/30 flex-1">
        <p className="text-gray-400">Users in Geofence</p>
        <p className="text-red-500 text-2xl font-bold">{usersInGeofence}</p>
      </div>
      <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-purple-500/30 flex-1">
        <p className="text-gray-400">Average Route Distance (km)</p>
        <p className="text-white text-2xl font-bold">{avgDistance.toFixed(1)}</p>
      </div>
    </div>
  );
}
