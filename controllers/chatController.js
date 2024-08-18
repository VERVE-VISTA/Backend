import Chat from '../models/chat.js'
import User from '../models/user.js';  // Adjust the import path as necessary

export const sendMessageFromUserToAdvisor = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
  
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
      res.status(201).json({ message: 'Message sent successfully', chatMessage });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      // Fetch chat messages between the User and the Advisor
      const chatMessages = await Chat.find({
        $or: [
          { sender: userId, receiver: advisorId },
          { sender: advisorId, receiver: userId }
        ]
      }).sort({ timestamp: 1 });  // Sort by timestamp ascending
  
      res.status(200).json(chatMessages);
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