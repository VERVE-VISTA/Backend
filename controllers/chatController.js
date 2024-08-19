import Chat from '../models/chat.js'
import User from '../models/user.js';  // Adjust the import path as necessary

export const sendMessageFromUserToAdvisor = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    // Basic validation
    if (!senderId || !receiverId || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if sender is a User and receiver is an Advisor
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        if (sender.role !== 'User') {
            return res.status(400).json({ message: 'Sender must be a User' });
        }

        if (receiver.role !== 'Advisor') {
            return res.status(400).json({ message: 'Receiver must be an Advisor' });
        }

        // Create and save the message
        const chatMessage = new Chat({
            sender: senderId,
            receiver: receiverId,
            message
        });

        await chatMessage.save();

        // Return response with only senderId and message
        res.status(201).json({
            senderId: chatMessage.sender,
            message: chatMessage.message
        });
    } catch (error) {
        // Detailed error handling
        console.error('Error sending message:', error.message);
        res.status(500).json({ error: 'An error occurred while sending the message' });
    }
};

  // Function for Advisor-to-User messages
  export const sendMessageFromAdvisorToUser = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
  
    try {
      // Check if sender is an Advisor and receiver is a User
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
  
      if (!sender || !receiver) {
        return res.status(404).json({ message: 'Sender or receiver not found' });
      }
  
      if (sender.role !== 'Advisor') {
        return res.status(400).json({ message: 'Sender must be an Advisor' });
      }
  
      if (receiver.role !== 'User') {
        return res.status(400).json({ message: 'Receiver must be a User' });
      }
  
      // Create and save the message
      const chatMessage = new Chat({
        sender: senderId,
        receiver: receiverId,
        message
      });
  
      await chatMessage.save();
      res.status(201).json({ message: 'Message sent successfully', chatMessage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  
  };
  
  export const getMessagesBetweenUserAndAdvisor = async (req, res) => {
    const { userId, advisorId } = req.params;
  
    try {
      // Fetch messages between user and advisor
      const messages = await Chat.find({
        $or: [
          { sender: userId, receiver: advisorId },
          { sender: advisorId, receiver: userId }
        ]
      })
        .sort({ timestamp: 1 }) // Sort messages by timestamp
        .lean();
  
      // Get unique sender and receiver IDs from messages
      const userIds = [...new Set(messages.flatMap(msg => [msg.sender, msg.receiver]))];
  
      // Fetch user profiles for all involved users
      const users = await User.find({ '_id': { $in: userIds } }).select('name username role').lean();
  
      // Create a map of userId to name/username and role
      const userMap = users.reduce((acc, user) => {
        acc[user._id] = { 
          name: user.role === 'Advisor' ? user.name : user.username,
          role: user.role 
        };
        return acc;
      }, {});
  
      // Add sender and receiver names and roles to messages
      const messagesWithNames = messages.map(msg => ({
        ...msg,
        senderName: userMap[msg.sender].name,
        senderRole: userMap[msg.sender].role,
        receiverName: userMap[msg.receiver].name,
        receiverRole: userMap[msg.receiver].role
      }));
  
      res.json(messagesWithNames);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  // Function to get messages between an Advisor and a User
  export const getMessagesBetweenAdvisorAndUser = async (req, res) => {
    const { advisorId, userId } = req.params;
  
    try {
      // Fetch chat messages between the Advisor and the User
      const chatMessages = await Chat.find({
        $or: [
          { sender: advisorId, receiver: userId },
          { sender: userId, receiver: advisorId }
        ]
      }).sort({ timestamp: 1 });  // Sort by timestamp ascending
  
      res.status(200).json(chatMessages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };