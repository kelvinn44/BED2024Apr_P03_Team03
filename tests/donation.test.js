const sql = require('mssql');
const Donation = require('../models/donation'); 


jest.mock('mssql');

describe('Donation', () => {
    let requestMock, connectionMock;

    beforeEach(() => {
        requestMock = {
            query: jest.fn(),
            input: jest.fn()
        };

        connectionMock = {
            request: jest.fn(() => requestMock),
            close: jest.fn()
        };

        sql.connect.mockResolvedValue(connectionMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getDonations', () => {
        it('should return 5 latest donations', async () => {
            const mockDonations = [
                { donation_id: 1, account_id: 1, firstname: 'John', amount: 50 },
                { donation_id: 2, account_id: 2, firstname: 'Jane', amount: 100 }
            ];

            requestMock.query.mockResolvedValue({ recordset: mockDonations });

            const result = await Donation.getDonations();

            expect(sql.connect).toHaveBeenCalled();
            expect(requestMock.query).toHaveBeenCalledWith(expect.stringContaining('OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY'));
            expect(connectionMock.close).toHaveBeenCalled();
            expect(result).toEqual(mockDonations.map(donation => new Donation(donation.donation_id, donation.account_id, donation.amount, donation.firstname)));
        });

        it('should handle errors', async () => {
            requestMock.query.mockRejectedValue(new Error('Error fetching donations'));

            await expect(Donation.getDonations()).rejects.toThrow('Error fetching donations');

            expect(sql.connect).toHaveBeenCalled();
            expect(connectionMock.close).toHaveBeenCalled();
        });
    });

    describe('createDonation', () => {
        it('should create a new donation', async () => {
            const mockDonation = { donation_id: 1, account_id: 1, firstname: 'John', amount: 100 };
            const mockResult = { recordset: [{ donation_id: 1 }] };
            const mockFetchResult = { recordset: [mockDonation] };

            requestMock.query
                .mockResolvedValueOnce(mockResult)
                .mockResolvedValueOnce(mockFetchResult);

            const result = await Donation.createDonation(1, 100);

            expect(sql.connect).toHaveBeenCalled();
            expect(requestMock.input).toHaveBeenCalledWith('account_id', sql.Int, 1);
            expect(requestMock.input).toHaveBeenCalledWith('amount', sql.Decimal(10, 2), 100);
            expect(requestMock.query).toHaveBeenCalledTimes(2);
            expect(connectionMock.close).toHaveBeenCalled();
            expect(result).toEqual(mockDonation);
        });

        it('should handle errors', async () => {
            requestMock.query.mockRejectedValue(new Error('Error creating donation'));

            await expect(Donation.createDonation(1, 100)).rejects.toThrow('Error creating donation');

            expect(sql.connect).toHaveBeenCalled();
            expect(connectionMock.close).toHaveBeenCalled();
        });
    });

    describe('getDonationsByAccountId', () => {
        it('should return donations for a specific account ID', async () => {
            const mockDonations = [
                { donation_id: 1, account_id: 1, amount: 50 },
                { donation_id: 2, account_id: 1, amount: 100 }
            ];

            requestMock.query.mockResolvedValue({ recordset: mockDonations });

            const result = await Donation.getDonationsByAccountId(1);

            expect(sql.connect).toHaveBeenCalled();
            expect(requestMock.input).toHaveBeenCalledWith('account_id', sql.Int, 1);
            expect(requestMock.query).toHaveBeenCalledWith(expect.stringContaining('WHERE account_id = @account_id'));
            expect(connectionMock.close).toHaveBeenCalled();
            expect(result).toEqual(mockDonations);
        });

        it('should handle errors', async () => {
            requestMock.query.mockRejectedValue(new Error('Error fetching donations by account ID'));

            await expect(Donation.getDonationsByAccountId(1)).rejects.toThrow('Error fetching donations by account ID');

            expect(sql.connect).toHaveBeenCalled();
            expect(connectionMock.close).toHaveBeenCalled();
        });
    });

    describe('getAllDonations', () => {
        it('should return all donations', async () => {
            const mockDonations = [
                { donation_id: 1, account_id: 1, amount: 50, donation_date: '2021-01-01' },
                { donation_id: 2, account_id: 2, amount: 100, donation_date: '2021-01-02' }
            ];

            requestMock.query.mockResolvedValue({ recordset: mockDonations });

            const result = await Donation.getAllDonations();

            expect(sql.connect).toHaveBeenCalled();
            expect(requestMock.query).toHaveBeenCalledWith(expect.stringContaining('SELECT donation_id, account_id, amount, donation_date FROM Donation'));
            expect(connectionMock.close).toHaveBeenCalled();
            expect(result).toEqual(mockDonations);
        });

        it('should handle errors', async () => {
            requestMock.query.mockRejectedValue(new Error('Error fetching all donations'));

            await expect(Donation.getAllDonations()).rejects.toThrow('Error fetching all donations');

            expect(sql.connect).toHaveBeenCalled();
            expect(connectionMock.close).toHaveBeenCalled();
        });
    });

    describe('getRecurringDonationByAccountId', () => {
        it('should return the recurring donation for a specific account ID', async () => {
            const mockRecurringDonation = { recurring_donation_amount: 100 };

            requestMock.query.mockResolvedValue({ recordset: [mockRecurringDonation] });

            const result = await Donation.getRecurringDonationByAccountId(1);

            expect(sql.connect).toHaveBeenCalled();
            expect(requestMock.input).toHaveBeenCalledWith('account_id', sql.Int, 1);
            expect(requestMock.query).toHaveBeenCalledWith(expect.stringContaining('SELECT recurring_donation_amount FROM Account WHERE account_id = @account_id'));
            expect(connectionMock.close).toHaveBeenCalled();
            expect(result).toEqual(mockRecurringDonation);
        });

        it('should handle errors', async () => {
            requestMock.query.mockRejectedValue(new Error('Error fetching recurring donation'));

            await expect(Donation.getRecurringDonationByAccountId(1)).rejects.toThrow('Error fetching recurring donation');

            expect(sql.connect).toHaveBeenCalled();
            expect(connectionMock.close).toHaveBeenCalled();
        });
    });

    describe('updateRecurringDonation', () => {
        it('should update or create a recurring donation', async () => {
            const mockResult = { account_id: 1, amount: 100 };

            requestMock.query.mockResolvedValue(mockResult);

            const result = await Donation.updateRecurringDonation(1, 100);

            expect(sql.connect).toHaveBeenCalled();
            expect(requestMock.input).toHaveBeenCalledWith('account_id', sql.Int, 1);
            expect(requestMock.input).toHaveBeenCalledWith('amount', sql.Decimal(10, 2), 100);
            expect(requestMock.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE Account SET recurring_donation_amount = @amount WHERE account_id = @account_id'));
            expect(connectionMock.close).toHaveBeenCalled();
            expect(result).toEqual(mockResult);
        });

        it('should handle errors', async () => {
            requestMock.query.mockRejectedValue(new Error('Error updating recurring donation'));

            await expect(Donation.updateRecurringDonation(1, 100)).rejects.toThrow('Error updating recurring donation');

            expect(sql.connect).toHaveBeenCalled();
            expect(connectionMock.close).toHaveBeenCalled();
        });
    });
});
