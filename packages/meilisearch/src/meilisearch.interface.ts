import { ModuleMetadata, Type } from '@nestjs/common';
import { Config } from 'meilisearch';

export interface MeilisearchOptions extends Config {
  apiKey: string;
  connectionName?: string;
}

export interface MeilisearchOptionsFactory {
  createMeilisearchOptions(): Promise<MeilisearchOptions> | MeilisearchOptions;
}

export type MeilisearchModuleFactoryOptions = MeilisearchOptions;

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
