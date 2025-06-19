import Client from '../models/client.model.js';

// Add a new client
export const addClient = async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, company, address, clientType } = req.body; // Include EID

  
  try {
    if (!firstName || !lastName || !email || !phoneNumber ||!clientType ) { // Check for EID
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    

    const newClient = new Client({
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      address,
      clientType,
      
    });

    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
};

// Get all clients
export const getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

// Get client by ID
export const getClientById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

// Update client by ID
export const updateClientById = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, company, address } = req.body; // Include EID


  try {
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phoneNumber, company, address }, // Include EID in update
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    next(error);
  }
};

// Delete client by ID
export const deleteClientById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};
