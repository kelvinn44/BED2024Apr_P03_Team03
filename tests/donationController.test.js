const donationController = require("../controllers/donationController");
const Donation = require("../models/donation");


jest.mock('../models/Donation', () => ({
    getDonations: jest.fn(),
    createDonation: jest.fn(),
    getAllDonations: jest.fn(),
    getDonationsByAccountId: jest.fn(),
    getRecurringDonationByAccountId: jest.fn(),
    updateRecurringDonation: jest.fn()
}));

describe("donationController.getDonations", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 5 latest donations", async () => {
        const mockDonations = [
            { donation_id: 1, account_id: 1, firstname: 'John', amount: 50 },
            { donation_id: 2, account_id: 2, firstname: 'Jane', amount: 100 }
        ];

        Donation.getDonations.mockResolvedValue(mockDonations);

        const req = {};
        const res = { json: jest.fn() };

        await donationController.getDonations(req, res);

        expect(Donation.getDonations).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockDonations);
    });

    it("should handle errors", async () => {
        const error = new Error("Error fetching donations");
        Donation.getDonations.mockRejectedValue(error);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await donationController.getDonations(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});

describe("donationController.createDonation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new donation", async () => {
        const mockDonation = { donation_id: 1, account_id: 1, firstname: 'John', amount: 100 };
        Donation.createDonation.mockResolvedValue(mockDonation);

        const req = { body: { account_id: 1, amount: 100 } };
        const res = { json: jest.fn() };

        await donationController.createDonation(req, res);

        expect(Donation.createDonation).toHaveBeenCalledWith(1, 100);
        expect(res.json).toHaveBeenCalledWith(mockDonation);
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const error = new Error("Error creating donation");
        Donation.createDonation.mockRejectedValue(error);

        const req = { body: { account_id: 1, amount: 100 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await donationController.createDonation(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});

describe("donationController.getAllDonations", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return all donations", async () => {
        const mockDonations = [
            { donation_id: 1, account_id: 1, firstname: 'John', amount: 50 },
            { donation_id: 2, account_id: 2, firstname: 'Jane', amount: 100 }
        ];

        Donation.getAllDonations.mockResolvedValue(mockDonations);

        const req = {};
        const res = { json: jest.fn() };

        await donationController.getAllDonations(req, res);

        expect(Donation.getAllDonations).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockDonations);
    });

    it("should handle errors", async () => {
        const error = new Error("Error fetching all donations");
        Donation.getAllDonations.mockRejectedValue(error);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await donationController.getAllDonations(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});

describe("donationController.getDonationsByAccountId", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return donations for a specific account ID", async () => {
        const mockDonations = [
            { donation_id: 1, account_id: 1, amount: 50 },
            { donation_id: 2, account_id: 1, amount: 100 }
        ];

        Donation.getDonationsByAccountId.mockResolvedValue(mockDonations);

        const req = { params: { id: 1 } };
        const res = { json: jest.fn() };

        await donationController.getDonationsByAccountId(req, res);

        expect(Donation.getDonationsByAccountId).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith(mockDonations);
    });

    it("should handle errors", async () => {
        const error = new Error("Error fetching donations by account ID");
        Donation.getDonationsByAccountId.mockRejectedValue(error);

        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await donationController.getDonationsByAccountId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});

describe("donationController.getRecurringDonation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return recurring donation amount for a specific account ID", async () => {
        const mockRecurringDonation = { recurring_donation_amount: 50 };

        Donation.getRecurringDonationByAccountId.mockResolvedValue(mockRecurringDonation);

        const req = { params: { id: 1 } };
        const res = { json: jest.fn() };

        await donationController.getRecurringDonation(req, res);

        expect(Donation.getRecurringDonationByAccountId).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({ amount: 50 });
    });

    it("should return 404 if recurring donation is not found", async () => {
        Donation.getRecurringDonationByAccountId.mockResolvedValue(null);

        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await donationController.getRecurringDonation(req, res);

        expect(Donation.getRecurringDonationByAccountId).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Recurring donation not found' });
    });

    it("should handle errors", async () => {
        const error = new Error("Error fetching recurring donation");
        Donation.getRecurringDonationByAccountId.mockRejectedValue(error);

        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await donationController.getRecurringDonation(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});

describe("donationController.updateRecurringDonation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update or create a recurring donation", async () => {
        const mockResult = { amount: 100 };

        Donation.updateRecurringDonation.mockResolvedValue(mockResult);

        const req = { body: { account_id: 1, amount: 100 } };
        const res = { json: jest.fn() };

        await donationController.updateRecurringDonation(req, res);

        expect(Donation.updateRecurringDonation).toHaveBeenCalledWith(1, 100);
        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Recurring donation updated', amount: 100 });
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const error = new Error("Error updating recurring donation");
        Donation.updateRecurringDonation.mockRejectedValue(error);

        const req = { body: { account_id: 1, amount: 100 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await donationController.updateRecurringDonation(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});