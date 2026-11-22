'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, FileText, FolderOpen, LockKeyhole, ScanLine, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { Button } from '@/components/ui/Button';
import { getAllTools, getPopularTools, getToolsByCategory } from '@/config/tools';
import { type Locale } from '@/lib/i18n/config';
import { CATEGORY_INFO, type ToolCategory } from '@/types/tool';

interface HomePageClientProps {
  locale: Locale;
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

const categoryOrder: ToolCategory[] = [
  'organize-manage',
  'edit-annotate',
  'convert-to-pdf',
  'convert-from-pdf',
  'optimize-repair',
  'secure-pdf',
];

const categoryIcons: Record<ToolCategory, typeof Wrench> = {
  'organize-manage': FolderOpen,
  'edit-annotate': ScanLine,
  'convert-to-pdf': FileText,
  'convert-from-pdf': ArrowUpRight,
  'optimize-repair': Wrench,
  'secure-pdf': LockKeyhole,
};

const categoryTranslationKeys: Record<ToolCategory, string> = {
  'organize-manage': 'organizeManage',
  'edit-annotate': 'editAnnotate',
  'convert-to-pdf': 'convertToPdf',
  'convert-from-pdf': 'convertFromPdf',
  'optimize-repair': 'optimizeRepair',
  'secure-pdf': 'securePdf',
};

export default function HomePageClient({ locale, localizedToolContent }: HomePageClientProps) {
  const t = useTranslations();
  const allTools = getAllTools();
  const popularTools = getPopularTools();
  const organizeTools = getToolsByCategory('organize-manage').slice(0, 6);

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]">
      <Header locale={locale} />

      <main id="main-content" tabIndex={-1}>
        <section className="home-hero border-b border-[hsl(var(--color-border))]" aria-labelledby="hero-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12 lg:pb-28 lg:pt-40">
            <div className="flex flex-col justify-center">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--color-primary))]">
                PDFeditz / AkshHQ
              </p>
              <h1 id="hero-title" className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {t('home.hero.title')}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[hsl(var(--color-muted-foreground))]">
                {t('home.hero.subtitle')}. No account. No upload queue. Just the tool you need.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href={`/${locale}/studio`}>
                  <Button size="lg" className="h-12 rounded-md px-6 text-base shadow-[0_12px_24px_rgba(49,88,212,0.2)]">
                    Open PDF Studio
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href={`/${locale}/tools`}>
                  <Button variant="outline" size="lg" className="h-12 rounded-md px-6 text-base">
                    {t('home.hero.cta')}
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[hsl(var(--color-muted-foreground))]">
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[hsl(var(--color-success))]" /> {t('home.features.privacy.title')}</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[hsl(var(--color-success))]" /> {t('home.features.free.title')}</span>
              </div>
            </div>

            <div className="relative min-h-[360px] lg:min-h-[470px]">
              <div className="absolute inset-0 border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-5 shadow-[0_24px_70px_rgba(24,34,43,0.08)] sm:p-7">
                <div className="flex items-center justify-between border-b border-[hsl(var(--color-border))] pb-4 text-xs uppercase tracking-[0.14em] text-[hsl(var(--color-muted-foreground))]">
                  <span>Workspace index</span>
                  <span className="font-mono text-[hsl(var(--color-primary))]">LOCAL / 00</span>
                </div>
                <div className="flex h-[calc(100%-52px)] flex-col justify-between pt-7">
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Start with a document</p>
                    <p className="mt-3 max-w-sm text-3xl font-semibold leading-tight tracking-[-0.03em]">
                      Organize, edit, convert, and protect PDFs in one place.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ['01', 'Merge & organize', 'organize-manage'],
                      ['02', 'Edit & annotate', 'edit-annotate'],
                      ['03', 'Convert files', 'convert-from-pdf'],
                      ['04', 'Secure documents', 'secure-pdf'],
                    ].map(([number, label, category]) => {
                      const Icon = categoryIcons[category as ToolCategory];
                      return (
                        <Link
                          key={category}
                          href={`/${locale}/tools?category=${category}`}
                          className="group flex items-center gap-3 border-t border-[hsl(var(--color-border))] py-3 transition-colors hover:text-[hsl(var(--color-primary))]"
                        >
                          <span className="font-mono text-xs text-[hsl(var(--color-muted-foreground))]">{number}</span>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          <span className="text-sm font-medium">{label}</span>
                          <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden border border-[hsl(var(--color-border))] bg-[hsl(var(--color-accent))] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_28px_rgba(238,112,71,0.22)] sm:block">
                Files stay on your device
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[hsl(var(--color-border))] py-10" aria-labelledby="popular-tools-heading">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-6 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--color-muted-foreground))]">Start here</p>
                <h2 id="popular-tools-heading" className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{t('home.popularTools.title')}</h2>
              </div>
              <Link href={`/${locale}/tools`} className="hidden items-center gap-2 text-sm font-medium text-[hsl(var(--color-primary))] sm:flex">
                View all tools <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ToolGrid tools={popularTools} locale={locale} localizedToolContent={localizedToolContent} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="featured-tools-heading">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--color-primary))]">The tool index</p>
              <h2 id="featured-tools-heading" className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em]">
                Everything you need to finish the file.
              </h2>
              <p className="mt-5 max-w-md leading-7 text-[hsl(var(--color-muted-foreground))]">
                {t('home.categoriesSection.description', { count: allTools.length })}. Choose a category, then work locally with clear feedback at every step.
              </p>
              <Link href={`/${locale}/tools`} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--color-primary))]">
                Browse the complete index <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="border-t border-[hsl(var(--color-border))]">
              {organizeTools.map((tool, index) => (
                <Link key={tool.id} href={`/${locale}/tools/${tool.slug}`} className="group flex items-center gap-4 border-b border-[hsl(var(--color-border))] py-5">
                  <span className="font-mono text-xs text-[hsl(var(--color-muted-foreground))]">0{index + 1}</span>
                  <span className="flex-1 text-lg font-medium transition-colors group-hover:text-[hsl(var(--color-primary))]">
                    {localizedToolContent?.[tool.id]?.title || tool.id.replace(/-/g, ' ')}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-[hsl(var(--color-muted-foreground))] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]" aria-labelledby="categories-heading">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--color-muted-foreground))]">Six ways in</p>
                <h2 id="categories-heading" className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{t('home.categoriesSection.title')}</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[hsl(var(--color-muted-foreground))]">A focused index keeps the breadth of PDFeditz useful instead of overwhelming.</p>
            </div>
            <div className="grid gap-x-10 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
              {categoryOrder.map((category, index) => {
                const Icon = categoryIcons[category];
                const key = categoryTranslationKeys[category];
                return (
                  <Link key={category} href={`/${locale}/tools?category=${category}`} className="group flex gap-4 border-t border-[hsl(var(--color-border))] py-6">
                    <span className="font-mono text-xs text-[hsl(var(--color-muted-foreground))]">0{index + 1}</span>
                    <div className="flex-1">
                      <Icon className="mb-4 h-5 w-5 text-[hsl(var(--color-primary))]" aria-hidden="true" />
                      <h3 className="font-semibold group-hover:text-[hsl(var(--color-primary))]">{t(`home.categories.${key}`)}</h3>
                      <p className="mt-2 text-sm leading-6 text-[hsl(var(--color-muted-foreground))]">{t(`home.categoriesDescription.${key}`)}</p>
                      <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(var(--color-muted-foreground))]">{CATEGORY_INFO[category].name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
