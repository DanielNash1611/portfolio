import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {getPageContextBySlug, getPortfolioContext} from '@/lib/portfolio-guide/context';
import {getNamedProjectIds} from '@/lib/portfolio-guide/project-references';
import {pageClaimBlocks} from '@/lib/portfolio-guide/factual-answers';
import {getPortfolioSearchDocuments} from '@/lib/portfolio-guide/search';
import {validIndex} from '@/lib/search/hybrid';

test('Zimmer public evidence retains single-task, development and shared-ownership qualifications',()=>{
 const page=getPageContextBySlug('zimmer-ai-prototypes');assert.ok(page);
 const text=JSON.stringify(page);
 assert.match(text,/single.task/i);assert.match(text,/not the entire reconciliation/);
 assert.match(text,/future projection, not achieved/);assert.match(text,/not sole engineering ownership/);
 assert.match(text,/No production launch, direct people management, or sustained-impact/);
 assert.doesNotMatch(text,/supply.chain|instrument.supply|inventory|SKU|set deployment/i);
 assert.deepEqual(getNamedProjectIds('What did Daniel do at Zimmer Biomet?'),['zimmer-ai-prototypes']);
 const blocks=pageClaimBlocks(page);assert.equal(blocks.length,5);
 for(const block of blocks){const proof=JSON.stringify(block);assert.match(proof,/single.task/i);assert.match(proof,/future projection, not achieved/);}
});

test('current public adoption copy never assigns a daily timeframe to 800 or 40 active users',()=>{
 const source=['content/portfolio.ts','lib/portfolio-guide/recommendations.ts','app/products/chatgpt-org-scale/page.tsx','data/caseStudies.ts','data/cases.ts','data/positioning.ts','data/featuredWork.ts','data/impact.ts','lib/portfolio-guide/tools/mockEvidence.ts'].map(path=>readFileSync(path,'utf8')).join('\n');
 assert.doesNotMatch(source,/\bdaily active users\b|\bDAU\b/i);
 const page=getPageContextBySlug('chatgpt-enterprise');assert.ok(page);
 assert.match(JSON.stringify(page),/1,000 licensed users and 800 active users/);
 assert.match(JSON.stringify(page),/measurement period is unspecified/);
 assert.doesNotMatch(JSON.stringify(getPortfolioContext()),/800 daily active users|800 DAU/);
});

test('released index covers all current claims without stale embeddings',()=>{
 const index=JSON.parse(readFileSync('content/search-index/portfolio.json','utf8'));
 assert.equal(validIndex(index,getPortfolioSearchDocuments()),true);
 assert.equal(index.records.length,69);
});
