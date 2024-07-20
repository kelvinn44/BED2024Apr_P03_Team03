const Donation = require('../models/donation');

// Function to get 5 latest donations
async function getDonations(req, res) {
    try {
        const donations = await Donation.getDonations();
        res.json(donations);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Function to add a donation
async function createDonation(req, res) {
    const { account_id, amount } = req.body;
    try {
        const donation = await Donation.createDonation(account_id, amount);
        res.json(donation);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Function to get all donations
async function getAllDonations(req, res) {
    try {
        const donations = await Donation.getAllDonations();
        res.json(donations);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Function to get donations by account ID
async function getDonationsByAccountId(req, res) {
    const { id } = req.params;
    try {
        const donations = await Donation.getDonationsByAccountId(id);
        res.json(donations);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Function to get recurring donation by account ID
async function getRecurringDonation(req, res) {
    const { id } = req.params;
    try {
        const recurringDonation = await Donation.getRecurringDonationByAccountId(id);
        if (recurringDonation) {
            res.json({ amount: recurringDonation.recurring_donation_amount });
        } else {
            res.status(404).json({ message: 'Recurring donation not found' });
        }
    } catch (error) {
        console.error('Error fetching recurring donation:', error);
        res.status(500).send('Server error');
    }
}

// Function to update/create recurring donation
async function updateRecurringDonation(req, res) {
    const { account_id, amount } = req.body;
    try {
        const result = await Donation.updateRecurringDonation(account_id, amount);
        res.json({ success: true, message: 'Recurring donation updated', amount: result.amount });
    } catch (error) {
        console.error('Error updating recurring donation:', error);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getDonations,
    createDonation,
    getAllDonations,
    getDonationsByAccountId,
    getRecurringDonation,
    updateRecurringDonation
};
