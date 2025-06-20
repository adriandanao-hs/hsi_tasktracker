import { FormEvent, useState } from "react";

interface AnnouncementModalProps {
  onClose: () => void;
}

const departments = ["Web Dev", "Sys Ad"]; // Example departments

export default function AnnouncementModal({ onClose }: AnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const handleDepartmentChange = (e: FormEvent<HTMLSelectElement>) => {
    const options = e.currentTarget.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedDepartments(selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:10533/api/announcement/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          departments: selectedDepartments,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to post announcement");
      }

      setTitle("");
      setMessage("");
      setSelectedDepartments([]);
      onClose();
    } catch (err: any) {
      setError(
        err.message || "An error occurred while posting the announcement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Post Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          ></textarea>
          <div className="border rounded px-4 py-2">
            <label className="block font-medium mb-1">Departments:</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {departments.map((department) => (
                <label key={department} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={department}
                    checked={selectedDepartments.includes(department)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedDepartments((prev) =>
                        isChecked
                          ? [...prev, department]
                          : prev.filter((d) => d !== department)
                      );
                    }}
                  />
                  <span>{department}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
