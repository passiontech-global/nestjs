import { ModuleMetadata, Type } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

export interface MeilisearchOptions extends MeiliSearch {
  host: string;
  apiKey: string;
}

export interface MeilisearchOptionsFactory {
  createMeilisearchOptions(): Promise<MeilisearchOptions> | MeilisearchOptions;
}

export type MeilisearchModuleFactoryOptions = Omit<
  MeilisearchOptions,
  'connectionName'
>;

export interface MeilisearchModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  connectionName?: string;
  useExisting?: Type<MeilisearchOptionsFactory>;
  useClass?: Type<MeilisearchOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) =>
    | Promise<MeilisearchModuleFactoryOptions>
    | MeilisearchModuleFactoryOptions;
  inject?: any[];
}
