import { useRef, useState } from "react";
import {useAnnounce} from "../store/useAnnounce";
import { Image, Send, X } from "lucide-react";


const AnnounceInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendAnnounces} = useAnnounce();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendAnnounces({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

<form onSubmit={handleSendMessage} className="flex items-center gap-2">
  <div className="flex items-center gap-2 flex-1">
    {/* Text input */}
    <input
      type="text"
      className="w-3/4 sm:w-4/5 input input-bordered rounded-lg input-sm sm:input-md"
      placeholder="Type a message..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    
    {/* Image input (button to trigger file input) */}
    <button
      type="button"
      className={`flex items-center justify-center w-1/4 sm:w-1/5 btn btn-circle 
                  ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <Image size={20} />
    </button>
    
    {/* Hidden file input */}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      ref={fileInputRef}
      onChange={handleImageChange}
    />
  </div>
  
  {/* Send button */}
  <button
    type="submit"
    className="btn btn-sm btn-circle"
    disabled={!text.trim() && !imagePreview}
  >
    <Send size={22} />
  </button>
</form>
    </div>
  );
};
export default AnnounceInput;