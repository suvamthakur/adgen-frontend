import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetAvatarsQuery,
  useGetVoicesQuery,
  useCreateOrderMutation,
  useGetProductsQuery,
} from "../store/api/orderApi";

const GenerateScript = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    avatarId: "",
    voiceId: "",
    scriptLanguage: "English",
    description: "",
    scriptLength: 150,
    emotion: "Friendly",
  });

  const { data: avatars, isLoading: avatarsLoading } = useGetAvatarsQuery();
  const { data: voices, isLoading: voicesLoading } = useGetVoicesQuery();

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScriptLengthChange = (e) => {
    const value = e.target.value;
    let scriptLength;

    switch (value) {
      case "Short":
        scriptLength = 150;
        break;
      case "Medium":
        scriptLength = 250;
        break;
      case "Long":
        scriptLength = 350;
        break;
      default:
        scriptLength = 150;
    }

    setFormData((prev) => ({
      ...prev,
      scriptLength,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    setSelectedImages(files);

    // Preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleAvatarSelect = (avatarId) => {
    setFormData((prev) => ({
      ...prev,
      avatarId,
    }));
  };

  const handleVoiceSelect = (voiceId) => {
    setFormData((prev) => ({
      ...prev,
      voiceId,
    }));
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    if (!formData.avatarId) {
      toast.error("Please select an avatar");
      return;
    }

    if (!formData.voiceId) {
      toast.error("Please select a voice");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a product description");
      return;
    }

    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderFormData = new FormData();
      orderFormData.append("productName", formData.productName);
      orderFormData.append("avatarId", formData.avatarId);
      orderFormData.append("voiceId", formData.voiceId);
      orderFormData.append("scriptLanguage", formData.scriptLanguage);
      orderFormData.append("description", formData.description);
      orderFormData.append("scriptLength", formData.scriptLength);
      orderFormData.append("emotion", formData.emotion);

      selectedImages.forEach((image) => {
        orderFormData.append("image", image);
      });

      const response = await createOrder(orderFormData).unwrap();

      toast.success("Order created successfully!");
      navigate(`/generate-ads/${response.data._id}`);
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to create order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  // Filter voices based on selected script language
  const filteredVoices = voices?.filter(
    (voice) => voice.language === formData.scriptLanguage
  );

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-darker rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmitStep1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="col-span-1">
              <label htmlFor="productName" className="block text-lightest mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
                required
                placeholder="Enter your product name"
              />
            </div>

            {/* Voice Tone */}
            <div className="col-span-1">
              <label htmlFor="emotion" className="block text-lightest mb-2">
                Voice Tone *
              </label>
              <select
                id="emotion"
                name="emotion"
                value={formData.emotion}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
                required
              >
                <option value="Excited">Excited</option>
                <option value="Friendly">Friendly</option>
                <option value="Serious">Serious</option>
                <option value="Soothing">Soothing</option>
                <option value="Broadcaster">Broadcaster</option>
              </select>
            </div>

            {/* Script Language */}
            <div className="col-span-1">
              <label
                htmlFor="scriptLanguage"
                className="block text-lightest mb-2"
              >
                Script Language *
              </label>
              <select
                id="scriptLanguage"
                name="scriptLanguage"
                value={formData.scriptLanguage}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
                required
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* Script Length */}
            <div className="col-span-1">
              <label
                htmlFor="scriptLength"
                className="block text-lightest mb-2"
              >
                Script Length *
              </label>
              <select
                id="scriptLength"
                name="scriptLength"
                onChange={handleScriptLengthChange}
                className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
                required
                defaultValue="Short"
              >
                <option value="Short">Short (150 chars)</option>
                <option value="Medium">Medium (250 chars)</option>
                <option value="Long">Long (350 chars)</option>
              </select>
            </div>

            {/* Product Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-lightest mb-2">
                Product Description/Features *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
                required
                placeholder="Describe your product and its features"
              ></textarea>
            </div>

            {/* Image */}
            <div className="col-span-2">
              <label className="block text-lightest mb-2">
                Upload Images * (Max 4)
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
                  required
                />
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-58 object-contain rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Avatars */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Select Avatar *</h3>
            {avatarsLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lighter"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {avatars?.map((avatar) => (
                  <div
                    key={avatar._id}
                    onClick={() => handleAvatarSelect(avatar._id)}
                    className={`bg-darkest cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      formData.avatarId === avatar._id
                        ? "border-lighter scale-105"
                        : "border-transparent hover:border-lighter/50"
                    }`}
                  >
                    <img
                      src={avatar.preview_image_url}
                      alt={avatar.avatar_name}
                      className="w-full h-40 object-contain"
                    />
                    <div className="p-2 bg-darkest">
                      <p className="text-center font-medium">
                        {avatar.avatar_name}
                      </p>
                      <p className="text-center text-sm text-gray-400">
                        {avatar.gender}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voices */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Select Voice *</h3>
            {voicesLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lighter"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredVoices?.map((voice) => (
                  <div
                    key={voice._id}
                    onClick={() => handleVoiceSelect(voice._id)}
                    className={`bg-darkest hover:bg-darker border-2 cursor-pointer rounded-lg p-4 transition-all ${
                      formData.voiceId === voice._id
                        ? "border-lighter scale-105"
                        : "border-transparent hover:border-lighter/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{voice.name}</p>
                        <p className="text-sm">
                          {voice.gender} • {voice.language}
                        </p>
                      </div>
                    </div>
                    <audio
                      controls
                      className="w-full mt-2"
                      src={voice.preview_audio}
                    ></audio>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCancel}
              className="px-6 py-2 border border-lighter text-lightest rounded-md hover:bg-darker transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-lighter text-lightest rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-lightest mr-2"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Generate Script"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateScript;
