import { Module, DynamicModule } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import {
  MeilisearchOptions,
  MeilisearchModuleAsyncOptions,
  MeilisearchOptionsFactory,
} from './meilisearch.interface';

@Module({})
export class MeilisearchModule {
  static MeiliSearch: MeiliSearch;

  static forRoot(options: MeilisearchOptions): DynamicModule {
    if (!options || !options.host || !options.apiKey) {
      throw new Error('Meilisearch options must include host and apiKey');
    }

    const meilisearchProvider = {
      provide: MeiliSearch,
      useFactory: (meilisearchOptions: MeilisearchOptions) => {
        return new MeiliSearch({
          host: meilisearchOptions.host,
          apiKey: meilisearchOptions.apiKey,
        });
      },
      inject: ['MEILISEARCH_OPTIONS'],
    };

    return {
      module: MeilisearchModule,
      providers: [
        // {
        //   provide: 'MEILISEARCH_OPTIONS',
        //   useValue: options,
        // },
        meilisearchProvider,
      ],
      exports: [meilisearchProvider],
      global: true,
    };
  }

  static forRootAsync(options: MeilisearchModuleAsyncOptions): DynamicModule {
    const meilisearchProvider = {
      provide: MeiliSearch,
      useFactory: async (
        meilisearchOptionsFactory: MeilisearchOptionsFactory,
      ) => {
        let meilisearchOptions: MeilisearchOptions;
        if (
          meilisearchOptionsFactory &&
          typeof meilisearchOptionsFactory.createMeilisearchOptions ===
            'function'
        ) {
          meilisearchOptions =
            await meilisearchOptionsFactory.createMeilisearchOptions();
        } else {
          meilisearchOptions =
            meilisearchOptionsFactory as unknown as MeilisearchOptions;
        }

        if (
          !meilisearchOptions ||
          !meilisearchOptions.host ||
          !meilisearchOptions.apiKey
        ) {
          throw new Error('Meilisearch options must include host and apiKey');
        }

        return new MeiliSearch({
          host: meilisearchOptions.host,
          apiKey: meilisearchOptions.apiKey,
        });
      },
      inject: ['MEILISEARCH_OPTIONS'],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MeilisearchModule,
      imports: [...(options.imports || [])],
      providers: [...asyncProviders, meilisearchProvider],
      exports: [meilisearchProvider],
      global: true,
    };
  }

  private static createAsyncProviders(options: MeilisearchModuleAsyncOptions) {
    if (options.useExisting || options.useFactory || options.useClass) {
      return [this.createAsyncOptionsProvider(options)];
    }
    throw new Error(
      'Invalid async configuration. Must provide useExisting, useClass, or useFactory.',
    );
  }

  private static createAsyncOptionsProvider(
    options: MeilisearchModuleAsyncOptions,
  ) {
    if (options.useFactory) {
      return {
        provide: 'MEILISEARCH_OPTIONS',
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    if (options.useClass) {
      return {
        provide: 'MEILISEARCH_OPTIONS',
        useClass: options.useClass,
      };
    }
    if (options.useExisting) {
      return {
        provide: 'MEILISEARCH_OPTIONS',
        useExisting: options.useExisting,
      };
    }
    throw new Error(
      'Invalid async configuration. Must provide useExisting, useClass, or useFactory.',
    );
  }
}
