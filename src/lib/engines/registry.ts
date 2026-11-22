export type EngineCapability =
  | 'ocr'
  | 'pdf-rendering'
  | 'document-extraction'
  | 'table-extraction'
  | 'image-processing'
  | 'compression'
  | 'conversion'
  | 'security'
  | 'inference';

export interface EngineContext {
  reportProgress?: (progress: number, message?: string) => void;
  signal?: AbortSignal;
}

export interface LocalEngine {
  readonly id: string;
  readonly version: string;
  readonly capabilities: readonly EngineCapability[];
  initialize(context?: EngineContext): Promise<void>;
  dispose(): Promise<void>;
  isSupported(): boolean;
}

export interface EngineDescriptor {
  id: string;
  version: string;
  capabilities: readonly EngineCapability[];
  supported: boolean;
  initialized: boolean;
}

export class EngineRegistry {
  private readonly engines = new Map<string, LocalEngine>();
  private readonly initialized = new Set<string>();

  register(engine: LocalEngine): void {
    if (this.engines.has(engine.id)) {
      throw new Error(`An engine with id "${engine.id}" is already registered`);
    }
    this.engines.set(engine.id, engine);
  }

  get(id: string): LocalEngine {
    const engine = this.engines.get(id);
    if (!engine) {
      throw new Error(`Engine "${id}" is not registered`);
    }
    return engine;
  }

  findByCapability(capability: EngineCapability): LocalEngine[] {
    return Array.from(this.engines.values())
      .filter((engine) => engine.capabilities.includes(capability) && engine.isSupported());
  }

  describe(): EngineDescriptor[] {
    return Array.from(this.engines.values()).map((engine) => ({
      id: engine.id,
      version: engine.version,
      capabilities: engine.capabilities,
      supported: engine.isSupported(),
      initialized: this.initialized.has(engine.id),
    }));
  }

  async initialize(id: string, context?: EngineContext): Promise<LocalEngine> {
    const engine = this.get(id);
    if (!engine.isSupported()) {
      throw new Error(`Engine "${id}" is not supported in this environment`);
    }
    await engine.initialize(context);
    this.initialized.add(engine.id);
    return engine;
  }

  async disposeAll(): Promise<void> {
    await Promise.all(Array.from(this.engines.values()).map((engine) => engine.dispose()));
    this.initialized.clear();
  }
}

export function createEngineRegistry(engines: readonly LocalEngine[] = []): EngineRegistry {
  const registry = new EngineRegistry();
  for (const engine of engines) {
    registry.register(engine);
  }
  return registry;
}
