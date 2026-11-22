import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useBatchProcessing } from '@/lib/hooks/useBatchProcessing';

vi.mock('@/lib/tauri-bridge', () => ({
  saveBlobFile: vi.fn(),
}));

describe('useBatchProcessing', () => {
  it('processes files immediately after they are selected', async () => {
    const { result } = renderHook(() => useBatchProcessing({ maxConcurrent: 1 }));
    const file = new File(['pdf'], 'document.pdf', { type: 'application/pdf' });
    const processor = vi.fn(async (_file: File) => new Blob(['compressed']));

    act(() => {
      result.current.addFiles([file]);
    });

    await act(async () => {
      await result.current.startProcessing(processor);
    });

    expect(processor).toHaveBeenCalledOnce();
    expect(processor).toHaveBeenCalledWith(file, expect.any(Function));
    expect(result.current.completedCount).toBe(1);
    expect(result.current.files[0].result).toBeInstanceOf(Blob);
  });

  it('retries files that previously failed', async () => {
    const { result } = renderHook(() => useBatchProcessing({ maxConcurrent: 1 }));
    const file = new File(['pdf'], 'document.pdf', { type: 'application/pdf' });
    let shouldFail = true;
    const processor = vi.fn(async () => {
      if (shouldFail) throw new Error('Compression failed');
      return new Blob(['compressed']);
    });

    act(() => {
      result.current.addFiles([file]);
    });

    await act(async () => {
      await result.current.startProcessing(processor);
    });

    expect(result.current.errorCount).toBe(1);

    shouldFail = false;
    await act(async () => {
      await result.current.startProcessing(processor);
    });

    expect(processor).toHaveBeenCalledTimes(2);
    expect(result.current.completedCount).toBe(1);
    expect(result.current.errorCount).toBe(0);
  });
});
