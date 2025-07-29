import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetAllOrdersQuery } from "../store/api/orderApi";
import { onOrderUpdate } from "../utils/sse";
import { useDispatch, useSelector } from "react-redux";
import { apiSlice } from "../store/api/apiSlice";

const PreviousOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [sortBy, setSortBy] = useState("recent"); // recent, oldest, alphabetical
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, processing, completed, failed
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading, isError, error } = useGetAllOrdersQuery();

  useEffect(() => {
    if (isError) {
      toast.error(
        error?.data?.message || "Failed to fetch orders. Please try again."
      );
    }
  }, [isError, error]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredOrders = orders
    ? [...orders]
        .filter((order) => {
          if (statusFilter === "all") return true;
          return order.orderStatus === statusFilter;
        })
        .sort((a, b) => {
          if (sortBy === "recent") {
            return new Date(b.createdAt) - new Date(a.createdAt);
          } else if (sortBy === "oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt);
          } else if (sortBy === "alphabetical") {
            // Compares two strings (a.productName and b.productName) lexicographically [A-Z]
            return a.productName.localeCompare(b.productName);
          }
          return 0;
        })
    : [];

  const handleCardClick = (order) => {
    if (order.orderStatus === "pending") {
      navigate(`/generate-ads/${order._id}`);
    } else if (order.orderStatus === "completed") {
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);

    // undefined -> it uses user's default locale (eg: en-IN, en-US, etc.)
  };

  // Create SSE
  const sseConnectionRef = useRef();

  useEffect(() => {
    if (!user) return;

    sseConnectionRef.current = onOrderUpdate(user._id, (data) => {
      console.log("DATA: ", data);
      if (data.eventType == "orderUpdate") {
        dispatch(
          apiSlice.util.updateQueryData("getAllOrders", undefined, (draft) => {
            return draft.map((order) => {
              if (order._id == data.order._id) {
                return data.order;
              } else {
                return order;
              }
            });
          })
        );
      }
    });

    return () => {
      if (sseConnectionRef.current) {
        sseConnectionRef.current.close();
      }
    };
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        {orders && (
          <p className="text-2xl font-semibold ">
            AI Generated Ads ({orders.length})
          </p>
        )}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex items-center">
            <label htmlFor="sortBy" className="mr-2 text-lightest">
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortChange}
              className="bg-darker text-lightest border border-lighter rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-lighter"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="statusFilter" className="mr-2 text-lightest">
              Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="bg-darker text-lightest border border-lighter rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-lighter"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lighter"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-lightest">
          <p>Failed to load orders. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-lighter text-lightest rounded-md hover:bg-opacity-90 transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-lightest">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={() => handleCardClick(order)}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {showModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

const OrderCard = ({ order, onClick, onRetry, formatDate }) => {
  const {
    _id,
    productName,
    description,
    orderStatus,
    video_url,
    createdAt,
    retryCount,
    retryLimit,
    images,
    thumbnail_url,
  } = order;

  // Render card content based on order status
  const renderCardContent = () => {
    if (orderStatus === "pending") {
      return (
        <div className="relative h-56 bg-darker bg-opacity-70 p-4 rounded-md text-center flex flex-col items-center justify-center">
          {images && images.length > 0 && (
            <div className="w-full h-full blur-sm opacity-85 absolute">
              <img
                src={images[0]}
                alt={productName}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <p className="z-50 text-lightest text-base font-semibold">
            Click here to complete your Ad
          </p>
        </div>
      );
    } else if (orderStatus === "processing") {
      return (
        <div className="h-56 bg-darker bg-opacity-70 p-4 rounded-md text-center relative flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lighter mb-3"></div>
          <p className="text-lighter font-medium">Processing</p>
          <p className="text-lightest text-sm mt-2">
            Your ad is being generated
          </p>
        </div>
      );
    } else if (orderStatus === "failed") {
      return (
        <div className="h-56 bg-darker bg-opacity-70 p-4 rounded-md text-center flex flex-col justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-lighter mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lighter font-medium">Generation Failed</p>
          <p className="text-lightest text-sm mt-2 mb-3">
            Retry attempts: {retryCount}/{retryLimit}
          </p>
          <button
            onClick={onRetry}
            disabled={retryCount >= retryLimit}
            className="px-4 py-1 bg-lighter text-lightest rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {retryCount >= retryLimit ? "Limit Reached" : "Retry"}
          </button>
        </div>
      );
    } else {
      // Completed
      return (
        <div className="h-56 bg-darkest overflow-hidden">
          {thumbnail_url && (
            <img
              src={thumbnail_url}
              alt={productName}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      );
    }
  };

  return (
    <div
      className="bg-darkest rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      {renderCardContent()}
      <div className="p-4">
        <h3 className="text-lightest font-medium text-lg truncate">
          {productName}
        </h3>
        <p className="text-lightest text-sm opacity-70 line-clamp-3">
          {description}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lightest text-xs opacity-50">
            {formatDate(createdAt)}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
              orderStatus
            )}`}
          >
            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose, formatDate }) => {
  const {
    productName,
    description,
    scriptLength,
    emotion,
    AIscript,
    images,
    createdAt,
    video_url,
  } = order;

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="backdrop-blur-sm fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-darker rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-lightest">{productName}</h2>
            <button
              onClick={onClose}
              className="text-lightest hover:text-lighter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="bg-darkest rounded-lg overflow-hidden mb-4">
                <video
                  src={video_url}
                  className="w-full h-auto"
                  controls
                  autoPlay
                />
              </div>

              <div className="bg-darkest rounded-lg p-4 mb-4">
                <h3 className="text-lightest font-medium mb-2">
                  Order Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-lightest opacity-70">Created On:</div>
                  <div className="text-lightest">{formatDate(createdAt)}</div>

                  <div className="text-lightest opacity-70">Voice Tone:</div>
                  <div className="text-lightest">{emotion}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-darkest rounded-lg p-4 mb-4">
                <h3 className="text-lightest font-medium mb-2">Description</h3>
                <p className="text-lightest text-sm">{description}</p>
              </div>

              <div className="bg-darkest rounded-lg p-4">
                <h3 className="text-lightest font-medium mb-2">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {images &&
                    images.map((image, index) => (
                      <div
                        key={index}
                        className="bg-darker rounded overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-36 object-contain"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-darker bg-opacity-70 text-lighter";
    case "processing":
      return "bg-darker bg-opacity-70 text-lighter";
    case "failed":
      return "bg-darker bg-opacity-70 text-lighter";
    case "completed":
      return "bg-darker bg-opacity-70 text-lighter";
    default:
      return "bg-darker bg-opacity-70 text-lighter";
  }
};

export default PreviousOrders;
