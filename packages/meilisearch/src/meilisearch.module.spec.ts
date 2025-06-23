import { Test, TestingModule } from '@nestjs/testing';
import { MeilisearchModule } from './meilisearch.module';
import { MeilisearchModuleFactoryOptions } from './meilisearch.interface';

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
            }) as MeilisearchModuleFactoryOptions,
          inject: [],
        }),
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
