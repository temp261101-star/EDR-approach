export default function Unauthorized() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🚫 Access Denied</h1>
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    </div>
  );
}
