import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "./Reviews_management.css";

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get("/api/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const deleteReview = useCallback(async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`/api/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  }, [fetchReviews]);

  const totalPages = useMemo(() => Math.ceil(reviews.length / reviewsPerPage), [reviews]);
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = useMemo(
    () => reviews.slice(indexOfFirst, indexOfLast),
    [reviews, indexOfFirst, indexOfLast]
  );

  return (
    <div className="admin-review-management">
      <h2> Review Management</h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : currentReviews.length === 0 ? (
        <p>No reviews found</p>
      ) : (
        <>
          <table className="review-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Room</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((r) => (
                <tr key={r._id}>
                  <td>{r.userId?.firstname+" "+r.userId?.lastname || "Unknown"}</td>
                  <td>{r.roomId?.type || "N/A"}</td>
                  <td>{r.rating} ⭐</td>
                  <td>{r.comment}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteReview(r._id)}>Delete Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ReviewManagement;
