// Global mock for MeiliSearch to avoid Headers not defined error
jest.mock('meilisearch', () => {
    return {
        MeiliSearch: jest.fn().mockImplementation(() => ({
            // Add any methods you need to mock
        })),
    };
}); 