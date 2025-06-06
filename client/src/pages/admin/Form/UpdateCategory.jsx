import { useState } from "react";
import { updateCategory } from "../../../services/Admin/AdminAPI";

export default function UpdateCategory({ category, onSuccess }) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [status, setStatus] = useState(category.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateCategory(category._id, { name, description, status });
      onSuccess();
    } catch (err) {
      setError("Cập nhật danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block font-semibold mb-1">Tên danh mục</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          Hoạt động
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Đang cập nhật..." : "Cập nhật"}
      </button>
    </form>
  );
}
