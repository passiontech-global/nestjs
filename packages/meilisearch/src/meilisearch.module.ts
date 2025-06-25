import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import {
  MeilisearchOptions,
  MeilisearchOptionsFactory,
  MeilisearchModuleAsyncOptions,
  // MeilisearchModuleFactoryOptions,
} from './meilisearch.interface';

@Module({})
export class MeilisearchModule {
  static forRoot(options: MeilisearchOptions): DynamicModule {
    const meilisearchProvider: Provider = {
      provide: 'MEILISEARCH_CLIENT',
      useFactory: () => {
        return new MeiliSearch({
          host: options.host,
          apiKey: options.apiKey,
        });
      },
    };

    return {
      module: MeilisearchModule,
      providers: [meilisearchProvider],
      exports: [meilisearchProvider],
    };
  }
  static forRootAsync(options: MeilisearchModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    const meilisearchProvider: Provider = {
      provide: 'MEILISEARCH_CLIENT',
      useFactory: async (meilisearchOptions: MeilisearchOptions) => {
        return new MeiliSearch({
          host: meilisearchOptions.host,
          apiKey: meilisearchOptions.apiKey,
        });
      },
      inject: ['MEILISEARCH_OPTIONS'],
    };

    return {
      module: MeilisearchModule,
      imports: options.imports,
      providers: [...asyncProviders, meilisearchProvider],
      exports: [meilisearchProvider],
      global: true,
    };
  }

  private static createAsyncProviders(
    options: MeilisearchModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory || options.useClass) {
      return [this.createAsyncOptionsProvider(options)];
    }
    throw new Error(
      'Invalid async configuration. Must provide useExisting, useClass, or useFactory.',
    );
  }

  private static createAsyncOptionsProvider(
    options: MeilisearchModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: 'MEILISEARCH_OPTIONS',
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const useClass = options.useClass || options.useExisting;
    if (!useClass) {
      throw new Error(
        'Invalid async configuration. Must provide useClass or useExisting.',
      );
    }

    return {
      provide: 'MEILISEARCH_OPTIONS',
      useFactory: async (optionsFactory: MeilisearchOptionsFactory) =>
        await optionsFactory.createMeilisearchOptions(),
      inject: [useClass],
    };
  }
}
