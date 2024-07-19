const Donation = require('../models/donation');

//Function to get 5 latest donations
async function getDonations(req, res) {
    try {
        const donations = await Donation.getDonations();
        res.json(donations);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

//Function to add a donation
async function createDonation(req, res) {
    const { account_id, amount } = req.body;
    try {
        const donation = await Donation.createDonation(account_id, amount);
        res.json(donation);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

async function getAllDonations(req, res) {
    try {
        const donations = await Donation.getAllDonations();
        res.json(donations);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

async function getDonationsByAccountId(req, res) {
    const { id } = req.params;
    try {
        const donations = await Donation.getDonationsByAccountId(id);
        res.json(donations);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

module.exports = {
    getDonations,
    createDonation,
    getAllDonations,
    getDonationsByAccountId
};