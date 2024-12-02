const MessageBox = ({ message, theme }) => {
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
      <div
        style={{
          backgroundColor: isUser ? theme.button : theme.secondary,
          color: isUser ? "#FFFFFF" : theme.text,
        }}
        className={`p-3 rounded-lg max-w-xs ${
          isUser ? "ml-auto" : "mr-auto"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBox;
