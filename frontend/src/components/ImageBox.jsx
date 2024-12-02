const ImageBox = ({ message, theme }) => {
    const isUser = message.sender === "user";
  
    return (
      <div
        className={`flex items-start mb-4 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {!isUser && (
          <img
            src="https://via.placeholder.com/30"
            alt="Friend Avatar"
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        <div className={`max-w-xs ${isUser ? "ml-auto" : "mr-auto"}`}>
          <img
            src={message.content}
            alt="Shared Content"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    );
  };
  
  export default ImageBox;
  