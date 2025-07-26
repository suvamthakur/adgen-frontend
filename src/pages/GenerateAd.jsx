import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetOrderQuery,
  useEditProductMutation,
  useGenerateAdMutation,
} from "../store/api/orderApi";

const GenerateAd = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Fetch order details using the orderId from URL
  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useGetOrderQuery(orderId);

  const [generateAd, { isLoading: isGenerationLoading }] =
    useGenerateAdMutation();

  // Handle finish button
  const handleFinish = () => {
    navigate("/previous-orders");
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate("/dashboard");
  };

  // Show error if order fetch fails
  useEffect(() => {
    if (isError) {
      toast.error(
        error?.data?.message || "Failed to fetch order. Please try again."
      );
    }
  }, [isError, error]);

  return (
    <div className="container mx-auto px-4 py-4">
      <p className="text-2xl font-semibold mb-6 text-lightest">
        Generate Video
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lighter"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-lightest">
          <p>Failed to load order details. Please try again.</p>
          <button
            onClick={() => navigate("/generate-ads")}
            className="mt-4 px-6 py-2 bg-lighter text-lightest rounded-md hover:bg-opacity-90 transition-colors"
          >
            Go Back
          </button>
        </div>
      ) : orderData?.products && orderData.products.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {orderData.products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                orderId={orderId}
              />
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              disabled={isGenerationLoading}
              onClick={handleCancel}
              className="px-6 py-2 border border-lighter text-lightest rounded-md hover:bg-darker transition-colors"
            >
              Cancel
            </button>

            <button
              disabled={isGenerationLoading}
              onClick={async () => {
                await generateAd(orderData._id);
                navigate("/previous-orders");
              }}
              className="px-6 py-2 bg-lighter text-lightest rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerationLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-lightest mr-2"></div>
                  <span>Generating</span>
                </div>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-lightest">
          <p>No products found for this order. Please try again.</p>
          <button
            onClick={() => navigate("/generate-ads")}
            className="mt-4 px-6 py-2 bg-lighter text-lightest rounded-md hover:bg-opacity-90 transition-colors"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, orderId }) => {
  const [script, setScript] = useState(product.script);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editProduct] = useEditProductMutation();

  const handleScriptChange = (e) => {
    setScript(e.target.value);
  };

  const handleSaveScript = async () => {
    if (!script.trim()) {
      toast.error("Script cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      await editProduct({
        productId: product._id,
        script: script,
      }).unwrap();

      toast.success("Script updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update script");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-darkest rounded-lg overflow-hidden shadow-md shadow-cyan-900">
      <img
        src={product.image}
        alt="Product"
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        {isEditing ? (
          <div>
            <textarea
              value={script}
              onChange={handleScriptChange}
              rows="6"
              className="w-full px-3 py-2 bg-darker text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
              placeholder="Enter script for this scene"
              style={{ resize: "none" }}
            ></textarea>
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setScript(product.script);
                }}
                className="px-3 py-1 border border-lighter text-lightest rounded-md hover:bg-darker transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSaveScript}
                disabled={isSaving}
                className="px-3 py-1 bg-lighter text-lightest rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-lightest mr-2"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lightest mb-3">{script}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-lightest flex items-center"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateAd;
