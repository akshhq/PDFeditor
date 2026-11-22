import { describe, expect, it, vi } from 'vitest';
import { createEngineRegistry, type LocalEngine } from './registry';

function createEngine(): LocalEngine {
  return {
    id: 'test-engine',
    version: '1.0.0',
    capabilities: ['document-extraction'],
    isSupported: () => true,
    initialize: vi.fn().mockResolvedValue(undefined),
    dispose: vi.fn().mockResolvedValue(undefined),
  };
}

describe('EngineRegistry', () => {
  it('initializes supported engines and reports lifecycle state', async () => {
    const engine = createEngine();
    const registry = createEngineRegistry([engine]);

    await registry.initialize('test-engine');

    expect(registry.findByCapability('document-extraction')).toEqual([engine]);
    expect(registry.describe()[0].initialized).toBe(true);
    expect(engine.initialize).toHaveBeenCalledOnce();

    await registry.disposeAll();
    expect(registry.describe()[0].initialized).toBe(false);
    expect(engine.dispose).toHaveBeenCalledOnce();
  });

  it('rejects duplicate engine identifiers', () => {
    const first = createEngine();
    const second = createEngine();
    const registry = createEngineRegistry([first]);

    expect(() => registry.register(second)).toThrow('already registered');
  });
});
