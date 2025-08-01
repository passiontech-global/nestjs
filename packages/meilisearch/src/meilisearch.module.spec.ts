import { Test, TestingModule } from '@nestjs/testing';
import { MeilisearchModule } from './meilisearch.module';
import { MeilisearchOptions } from './meilisearch.interface';

// Mock MeiliSearch to avoid Headers not defined error
jest.mock('meilisearch', () => {
  return {
    MeiliSearch: jest.fn().mockImplementation(() => ({
      // Add any methods you need to mock
    })),
  };
});

describe('MeilisearchModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MeilisearchModule.forRootAsync({
          useFactory: () =>
            ({
              host: 'http://localhost:7700',
              apiKey: 'test-api-key',
            }) as MeilisearchOptions,
          inject: [],
        }),
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
